import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const pages: string[] = ['Home', 'Reviews', 'Dining', 'Edits'];
const ref: string[] = [
    '/',
    '/reviewtable',
    "/dining",
    '/revieweditor',
];

function NavigationBar() {
    const [anchorElNav, setAnchorElNav] =
        React.useState<null | HTMLElement>(null);
    const handleOpenNavMenu = (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleAnchor = (page: any, index: any) => {
        window.location.href = ref[index];
    };

    return (
        <>
            <AppBar position='static'>
                <Container maxWidth='xl'>
                    <Toolbar disableGutters>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: {
                                    xs: 'flex',
                                    md: 'none',
                                },
                            }}
                        >
                            <IconButton
                                size='large'
                                aria-label='account of current user'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleOpenNavMenu}
                                color='inherit'
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {
                                        xs: 'block',
                                        md: 'none',
                                    },
                                }}
                            >
                                {pages.map(
                                    (page, index) => (
                                        <MenuItem
                                            key={page}
                                            onClick={(
                                                event,
                                            ) => {
                                                handleAnchor(
                                                    page,
                                                    index,
                                                );
                                            }}
                                        >
                                            <Typography textAlign='center'>
                                                {page}
                                            </Typography>
                                        </MenuItem>
                                    ),
                                )}
                            </Menu>
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: {
                                    xs: 'none',
                                    md: 'flex',
                                },
                            }}
                        >
                            {pages.map((page, index) => (
                                <Button
                                    key={page}
                                    onClick={(event) => {
                                        handleAnchor(
                                            page,
                                            index,
                                        );
                                    }}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default NavigationBar;
