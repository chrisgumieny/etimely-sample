import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

// Import from MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import Collapse from '@mui/material/Collapse';

// Import images
import logo from "../Images/Logo/eTimely-white-238x88.png"
import Dashboard from "../Images/NavMenu/speedometer.png"
import Schedule from "../Images/NavMenu/schedule-64.png"
import Team from "../Images/NavMenu/team-58.png"
import Messages from "../Images/NavMenu/messages-48.png"
import Announcements from "../Images/NavMenu/announcement-50.png"

// import CSS
import '../Css/sideNav.css';

// Dimensional Consts
const drawerWidth = 250;
const iconDimension = 50;

export default function Sidebar(props) {
  const { window } = props;


  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pages = [];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  // open menu for the "Team" area
  const handleClickOpenSideBar = () => {
    setOpen(!open);
  };

  // opens menu for "Announcement" area
  const handleClickOpenSideBar1 = () => {
    setOpen1(!open1);
  };


  // function to handle user logging out. clears local storage
  const handleUserLogout = () => {
    // Alert to confirm logout
    Swal.fire({
      title: 'Are you sure?',
      text: "You will need to log back in!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0077ff',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: 'Yes, logout'

    }).then((result) => {
      if (result.value) {
        // Logout
        localStorage.removeItem("Business token");
        localStorage.removeItem('Business user');
        navigate("/");
      }
    })
  }

  const handleUserProfileNav = () => {
    navigate('/Business/Profile')
  }


  // the drawer const holds all ListItems to show in the side drawer
  const drawer = (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <Toolbar />
      <Divider />
      <List >
        {/* Empty list item to act as buffer between appbar and drawer */}
        <ListItem className='sidenav-list' component='p' >
          <ListItemText primary=' ' />
        </ListItem>

        <br></br>
        <br></br>
        {/* Dashboard ListItem */}
        <ListItem className='sidenav-list' button component='a' href='/business/dashboard'>
          <ListItemIcon>
            <img src={Dashboard} width={iconDimension} alt="eTimely"></img>
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>

        <br></br>
        <br></br>
        {/* Schedule ListItem */}
        <ListItem className='sidenav-list' button component='a' href='/business/schedule'>
          <ListItemIcon>
            <img src={Schedule} width={iconDimension} alt="eTimely"></img>
          </ListItemIcon>
          <ListItemText primary='Schedules' />
        </ListItem>

        <br></br>
        <br></br>
        {/* Expandable ListItem for Team pages */}
        <ListItem className='sidenav-list' button component='a'
          onClick={handleClickOpenSideBar}>
          <ListItemIcon>
            <img src={Team} width={iconDimension} alt="eTimely"></img>
          </ListItemIcon>
          <ListItemText primary='Team' />
          {open ? <span class="material-icons">expand_less</span> : <span class="material-icons">expand_more</span>}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ListItem className='sidenav-list' button component='a' href='/business/teammanagement'>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary='Team Management' />
          </ListItem>

          <ListItem className='sidenav-list' button component='a' href='/business/teamavailability'>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary='Team Availability' />
          </ListItem>


          <ListItem className='sidenav-list' button component='a' href='/Business/RoleCreation'>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary='Team Roles' />
          </ListItem>
        </Collapse>


        <br></br>
        <br></br>
        {/* Expandable ListItem for Announcement pages*/}
        <ListItem className='sidenav-list' button component='a'
          onClick={handleClickOpenSideBar1}>
          <ListItemIcon>
            <img src={Announcements} width={iconDimension} alt="eTimely"></img>
          </ListItemIcon>
          <ListItemText primary='Announcements' />
          {open1 ? <span class="material-icons">expand_less</span> : <span class="material-icons">expand_more</span>}
        </ListItem>

        <Collapse in={open1} timeout="auto" unmountOnExit>
          <ListItem className='sidenav-list' button component='a' href='/business/createAnnouncement'>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary='Create Announcements' />
          </ListItem>

          <ListItem className='sidenav-list' button component='a' href='/business/viewAnnouncement'>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary='View Announcements' />
          </ListItem>
        </Collapse>

        <br></br>
        <br></br>
        {/* Messages ListItem */}
        <ListItem className='sidenav-list' button component='a' href='/Business/messageBoard' >
          <ListItemIcon>
            <img src={Messages} width={iconDimension} alt="eTimely"></img>
          </ListItemIcon>
          <ListItemText primary='Messages' />
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      {/*============ APP BAR CODE ============
          renders the blue appbar at the top 
          of the screen                         */}
      <AppBar
        style={{
          backgroundColor: 'rgb(0, 118, 255)',
          color: '#ffffff',
          boxShadow: 'none',
        }}
        className='appbar'
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', sm: 'flex', md: 'flex' } }}
          >
            <img src={logo} alt="eTimely"></img>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
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
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 0, display: { xs: 'flex', sm: 'none', md: 'none' } }}
          >
            <img src={logo} alt="eTimely"></img>

          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Show avatar, that gives menu when clicked */}

          <Box sx={{ flexGrow: 1 }} />


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  {JSON.parse(localStorage.getItem('Business user')).companyName.charAt(0)}
                </Avatar >
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleUserProfileNav}>Profile</MenuItem>
              <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>


      {/*============ DRAWER CODE ============*/}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}

      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
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
    </>
  );
}

Sidebar.propTypes = {
  window: PropTypes.func,
};