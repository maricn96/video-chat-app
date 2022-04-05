import React, { useContext, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';

import { SocketContext } from '../Context';

const Home = () => {

    return (
        <div>
            <Typography gutterBottom variant="h1">Welcome to simple video chat application. Sign in if you already have account. If not, go for registration</Typography>
        </div>
    );
};

export default Home;