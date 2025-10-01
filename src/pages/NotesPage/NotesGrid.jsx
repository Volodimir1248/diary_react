import React from 'react';
import { Box } from '@mui/material';

import NoteItem from './NoteItem';

const NotesGrid = ({ notes, onNoteDelete, onNoteEdit }) => (
    <Box
        sx={{
            columnGap: '16px',
            columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
            width: '100%',
        }}
    >
        {notes.map((note) => (
            <Box key={note.id} sx={{ breakInside: 'avoid', mb: 2 }}>
                <NoteItem
                    onDelete={() => onNoteDelete(note)}
                    onEdit={() => onNoteEdit(note)}
                    color={note.color}
                >
                    {note.text}
                </NoteItem>
            </Box>
        ))}
    </Box>
);

export default NotesGrid;
