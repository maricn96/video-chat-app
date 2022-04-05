import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { SERVER_URL } from '../../../environment.js'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '150px',
    marginLeft: '700px',
    marginRight: '700px',
    padding: theme.spacing(2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

const Registration = () => {

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const user = {
      'email': email,
      'password': password
    }
    axios.post(SERVER_URL + '/signin', user)
      .then(res => {
        if(res.data.startsWith('LOG')) {
          window.location.href = '/video';
          window.sessionStorage.setItem('currentUser', email);
        } else {
          setError(true);
          setReason(res.data);
        }
      })
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <h1>Login</h1>
      <TextField
        label="Email"
        variant="filled"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="filled"
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {
        error &&
        <Alert severity="error">Login failed! Reason: {reason}</Alert>
      }
      <div>
        <Button type="submit" variant="contained" color="primary">
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default Registration;