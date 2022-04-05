import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { Assignment, PersonAdd, Phone, PhoneDisabled, RestoreFromTrash } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../Context';
import axios from 'axios';
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

    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser, answerCall } = useContext(SocketContext);
    const classes = useStyles();
    const [allFriends, setAllFriends] = useState([]);
    const [friendCalling, setFriendCalling] = useState('');


    useEffect(() => {
        const userEmail = window.sessionStorage.getItem('currentUser');
        axios.get(SERVER_URL + '/userFriends', {
            params: {
                email: userEmail
            }
        })
            .then(res => {
                const allF = res.data;
                for (var i = 0; i < allF.length; i++) {
                    if (allF[i].email_friend === userEmail) {
                        //if user is on friend side in table, switch to real friend (current user)
                        allF[i].email_friend = allF[i].email_user
                    }
                }
                setAllFriends(res.data);
            })
    }, [])

    const getUserByEmail = (email) => {
        axios.get(SERVER_URL + '/getUserByEmail', {
            params: {
                email: email
            }
        }).then(res => {
            callUser(res.data[0].current_socket_id);
            setFriendCalling(email);
        })
    }

    const removeUser = (email) => {
        axios.delete(SERVER_URL + '/deleteUserByEmail', {
            params: {
                emailToDelete: email,
                userEmail: window.sessionStorage.getItem('currentUser')
            }
        }).then(res => {
            window.location.href = '/video';
        })
    }

    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container className={classes.gridContainer}>
                        {
                            allFriends.length !== 0 ? allFriends.map((friend) => {
                                return <h3 obj={friend.email_user} key={friend.id}>
                                    {/* || friendCalling === friend.email_user
                                        -ovo je bilo u ovom uslovu ispod*/}
                                    {friend.email_friend}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {/*color="primary" */}
                                    {friendCalling !== friend.email_friend ?
                                        <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} onClick={() => getUserByEmail(friend.email_friend)} className={classes.margin}>
                                            Call</Button> :
                                        <Button disabled variant="contained" color="secondary" startIcon={<Phone fontSize="large" />} className={classes.margin}>
                                            Calling
                                        </Button>
                                    }
                                    <Button variant="contained" color="secondary" startIcon={<RestoreFromTrash />} onClick={() => removeUser(friend.email_friend)} className={classes.margin}>
                                        Remove
                                    </Button><br /><br /><br />
                                </h3>;
                            }) : null}
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    );
};

export default Sidebar;