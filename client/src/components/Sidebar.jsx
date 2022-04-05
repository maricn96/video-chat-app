import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { Assignment, PersonAdd, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../Context';
import axios from 'axios';
import { Alert } from '@mui/material';
import { SERVER_URL } from '../environment.js'

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

const Sidebar = ({ children }) => {
  
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');

  const addUser = () => {
    const dto = {
      'emailUser': window.sessionStorage.getItem('currentUser'),
      'emailFriend': email
    }
    axios.post(SERVER_URL + '/addUser', dto)
      .then(res => {
        if(res.data.startsWith('ADD')){
          setSuccess(true);
          setError(false);
          setReason('');
          window.location.reload();
        } else {
          setError(true);
          setSuccess(false);
          setReason(res.data);
        }
      })
  }

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          {/* <Grid container className={classes.gridContainer}>
            </Grid> */}
            <Grid item xs={12} md={6} className={classes.padding}>
            <Typography gutterBottom variant="h6">Add a friend</Typography>
              <TextField label="Email address" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
              {/* callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                  Hang Up
                </Button>
              ) : ( */}
                <Button variant="contained" color="primary" startIcon={<PersonAdd  />} fullWidth onClick={() => addUser()} className={classes.margin}>
                  Add
                </Button>
              {/* )} */}
              {
                success &&
                <Alert severity="success">Successfully added!</Alert>
              }
              {
                error &&
                <Alert severity="error">{reason}</Alert>
              }
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Sidebar;