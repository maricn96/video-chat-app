import React, { useContext, useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper, makeStyles } from '@material-ui/core';

import { SocketContext } from '../Context';
import axios from 'axios';
import { SERVER_URL } from '../environment';
import { PhoneDisabled } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
}));

const Notifications = () => {
  const { answerCall, call, callAccepted, leaveCall, declineCall } = useContext(SocketContext);
  const classes = useStyles();

  const [callerName, setCallerName] = useState('');

  useEffect(() => {
    console.log('usao odje')
    if (call.isReceivingCall && !callAccepted) {
      console.log('usao odje')
      axios.get(SERVER_URL + '/getUserBySocketId', {
        params: {
          socketId: call.from
        }
      }).then(res => {
        console.log(res);
        setCallerName((res.data[0].first_name === '' || res.data[0].last_name === '') ? res.data[0].nickname : res.data[0].first_name + ' ' + res.data[0].last_name);
      })
    }
  }, [call, callAccepted]);

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        {call.isReceivingCall && !callAccepted && (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <h1>{callerName} is calling:</h1>
            {console.log(call)}
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
            {/* <Button variant="contained" color="secondary" onClick={declineCall}>
              Decline
            </Button> */}
          </div>
        )}
        {callAccepted && (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} onClick={leaveCall} className={classes.margin}>
              Hang Up
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications;