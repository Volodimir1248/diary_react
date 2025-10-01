import React from 'react';
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionTypes from '../../store/action-types';

const menuItems = [
    { path: '/profile', text: 'Мой профиль', icon: AccountCircleIcon },
    { path: '/', text: 'Главная', icon: DashboardIcon },
    { path: '/notes', text: 'Заметки', icon: NoteAltIcon },
    { path: '/tasks', text: 'Задачи', icon: AssignmentIcon },
    { path: '/finance', text: 'Финансы', icon: AccountBalanceWalletIcon },
];

const Sidebar = ({ onNavigate }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNavigate = (path) => {
        navigate(path);
        onNavigate?.();
    };

    const handleLogout = () => {
        dispatch({ type: ActionTypes.LOGOUT_USER });
        navigate('/login', { replace: true });
        onNavigate?.();
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#424242',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Avatar src="/logo192.png" alt="Логотип приложения" sx={{ width: 40, height: 40 }} />
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            <List sx={{ flexGrow: 1, py: 0 }}>
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const selected = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.path}
                            selected={selected}
                            onClick={() => handleNavigate(item.path)}
                            sx={{
                                color: 'inherit',
                                px: 3,
                                '&.Mui-selected, &.Mui-selected:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                <IconComponent fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    );
                })}
            </List>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            <List sx={{ py: 0 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        color: (theme) => theme.palette.error.light,
                        px: 3,
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Выход" />
                </ListItemButton>
            </List>
        </Box>
    );
};

export default Sidebar;
