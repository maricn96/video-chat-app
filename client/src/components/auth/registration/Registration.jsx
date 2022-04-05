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
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const user = {
      'email': email,
      'password': password,
      'firstname': firstname,
      'lastname': lastname,
      'nickname': nickname
    }
    axios.post(SERVER_URL + '/user', user)
      .then(res => {
        if(res.data.startsWith('CRE')) {
          setTimeout(() => {
            window.sessionStorage.setItem('currentUser', email);
            window.location.href = '/video';
          }, 1500)
          setSuccess(true);
          setError(false);
          setReason('');
          setFirstname('');
          setLastname('');
          setEmail('');
          setPassword('');
          setNickname('');
        } else {
          setError(true);
          setSuccess(false);
          setReason(res.data);
        }
      })
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
    <h1>Register</h1>
      <TextField
        label="First Name"
        variant="filled"
        value={firstname}
        onChange={e => setFirstname(e.target.value)}
      />
      <TextField
        label="Last Name"
        variant="filled"
        value={lastname}
        onChange={e => setLastname(e.target.value)}
      />
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
      <TextField
        label="Nickname"
        variant="filled"
        required
        value={nickname}
        onChange={e => setNickname(e.target.value)}
      />
      {
        success &&
        <Alert severity="success">Successfully registered!</Alert>
      }
      {
        error &&
        <Alert severity="error">Registration failed! Reason: {reason}</Alert>
      }
      <div>
        <Button type="submit" variant="contained" color="primary">
          Signup
        </Button>
      </div>
    </form>
  );
};

export default Registration;