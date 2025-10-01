import React, { useState } from 'react';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const drawerWidth = 240;

const PrivateLayout = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        if (!isDesktop) {
            setSidebarOpen(true);
        }
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                minHeight: '100vh',
                overflow: 'hidden',
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            {isDesktop && (
                <Box
                    component="aside"
                    sx={{
                        flexShrink: 0,
                        width: drawerWidth,
                        height: '100vh',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        backgroundColor: '#424242',
                        color: '#fff',
                        position: "fixed"
                    }}
                    
                >
                    <Sidebar onNavigate={handleSidebarClose} />
                </Box>
            )}

            <Box
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    marginLeft: "240px",
                    marginTop: "65px",
                    "@media (max-width:900px)": {
                        marginLeft: 0
                    }
                }}
            >
                <Navbar
                    onSidebarToggle={handleSidebarToggle}
                    isSidebarVisible={isDesktop}
                    sidebarWidth={drawerWidth}
                />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        boxSizing: 'border-box',
                        width: '100%',
                        overflow: 'visible'
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            {!isDesktop && (
                <Drawer
                    anchor="left"
                    open={sidebarOpen}
                    onClose={handleSidebarClose}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{ sx: { width: drawerWidth, backgroundColor: '#424242', color: '#fff' } }}
                >
                    <Sidebar onNavigate={handleSidebarClose} />
                </Drawer>
            )}
        </Box>
    );
};

export default PrivateLayout;
