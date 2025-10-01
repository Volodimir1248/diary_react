import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import NoteEditor from './NoteEditor';
import NotesGrid from './NotesGrid';
import { fetchNotes } from '../../store/actions/notes/fetchNotesAction';
import { addNote } from '../../store/actions/notes/addNoteAction';
import { deleteNote } from '../../store/actions/notes/deleteNoteAction';
import { updateNote } from '../../store/actions/notes/updateNoteAction';

const NotesPage = () => {
    const dispatch = useDispatch();
    const notes = useSelector((state) => state.notes.notes);
    const isLoading = useSelector((state) => state.notes.isLoading);
    const [editingNote, setEditingNote] = useState(null);

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const handleNoteDelete = (note) => {
        dispatch(deleteNote(note.id));
    };

    const handleNoteAdd = (newNote) => {
        dispatch(addNote(newNote));
    };

    const handleNoteUpdate = (updatedNote) => {
        dispatch(updateNote(updatedNote.id, updatedNote));
        setEditingNote(null);
    };

    const handleNoteEdit = (note) => {
        setEditingNote(note);
    };

    const handleCancel = () => {
        setEditingNote(null);
    };

    return (
        <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, sm: 3 } }}>
            <NoteEditor
                onNoteAdd={handleNoteAdd}
                onNoteUpdate={handleNoteUpdate}
                editingNote={editingNote}
                onCancel={handleCancel}
            />

            <Box sx={{ mt: 3 }}>
                <NotesGrid
                    notes={notes}
                    onNoteDelete={handleNoteDelete}
                    onNoteEdit={handleNoteEdit}
                />
            </Box>

            {isLoading && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body1">Загрузка заметок...</Typography>
                </Box>
            )}
        </Box>
    );
};

export default NotesPage;
