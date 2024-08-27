import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import * as React from 'react';

import NotificationsIcon from '@mui/icons-material/Notifications';

import { Alert as AlertType, useFetchAlertsQuery } from '../redux/api/alertApi';

import { Alert, Badge, Paper } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import FullScreenLoader from './FullScreenLoader';
import {
  mainListItems,
  quaternaryListItems,
  secondaryListItems,
  tertiaryListItems,
} from './layout/listItems';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const FloatingCard = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.primary.light,
  boxShadow: theme.shadows[5],
  maxHeight: '80vh',
  overflowY: 'auto',
}));

export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const floatingCardRef = React.useRef<HTMLDivElement | null>(null);

  const { data: alerts = [], isLoading: isLoadingAlerts } =
    useFetchAlertsQuery('');

  React.useEffect(() => {
    if (!alerts) {
      return;
    }
    if (alerts.length > 0) {
      // setOpen(true);
      // console.log('alerts ====> ', alerts);
    }
  }, [alerts]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAlertClick = () => {
    setAlertOpen(!alertOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      floatingCardRef.current &&
      !floatingCardRef.current.contains(event.target as Node)
    ) {
      setAlertOpen(false);
    }
  };

  React.useEffect(() => {
    if (alertOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [alertOpen]);

  if (isLoadingAlerts) {
    return <FullScreenLoader />;
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.25)',
                transformOrigin: 'center center',
              },
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            noWrap
            component='div'
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.25)',
                transformOrigin: 'center center',
              },
            }}
          >
            IOT na Agricultura
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color='inherit' onClick={handleAlertClick}>
            <Badge badgeContent={alerts.length} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
        <Divider />
        <List>{tertiaryListItems}</List>
        <Divider />
        <List>{quaternaryListItems}</List>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
      {alertOpen && (
        <FloatingCard ref={floatingCardRef}>
          {alerts.map((alert: AlertType) => (
            <Alert
              onClose={() => setAlertOpen(false)}
              severity={'warning'}
              sx={{ width: '100%', marginBottom: 2 }}
              key={alert.id}
            >
              <Typography
                variant='h2'
                component='h1'
                sx={{
                  color: '#1f1e1e',
                  fontWeight: 500,
                  marginLeft: 1,
                }}
              >
                {alert.type}
              </Typography>
              {alert.message}
            </Alert>
          ))}
        </FloatingCard>
      )}
    </Box>
  );
}
