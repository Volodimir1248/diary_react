import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

const defaultColor = '#ffff00';

const NoteEditor = ({ onNoteAdd, onNoteUpdate, editingNote, onCancel }) => {
    const [text, setText] = useState('');
    const [color, setColor] = useState(defaultColor);

    useEffect(() => {
        if (editingNote) {
            setText(editingNote.text);
            setColor(editingNote.color);
        } else {
            setText('');
            setColor(defaultColor);
        }
    }, [editingNote]);

    const handleSubmit = () => {
        if (!text.trim()) return;

        if (editingNote) {
            onNoteUpdate({ ...editingNote, text, color });
        } else {
            onNoteAdd({ text, color, id: Date.now() });
        }

        setText('');
        setColor(defaultColor);
    };

    const handleCancel = () => {
        onCancel?.();
        setText('');
        setColor(defaultColor);
    };

    const isEditing = Boolean(editingNote);

    return (
        <Paper
            sx={{
                maxWidth: 600,
                mx: 'auto',
                p: 3,
                backgroundColor: (theme) => theme.palette.background.paper,
                boxShadow: (theme) => theme.shadows[2],
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <TextField
                placeholder="Введите ваши заметки..."
                multiline
                rows={5}
                variant="outlined"
                value={text}
                onChange={(event) => setText(event.target.value)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">Выберите цвет:</Typography>
                    <input
                        type="color"
                        value={color}
                        onChange={(event) => setColor(event.target.value)}
                        style={{ width: 40, height: 40, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {isEditing ? 'Изменить' : 'Создать'}
                    </Button>
                    {isEditing && (
                        <Button variant="outlined" onClick={handleCancel}>
                            Отмена
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default NoteEditor;
