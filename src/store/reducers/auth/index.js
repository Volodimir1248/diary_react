import actionTypes from '../../action-types';

const initialState = {
    isLoggedIn: !!localStorage.getItem('token'),
    isAuthLoading: false,
    currentUser: null,
    profileLoading: false,
    profileError: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_USER:
            if (action.token) {
                localStorage.setItem('token', action.token);
            }
            return {
                ...state,
                isLoggedIn: true,
                currentUser: action.currentUser
            };

        case actionTypes.LOGOUT_USER:
            localStorage.removeItem('token');
            return {
                ...state,
                isLoggedIn: false,
                currentUser: null
            };

        case actionTypes.LOAD_USER:
            return {
                ...state,
                currentUser: action.currentUser
            };

        case actionTypes.AUTH_LOADING:
            return {
                ...state,
                isAuthLoading: action.loading
            };

        // Добавляем обработку обновления профиля
        case actionTypes.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                profileLoading: true,
                profileError: null
            };

        case actionTypes.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                profileLoading: false,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload
                }
            };

        case actionTypes.UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                profileLoading: false,
                profileError: action.payload
            };

        default:
            return state;
    }
};

export default reducer;
