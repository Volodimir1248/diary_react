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
    let string_error = ""
    Object.keys(error.response?.data).forEach(element => {
        string_error += `${element}: ${String(error.response.data[element])}`
    });
    toast.error(string_error);
    dispatch({ type: actionTypes.AUTH_LOADING, loading: false });
  }
};
