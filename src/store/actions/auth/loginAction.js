import actionTypes from '../../action-types/';
import { history, http } from '../../../helpers';
import { toast } from 'react-toastify';

export const loginWithJWT = (user) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.AUTH_LOADING, loading: true });
    const response = await http.post("/auth/login", {
      email: user.email,
      password: user.password
    });
    dispatch({ type: actionTypes.AUTH_LOADING, loading: false });
    if (response.data) {
      dispatch({
        type: actionTypes.LOGIN_USER,
        currentUser: response.data.user,
        token: response.data.access_token
      });
      history.push("/");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    dispatch({ type: actionTypes.AUTH_LOADING, loading: false });
  }
};
