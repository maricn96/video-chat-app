import React from 'react';
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from './components/Sidebar';
import FriendsList from './components/FriendsList';
import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import './styles.css';


const useStyles = makeStyles((theme) => ({
  // appBar: {
  //   borderRadius: 15,
  //   margin: '30px 100px',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '600px',
  //   border: '2px solid black',

  //   [theme.breakpoints.down('xs')]: {
  //     width: '90%',
  //   },
  // },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
      </AppBar>
      <VideoPlayer />
      <Notifications />
      <Sidebar/>
      <div className="friendsList">
      <FriendsList />
      </div>
    </div>
  );
};

export default App;