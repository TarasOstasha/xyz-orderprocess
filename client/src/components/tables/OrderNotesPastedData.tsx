import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Task } from '../../types';

interface OrderNotesPastedDataProps {
  selectedTask: Task;
  // Called by the child on each "SAVE" so the parent can store the data
  onSavePastedData?: (taskId: number, text: string, images: string[]) => void;
}

const OrderNotesPastedData: React.FC<OrderNotesPastedDataProps> = ({
  selectedTask,
  onSavePastedData,
}) => {
  // For each taskId, we store the current text and images in local state
  const [pastedData, setPastedData] = useState<{ [taskId: number]: string }>({});
  const [pastedImages, setPastedImages] = useState<{ [taskId: number]: string[] }>({});
  // console.log(JSON.stringify(selectedTask), 'selectedTask')
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const { items } = e.clipboardData;
    for (const item of items) {
      if (item.type.includes('image')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPastedImages((prev) => ({
              ...prev,
              [selectedTask.id]: [
                ...(prev[selectedTask.id] || []),
                event.target?.result as string,
              ],
            }));
          };
          reader.readAsDataURL(file);
        }
      }
    }

    const rawHtml = e.clipboardData.getData('text/html');
    const rawPlain = e.clipboardData.getData('text/plain');
    const rawText = e.clipboardData.getData('text');

    if (rawHtml && rawHtml.trim().length > 0) {
      setPastedData((prev) => ({
        ...prev,
        [selectedTask.id]: rawHtml,
      }));
    } else {
      let textContent = rawPlain;
      if (!textContent.trim()) {
        textContent = rawText;
      }
      if (textContent) {
        setPastedData((prev) => ({
          ...prev,
          [selectedTask.id]: textContent,
        }));
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedTask) return;
    setPastedData((prev) => ({
      ...prev,
      [selectedTask.id]: e.target.value,
    }));
  };

  const handleSaveClick = () => {
    if (!selectedTask) return;

    const text = pastedData[selectedTask.id] || '';
    const images = pastedImages[selectedTask.id] || [];

    // Call parent callback to store this new "entry" in the parent's list
    if (onSavePastedData) {
      onSavePastedData(selectedTask.id, text, images);
    }

    // CLEAR the child's local state so the text field and images are empty
    setPastedData((prev) => ({
      ...prev,
      [selectedTask.id]: '',
    }));
    setPastedImages((prev) => ({
      ...prev,
      [selectedTask.id]: [],
    }));
  };

  // Decide what text to show in the text field
  const content = pastedData[selectedTask.id] || '';
  const looksLikeHtml = (str: string) => /<\/?[a-z][\s\S]*>/i.test(str);

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
      />

      {/* Display Pasted Content */}
      {content && (
        <Box
          mt={2}
          p={2}
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: 1,
            border: '1px solid #ddd',
            maxHeight: '300px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {looksLikeHtml(content) ? (
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <Typography variant="body1" sx={{ color: '#333' }}>{content}</Typography>
          )}
        </Box>
      )}

      {/* Display Pasted Images */}
      {pastedImages[selectedTask.id] && pastedImages[selectedTask.id].length > 0 && (
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {pastedImages[selectedTask.id].map((img, i) => (
            <Box key={i} sx={{ maxWidth: '100%', border: '1px solid #ddd' }}>
              <img src={img} alt="Pasted" style={{ width: '100%' }} />
            </Box>
          ))}
        </Box>
      )}

      <Box mt={2}>
        <Button variant="contained" onClick={handleSaveClick}>
          SAVE PASTED DATA
        </Button>
      </Box>
    </Box>
  );
};

export default OrderNotesPastedData;
