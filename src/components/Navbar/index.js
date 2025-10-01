import React from 'react';
import { AppBar, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const pageTitles = {
    '/': 'Главная',
    '/profile': 'Мой профиль',
    '/notes': 'Заметки',
    '/tasks': 'Задачи',
    '/login': 'Вход',
    '/register': 'Регистрация',
    '/finance': 'Финансы'
};

const Navbar = ({ onSidebarToggle, isSidebarVisible, sidebarWidth }) => {
    const location = useLocation();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const title = pageTitles[location.pathname] || 'Личный кабинет';

    const hasPermanentSidebar = isSidebarVisible && !isSmallScreen;

    return (
        <AppBar
            position="fixed"
            elevation={0}
            color="default"
            sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                width: hasPermanentSidebar ? `calc(100% - ${sidebarWidth}px)` : '100%',
                left: hasPermanentSidebar ? `${sidebarWidth}px` : 0,
                right: 0,
                padding: 0
            }}
        >
            <Toolbar sx={{ justifyContent: 'center', position: 'relative' }}>
                {isSmallScreen && (
                    <IconButton
                        onClick={onSidebarToggle}
                        color="inherit"
                        sx={{ position: 'absolute', right: 16 }}
                        aria-label="Открыть меню"
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" component="h1" noWrap>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
