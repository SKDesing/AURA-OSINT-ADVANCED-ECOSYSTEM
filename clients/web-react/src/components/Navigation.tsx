import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  NetworkCheck as NetworkIcon,
  Person as ProfileIcon,
  LiveTv as LiveIcon,
  Terminal as TerminalIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/network', label: 'Network Monitor', icon: <NetworkIcon /> },
  { path: '/profiles', label: 'Profile Analyzer', icon: <ProfileIcon /> },
  { path: '/live', label: 'Live Tracker', icon: <LiveIcon /> },
  { path: '/terminal', label: 'Terminal', icon: <TerminalIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> }
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, rgba(22, 24, 35, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: '1px solid rgba(254, 44, 85, 0.1)'
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          🔒 AURA STEALTH
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Forensic System v1.0
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(254, 44, 85, 0.1)' }} />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(254, 44, 85, 0.1), transparent)',
                  borderRight: '3px solid #fe2c55'
                },
                '&:hover': {
                  background: 'rgba(254, 44, 85, 0.05)'
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#fe2c55' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? '#fe2c55' : 'inherit'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation;