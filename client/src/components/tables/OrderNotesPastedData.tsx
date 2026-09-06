import React, { useRef, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import html2canvas from 'html2canvas';
import { Task } from '../../types';
import { htmlToPlainText, ocrImage } from '../../utils/extractSearchText';

interface OrderNotesPastedDataProps {
  selectedTask: Task;
  onSavePastedData?: (taskId: number, text: string, images: string[]) => void | Promise<void>;
}

const looksLikeHtml = (str: string) => /<\/?[a-z][\s\S]*>/i.test(str);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function collectClipboardImages(clipboardData: DataTransfer): Promise<string[]> {
  const files: File[] = [];
  const seen = new Set<string>();

  const pushFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const key = `${file.type}:${file.size}:${file.name}`;
    if (seen.has(key)) return;
    seen.add(key);
    files.push(file);
  };

  if (clipboardData.files?.length) {
    for (let i = 0; i < clipboardData.files.length; i++) {
      pushFile(clipboardData.files[i]);
    }
  }

  if (clipboardData.items?.length) {
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        pushFile(item.getAsFile());
      }
    }
  }

  return Promise.all(files.map(readFileAsDataUrl));
}

function isSubstantialHtml(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed) return false;
  const withoutTags = trimmed.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (withoutTags.length < 20 && /<img\b/i.test(trimmed)) return false;
  return (
    /<table\b/i.test(trimmed) ||
    /StartFragment/i.test(trimmed) ||
    withoutTags.length > 40 ||
    (trimmed.match(/<(p|div|tr|td|span)\b/gi) || []).length >= 3
  );
}

async function convertHtmlToImage(html: string): Promise<string> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '16px';
  container.style.background = '#ffffff';
  container.style.color = '#222222';
  container.style.zIndex = '-1';
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } finally {
    document.body.removeChild(container);
  }
}

type PasteJob =
  | { type: 'images'; images: string[] }
  | { type: 'html'; html: string; fallbackText: string }
  | { type: 'text'; text: string };

const OrderNotesPastedData: React.FC<OrderNotesPastedDataProps> = ({
  selectedTask,
  onSavePastedData,
}) => {
  const [textDraft, setTextDraft] = useState<{ [taskId: number]: string }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingCountRef = useRef(0);

  const addEntry = (taskId: number, text: string, images: string[]) => {
    if (!onSavePastedData) return;
    if (!text && images.length === 0) return;
    onSavePastedData(taskId, text, images);
  };

  const enqueue = (taskId: number, job: PasteJob) => {
    pendingCountRef.current += 1;
    setIsBusy(true);

    queueRef.current = queueRef.current
      .then(async () => {
        if (job.type === 'images') {
          for (const img of job.images) {
            setStatusMessage('Reading text from screenshot for search…');
            let searchable = '';
            try {
              searchable = await ocrImage(img);
            } catch (err) {
              console.error('OCR failed', err);
            }
            addEntry(taskId, searchable, [img]);
          }
          return;
        }

        if (job.type === 'html') {
          const searchable = htmlToPlainText(job.html) || job.fallbackText || '';
          setStatusMessage('Converting order to image…');
          try {
            const dataUrl = await convertHtmlToImage(job.html);
            addEntry(taskId, searchable, [dataUrl]);
          } catch (err) {
            console.error('Failed to convert pasted HTML to image', err);
            if (searchable && !looksLikeHtml(searchable)) {
              addEntry(taskId, searchable, []);
            }
          }
          return;
        }

        if (job.text && !looksLikeHtml(job.text)) {
          addEntry(taskId, job.text, []);
        }
      })
      .catch((err) => {
        console.error('Paste queue error', err);
      })
      .finally(() => {
        pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
        if (pendingCountRef.current === 0) {
          setIsBusy(false);
          setStatusMessage('');
        }
      });
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const taskId = selectedTask.id;
    const { clipboardData } = e;

    let nativeImages: string[] = [];
    try {
      nativeImages = await collectClipboardImages(clipboardData);
    } catch (err) {
      console.error('Failed to read clipboard images', err);
    }

    if (nativeImages.length > 0) {
      enqueue(taskId, { type: 'images', images: nativeImages });
      return;
    }

    const rawHtml = clipboardData.getData('text/html');
    const rawPlain = clipboardData.getData('text/plain');
    const rawText = clipboardData.getData('text');
    const fallbackText = (rawPlain || rawText || '').trim();

    if (rawHtml && isSubstantialHtml(rawHtml)) {
      enqueue(taskId, { type: 'html', html: rawHtml, fallbackText });
      return;
    }

    if (fallbackText && !looksLikeHtml(fallbackText)) {
      setTextDraft((prev) => ({
        ...prev,
        [taskId]: prev[taskId] ? `${prev[taskId]}\n${fallbackText}` : fallbackText,
      }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedTask) return;
    setTextDraft((prev) => ({
      ...prev,
      [selectedTask.id]: e.target.value,
    }));
  };

  const handleSaveTextClick = () => {
    if (!selectedTask || isBusy) return;
    const text = (textDraft[selectedTask.id] || '').trim();
    const safeText = looksLikeHtml(text) ? '' : text;
    if (!safeText) return;

    addEntry(selectedTask.id, safeText, []);
    setTextDraft((prev) => ({
      ...prev,
      [selectedTask.id]: '',
    }));
  };

  const content = textDraft[selectedTask.id] || '';

  return (
    <Box>
      <Typography variant="h6">Paste Task Data</Typography>
      <TextField
        label="Paste Here"
        fullWidth
        multiline
        rows={4}
        margin="dense"
        variant="outlined"
        onPaste={handlePaste}
        onChange={handleTextChange}
        value={content}
        helperText="Each paste is saved to the database automatically and indexed for Search Tasks."
      />

      <Box
        mt={1}
        p={2}
        tabIndex={0}
        onPaste={handlePaste}
        sx={{
          border: '1px dashed #bbb',
          borderRadius: 1,
          backgroundColor: '#fafafa',
          outline: 'none',
          cursor: 'text',
          '&:focus': { borderColor: 'primary.main', backgroundColor: '#f0f7ff' },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Click here and paste (Ctrl+V). Each paste is saved to the DB one after another.
        </Typography>
      </Box>

      {isBusy && (
        <Box mt={2} display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            {statusMessage || 'Adding pasted item…'}
          </Typography>
        </Box>
      )}

      {content && !looksLikeHtml(content) && (
        <Box mt={2}>
          <Button variant="contained" onClick={handleSaveTextClick} disabled={isBusy}>
            SAVE TEXT NOTE
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default OrderNotesPastedData;
