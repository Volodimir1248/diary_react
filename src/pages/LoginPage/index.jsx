import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    CssBaseline,
    FormControlLabel,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { loginWithJWT } from '../../store/actions/auth/loginAction';

const validationSchema = Yup.object({
    email: Yup.string().email('Введите корректный email').required('Email обязателен'),
    password: Yup.string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .max(30, 'Пароль должен содержать максимум 30 символов')
        .required('Пароль обязателен'),
});

const Login = () => {
    const dispatch = useDispatch();
    const isAuthLoading = useSelector((state) => state.auth.isAuthLoading);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
            <CssBaseline />
            <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', py: { xs: 6, sm: 10 }, px: { xs: 2, sm: 0 } }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.palette.background.paper,
                    }}
                >
                    <Avatar sx={{ mb: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Вход в аккаунт
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" paragraph>
                        Введите ваши учетные данные для входа в личный кабинет
                    </Typography>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            dispatch(loginWithJWT(values));
                            setSubmitting(false);
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                            <Form style={{ width: '100%', marginTop: 24 }} noValidate>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    margin="normal"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="password"
                                    label="Пароль"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    margin="normal"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />

                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Запомнить меня"
                                    sx={{ mt: -1 }}
                                />

                                <Box sx={{ position: 'relative', mt: 3 }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        disabled={isAuthLoading || isSubmitting}
                                    >
                                        {!(isAuthLoading || isSubmitting) ? 'Войти' : ' '}
                                    </Button>
                                    {(isAuthLoading || isSubmitting) && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                mt: '-12px',
                                                ml: '-12px',
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Нет аккаунта?{' '}
                                        <Link component={RouterLink} to="/register" underline="hover">
                                            Зарегистрироваться
                                        </Link>
                                    </Typography>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
