import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Login from '../auth/login/Login';
import Registration from '../auth/registration/Registration';
import Home from '../Home';
import App from '../../App';
import { ContextProvider } from '../../Context';

const Navbar = () => {

    const [currentUser, setCurrentUser] = React.useState(window.sessionStorage.getItem("currentUser"));

    return (
        <div>
            <Router>

                <Box sx={{ flexGrow: 1 }} id="navbar">
                    <AppBar position="static">
                        <Toolbar>
                            <Link className='custom-link' type='' to="/" style={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <strong>HANG ON</strong> video chat application
                                </Typography>
                            </Link>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    If not working go to <strong><i>https://hang-on-call.herokuapp.com</i></strong> to run server..
                                </Typography>
                            {
                                currentUser === '' || currentUser === null? <span>
                                    <Link className='custom-link' type='' to="/login"><Button variant="contained" color="inherit">Login</Button></Link>&nbsp;&nbsp;&nbsp;
                                    <Link className='custom-link' type='' to="/register"><Button variant="contained" color="inherit">Register</Button></Link>
                                     </span> :
                                    <Button variant="outlined" color="inherit" onClick={() => {
                                        window.sessionStorage.setItem('currentUser', '');
                                        window.location.href = '/';
                                    }}>Logout</Button>
                            }
                        </Toolbar>
                    </AppBar>
                </Box>
                <Routes>
                {
                        currentUser === '' || currentUser === null ? <Route path='/' element={<Home />}/> : 
                        <Route path='/' element={<ContextProvider>
                            <App />
                        </ContextProvider>} />
                    }
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Registration />} />
                    <Route path='/' element={<Home />} />
                    {
                        currentUser === '' ? <Route path='/video' element={<Home />}/> : 
                        <Route path='/video' element={<ContextProvider>
                            <App />
                        </ContextProvider>} />
                    }
                </Routes>
            </Router>
        </div>
    );
}

export default Navbar;