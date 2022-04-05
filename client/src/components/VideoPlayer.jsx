import React, { useContext, useEffect, useState } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';

import { SocketContext } from '../Context';
import '../styles.css';
import axios from 'axios';
import { SERVER_URL } from '../environment';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    // justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, callUser, userVideo, callEnded, stream, call, callDeclined } = useContext(SocketContext);
  const classes = useStyles();

  const [myName, setMyName] = useState('');
  const [callerName, setCallerName] = useState('');

  useEffect(() => {
    axios.get(SERVER_URL + '/getUserByEmail', {
      params: {
        email: window.sessionStorage.getItem('currentUser')
      }
    }).then(res => {
      setMyName((res.data[0].first_name === '' || res.data[0].last_name === '') ? res.data[0].nickname : res.data[0].first_name + ' ' + res.data[0].last_name);
    })

    if(call){ 
      callApiForUser(window.sessionStorage.getItem('callingUser'))
    }

    if (call.isReceivingCall && !callAccepted) {
      callApiForUser(call.from)
    }

    console.log("USER VIDEO:")
    console.log(userVideo)

    if(callEnded && userVideo.current !== undefined) { //jedini uslov koji sam uhvatio da uradi reload samo nakon hang up
      window.location.reload();
    }

    // if(callDeclined) {
      // window.alert(callerName + ' has declined call!')
      // window.location.reload();
    // }

  }, [call, callAccepted, callUser, callEnded, name, stream, myVideo]);

  const callApiForUser = (socketId) => {
    axios.get(SERVER_URL + '/getUserBySocketId', {
      params: {
        socketId: socketId
      }
    }).then(res => {
      console.log(res);
      if(res.data.length === 0) return ;
      setCallerName((res.data[0].first_name === '' || res.data[0].last_name === '') ? res.data[0].nickname : res.data[0].first_name + ' ' + res.data[0].last_name);
    })
  }

  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{myName}</Typography>
            <video playsInline muted ref={myVideo} autoPlay className={classes.video} id="my-video" />
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{callerName}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.video} id="my-video" />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;