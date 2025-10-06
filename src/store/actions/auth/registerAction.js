import actionTypes from '../../action-types/';
import { history, http } from '../../../helpers';
import { toast } from 'react-toastify';

export const registerWithJWT = (values, resetForm) => async (dispatch) => {
    try {
        dispatch({ type: actionTypes.AUTH_LOADING, loading: true });
        const response = await http.post("/auth/register", {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.passwordRetype
        });
        dispatch({ type: actionTypes.AUTH_LOADING, loading: false });
        toast.success(response.data.message || "Registration completed successfully");
        resetForm();
        history.push("/login");
    } catch (error) {        
        let string_error = ""
        Object.keys(error.response?.data).forEach(element => {
            string_error += `${element}: ${String(error.response.data[element])}`
        });
        toast.error(string_error);
        dispatch({ type: actionTypes.AUTH_LOADING, loading: false });
    }
};

export default registerWithJWT;
