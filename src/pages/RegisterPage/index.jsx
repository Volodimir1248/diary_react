import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import registerWithJWT from '../../store/actions/auth/registerAction';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Имя обязательно'),
    email: Yup.string().email('Введите корректный email').required('Email обязателен'),
    password: Yup.string()
        .min(6, 'Минимум 6 символов')
        .max(30, 'Максимум 30 символов')
        .required('Пароль обязателен'),
    passwordRetype: Yup.string()
        .required('Подтвердите пароль')
        .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
});

const SignUpPage = () => {
    const dispatch = useDispatch();

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
                        Регистрация
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" paragraph>
                        Создайте аккаунт для доступа к личному кабинету
                    </Typography>

                    <Formik
                        initialValues={{ name: '', email: '', password: '', passwordRetype: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            dispatch(registerWithJWT(values, resetForm));
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                            <Form style={{ width: '100%', marginTop: 24 }} noValidate>
                                <TextField
                                    autoComplete="name"
                                    name="name"
                                    variant="outlined"
                                    fullWidth
                                    label="Имя"
                                    margin="normal"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
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
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            name="password"
                                            label="Пароль"
                                            type="password"
                                            margin="normal"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            name="passwordRetype"
                                            label="Повторите пароль"
                                            type="password"
                                            margin="normal"
                                            value={values.passwordRetype}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.passwordRetype && Boolean(errors.passwordRetype)}
                                            helperText={touched.passwordRetype && errors.passwordRetype}
                                        />
                                    </Grid>
                                </Grid>

                                <FormControlLabel
                                    control={<Checkbox value="agreeTerms" color="primary" required />}
                                    label="Я согласен с условиями использования сервиса"
                                    sx={{ mt: 2 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isSubmitting}
                                    sx={{ mt: 3 }}
                                >
                                    Зарегистрироваться
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Уже есть аккаунт?{' '}
                                        <Link component={RouterLink} to="/login" underline="hover">
                                            Войти
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

export default SignUpPage;
