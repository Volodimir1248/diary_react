import React from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { updateProfile } from '../../store/actions/auth/profileActions';
import { updatePassword } from '../../store/actions/auth/passwordActions';

const profileValidationSchema = Yup.object().shape({
    name: Yup.string().required('Обязательное поле'),
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    phone: Yup.string().matches(/^\+?[0-9]{10,15}$/, 'Некорректный номер телефона'),
    birthday: Yup.date().nullable(),
});

const passwordValidationSchema = Yup.object().shape({
    current_password: Yup.string().required('Обязательное поле'),
    new_password: Yup.string().min(6, 'Минимум 6 символов').required('Обязательное поле'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password')], 'Пароли должны совпадать')
        .required('Обязательное поле'),
});

const ProfilePage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser) || {};
    const isLoading = useSelector((state) => state.auth.isLoading);

    const profileInitialValues = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        birthday: currentUser.birthday || '',
        avatar: currentUser.avatar || '',
    };

    const passwordInitialValues = {
        current_password: '',
        new_password: '',
        confirm_password: '',
    };

    const handleAvatarChange = (event, setFieldValue) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFieldValue('avatar', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Редактирование профиля
            </Typography>
            <Formik
                initialValues={profileInitialValues}
                validationSchema={profileValidationSchema}
                onSubmit={(values) => {
                    dispatch(updateProfile(values));
                }}
                enableReinitialize
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={values.avatar} sx={{ width: 150, height: 150 }} />
                                    <input
                                        accept="image/*"
                                        id="avatar-upload"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleAvatarChange(event, setFieldValue)}
                                    />
                                    <label htmlFor="avatar-upload">
                                        <Button variant="outlined" component="span" fullWidth>
                                            Заменить аватар
                                        </Button>
                                    </label>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Имя"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Телефон"
                                            name="phone"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.phone && Boolean(errors.phone)}
                                            helperText={touched.phone && errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Дата рождения"
                                            name="birthday"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={values.birthday}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.birthday && Boolean(errors.birthday)}
                                            helperText={touched.birthday && errors.birthday}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                sx={{ position: 'relative' }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                ) : (
                                    'Сохранить изменения'
                                )}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>

            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Смена пароля
                </Typography>
                <Formik
                    initialValues={passwordInitialValues}
                    validationSchema={passwordValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                        dispatch(updatePassword(values));
                        resetForm();
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Текущий пароль"
                                        name="current_password"
                                        type="password"
                                        value={values.current_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.current_password && Boolean(errors.current_password)}
                                        helperText={touched.current_password && errors.current_password}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Новый пароль"
                                        name="new_password"
                                        type="password"
                                        value={values.new_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.new_password && Boolean(errors.new_password)}
                                        helperText={touched.new_password && errors.new_password}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Подтверждение пароля"
                                        name="confirm_password"
                                        type="password"
                                        value={values.confirm_password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.confirm_password && Boolean(errors.confirm_password)}
                                        helperText={touched.confirm_password && errors.confirm_password}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 3 }}>
                                <Button type="submit" fullWidth variant="contained" color="secondary">
                                    Сменить пароль
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default ProfilePage;
