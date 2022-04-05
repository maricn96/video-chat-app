const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
const server = require('http').createServer(app);
const cors = require('cors');
const pool = require('./pgdb');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running.');
});

io.on('connection', (socket) => {

    socket.emit('me', socket.id);

    socket.on('disconnect', (userToCall) => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name });
    })

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});


//POSTGRES ROUTES

//REGISTER
app.post('/user', async (req, res) => {
	try {
		const user = req.body;
        const existingUser = await (await pool.query('SELECT * FROM app_user WHERE email = $1', [user.email])).rows;
        if(existingUser.length !== 0) {
            res.send('Email already exists!').status(400);
        } else {
            
        const newUser = await pool.query("INSERT INTO app_user(email, password, first_name, last_name, nickname, date_created) values ($1, $2, $3, $4, $5, $6)",
		 [user.email, user.password, user.firstname, user.lastname, user.nickname, new Date().toLocaleString()]);
		res.send('CREATED').status(200);
        }
	} catch(err) {
		console.log(err.message);
        res.send(err.message).status(400);
	}
})

//LOGIN
app.post('/signin', async (req, res) => {
	try {
		const user = req.body;
        const existingUser = await (await pool.query('SELECT * FROM app_user WHERE email = $1 AND password = $2', [user.email, user.password])).rows;
        if(existingUser.length === 0) {
            res.send('Wrong email or password!').status(400);
        } else {
		res.send('LOGGED_IN').status(200);
        }
	} catch(err) {
		console.log(err.message);
        res.send(err.message).status(400);
	}
})


//SAVE CURRENT SOCKET_ID
app.post('/assignSocketId', async (req, res) => {
	try {
		const user = req.body;
        await pool.query('UPDATE app_user SET current_socket_id = $1 WHERE email = $2', [user.socketId, user.email]);
        res.send('USER_UPDATED_WITH_SOCKET_ID')
	} catch(err) {
		console.log(err.message);
        res.send(err.message).status(400);
	}
})


//ADD USER_UPDATED_WITH_SOCKET_ID
app.post('/addUser', async (req, res) => {
    try {
        const dto = req.body;
        const emailUser = dto.emailUser;
        const emailFriend = dto.emailFriend;
        if(emailUser === emailFriend) {
            res.send("Dude you can't add yourself..").status(400);
            return;
        }
        const users = await (await pool.query('SELECT * FROM app_user WHERE email = $1', [emailFriend])).rows;
        if(users === undefined || users.length === 0) {
            res.send("Unknown email address!").status(400);
            return;
        } else {
            const friendList = await (await pool.query('SELECT * FROM app_user_friends WHERE ((email_user = $1 AND email_friend = $2) OR (email_user = $2 AND email_friend = $1))', 
            [emailUser, emailFriend])).rows;
            if(friendList !== undefined && friendList.length !== 0) {
                res.send("Already in friends list!").status(400);
            } else {
                await pool.query('INSERT INTO app_user_friends (email_user, email_friend) VALUES ($1, $2)', [emailUser, emailFriend])
                res.send('ADDED').status(200);
            }
        }
    } catch(err) {
		console.log(err.message);
        res.send(err.message).status(400);
    }
})


//RETRIEVE USER FRIENDS LISTEN
app.get('/userFriends', async (req, res) => {
    try {
        const emailUser = req.query.email;
        const friendList = await (await pool.query('SELECT * FROM app_user_friends WHERE email_user = $1 OR email_friend = $1', 
        [emailUser])).rows;
        res.send(friendList).status(200);
    } catch(err) {
		console.log(err.message);
        res.send(err.message).status(400);
    }
})


//GET USER BY EMAIL
app.get('/getUserByEmail', async (req, res) => {
    try{
        const email = req.query.email;
        const user = await (await pool.query('SELECT * FROM app_user WHERE email = $1', 
        [email])).rows;
        res.send(user).status(200);
    }  catch(err) {

    }
})

//DELETE USER BY EMAIL
app.delete('/deleteUserByEmail', async (req, res) => {
    try{
        const userEmail = req.query.userEmail;
        const emailToDelete = req.query.emailToDelete;
        await pool.query('DELETE FROM app_user_friends WHERE (email_user = $1 AND email_friend = $2) OR (email_user = $2 AND email_friend = $1)', [userEmail, emailToDelete]);
        res.send('DELETED').status(200);
    }  catch(err) {
    }
})

//GET USER BY SOCKET_ID
app.get('/getUserBySocketId', async (req, res) => {
    try{
        const socketId = req.query.socketId;
        const user = await (await pool.query('SELECT * FROM app_user WHERE current_socket_id = $1', 
        [socketId])).rows;
        res.send(user).status(200);
    }  catch(err) {

    }
})


server.listen(PORT, () => console.log(`listening on port ${PORT}`));