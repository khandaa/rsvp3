import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider, 
  Menu, 
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  DirectionsCar as TransportIcon,
  Hotel as AccommodationIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Help as HelpIcon,
  LocalShipping as LogisticsIcon,
  BarChart as ReportingIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

export default function MainLayout() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/',
      requiredRole: 'guest'
    },
    { 
      text: 'Events', 
      icon: <EventIcon />, 
      path: '/events',
      requiredRole: 'guest'
    },
    { 
      text: 'Guests', 
      icon: <PeopleIcon />, 
      path: '/guests',
      requiredRole: 'guest' // Changed to 'guest' to be visible to all users
    },
    { 
      text: 'Transportation', 
      icon: <TransportIcon />, 
      path: '/transportation',
      requiredRole: 'hospitality'
    },
    { 
      text: 'Accommodations', 
      icon: <AccommodationIcon />, 
      path: '/accommodations',
      requiredRole: 'hospitality'
    },
    { 
      text: 'Logistics', 
      icon: <LogisticsIcon />, 
      path: '/logistics',
      requiredRole: 'guest'
    },
    { 
      text: 'Reporting', 
      icon: <ReportingIcon />, 
      path: '/reporting',
      requiredRole: 'guest'
    },
    { 
      text: 'Admin Panel', 
      icon: <SettingsIcon />, 
      path: '/admin',
      requiredRole: 'admin'
    },
    { 
      text: 'Help', 
      icon: <HelpIcon />, 
      path: '/help',
      requiredRole: 'guest'
    }
  ];

  const drawer = (
    <>
      <Toolbar sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          RSVP Event App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // Show all menu items regardless of role for now, or implement a proper check
          // if item doesn't have a requiredRole, or if hasPermission returns true, or if it's a basic role like 'guest'
          const shouldShow = !item.requiredRole || item.requiredRole === 'guest' || hasPermission(item.requiredRole);
          
          return shouldShow && (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Dynamic page title */}
          </Typography>
          
          {/* User role chip */}
          {user && user.role && (
            <Chip
              label={`Role: ${String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)}`}
              color="secondary"
              size="small"
              sx={{ 
                mr: 2,
                textTransform: 'capitalize',
                fontWeight: 'medium',
                display: { xs: 'none', sm: 'flex' }
              }}
            />
          )}
          
          <IconButton
            size="large"
            color="inherit"
            aria-label="notifications"
          >
            <NotificationsIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Show role text on mobile */}
            {user && user.role && (
              <Typography 
                variant="caption" 
                sx={{ 
                  mr: 1, 
                  display: { xs: 'block', sm: 'none' },
                  textTransform: 'capitalize'
                }}
              >
                {String(user.role)}
              </Typography>
            )}
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                alt={user?.firstName || 'User'}
                src={user?.profileImage}
                sx={{ width: 32, height: 32 }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation menu"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
