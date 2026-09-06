import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { PastedEntry } from '../../types';
import * as API from '../../api';
import { parseStoredImages, resolveMediaUrl } from '../../utils/media';
import { ocrImage } from '../../utils/extractSearchText';

interface PastedHistoryListProps {
  taskId: number;
  entries: PastedEntry[];
  onChange: (entries: PastedEntry[]) => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const PastedHistoryList: React.FC<PastedHistoryListProps> = ({
  taskId,
  entries,
  onChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!entries.length) return null;

  const editingEntry = editingIndex !== null ? entries[editingIndex] : null;

  const openEdit = (index: number) => {
    const entry = entries[index];
    setEditingIndex(index);
    setEditText(entry.text || '');
    setEditImage(null);
  };

  const closeEdit = () => {
    setEditingIndex(null);
    setEditText('');
    setEditImage(null);
  };

  const handleRemove = async (index: number) => {
    const entry = entries[index];
    if (!window.confirm('Remove this pasted item?')) return;

    // Local-only (not saved yet)
    if (!entry.id) {
      onChange(entries.filter((_, i) => i !== index));
      return;
    }

    setBusy(true);
    try {
      await API.deletePastedHistory(taskId, entry.id);
      onChange(entries.filter((_, i) => i !== index));
    } catch (err: any) {
      console.error('Failed to delete pasted entry', err);
      const status = err?.response?.status;
      const msg =
        status === 404
          ? 'Pasted item not found on server (restart the server if you just added delete support).'
          : `Could not remove pasted item from the database${status ? ` (${status})` : ''}.`;
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setEditImage(dataUrl);
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editingEntry) return;

    setBusy(true);
    try {
      let searchable = editText;
      const newImages = editImage ? [editImage] : [];

      if (editImage) {
        try {
          const ocr = await ocrImage(editImage);
          if (ocr) searchable = ocr;
        } catch (err) {
          console.error('OCR on edit failed', err);
        }
      }

      // Not yet in DB — update local only
      if (!editingEntry.id) {
        const next = [...entries];
        next[editingIndex] = {
          ...editingEntry,
          text: searchable,
          images: editImage ? [editImage] : editingEntry.images,
        };
        onChange(next);
        closeEdit();
        return;
      }

      const { data } = await API.updatePastedHistory(
        taskId,
        editingEntry.id,
        searchable,
        newImages
      );

      const serverImages = parseStoredImages(data.images).map(resolveMediaUrl);
      const next = [...entries];
      next[editingIndex] = {
        id: data.id,
        text: data.text || searchable,
        images: editImage
          ? [editImage]
          : serverImages.length
            ? serverImages
            : editingEntry.images,
      };
      onChange(next);
      closeEdit();
    } catch (err) {
      console.error('Failed to update pasted entry', err);
      alert('Could not save edits to the database.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box mt={2}>
      {entries.map((entry, idx) => {
        const textLooksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(entry.text || '');
        const showText =
          Boolean(entry.text) && !textLooksLikeHtml && entry.images.length === 0;

        return (
          <Box key={entry.id ?? `local-${idx}`} sx={{ mb: 2, p: 2, border: '1px solid #ddd' }}>
            <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
              <Button
                size="small"
                variant="outlined"
                disabled={busy}
                onClick={() => openEdit(idx)}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={busy}
                onClick={() => handleRemove(idx)}
              >
                Remove
              </Button>
            </Box>

            {showText && (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#333' }}>
                {entry.text}
              </Typography>
            )}

            {entry.images.length > 0 && (
              <Box mt={1} display="flex" flexDirection="column" gap={1}>
                {entry.images.map((img, i2) => (
                  <img
                    key={i2}
                    src={img}
                    alt="Pasted"
                    style={{ width: '100%', border: '1px solid #ccc' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        );
      })}

      <Dialog open={editingIndex !== null} onClose={busy ? undefined : closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit pasted item</DialogTitle>
        <DialogContent>
          <TextField
            label="Searchable text"
            fullWidth
            multiline
            minRows={3}
            margin="dense"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            helperText="Used by Search Tasks. Replacing the image will re-run OCR."
          />

          <Box mt={2}>
            <Button variant="outlined" onClick={() => fileInputRef.current?.click()} disabled={busy}>
              Replace image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePickImage}
            />
          </Box>

          {(editImage || editingEntry?.images?.[0]) && (
            <Box mt={2} sx={{ border: '1px solid #ddd' }}>
              <img
                src={editImage || editingEntry?.images?.[0]}
                alt="Preview"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} disabled={busy}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={busy}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PastedHistoryList;
