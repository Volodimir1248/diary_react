import ActionTypes from '../../action-types';

const initialState = {
    notes: [],
    isLoading: false,
    error: null,
};

const notesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_NOTES_REQUEST:
        case ActionTypes.ADD_NOTE_REQUEST:
        case ActionTypes.DELETE_NOTE_REQUEST:
        case ActionTypes.UPDATE_NOTE_REQUEST:
            return { ...state, isLoading: true, error: null };

        case ActionTypes.FETCH_NOTES_SUCCESS:
            return { ...state, isLoading: false, notes: action.payload };
        case ActionTypes.ADD_NOTE_SUCCESS:
            return { ...state, isLoading: false, notes: [action.payload, ...state.notes] };
        case ActionTypes.DELETE_NOTE_SUCCESS:
            return { ...state, isLoading: false, notes: state.notes.filter(note => note.id !== action.payload) };
        case ActionTypes.UPDATE_NOTE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                notes: state.notes.map(note =>
                    note.id === action.payload.id ? action.payload : note
                ),
            };

        case ActionTypes.FETCH_NOTES_FAILURE:
        case ActionTypes.ADD_NOTE_FAILURE:
        case ActionTypes.DELETE_NOTE_FAILURE:
        case ActionTypes.UPDATE_NOTE_FAILURE:
            return { ...state, isLoading: false, error: action.error };
        default:
            return state;
    }
};

export default notesReducer;
