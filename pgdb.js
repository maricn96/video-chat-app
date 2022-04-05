const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	host: 'hangondb.c3oy6dnwf0rp.us-east-1.rds.amazonaws.com',
	password: 'postgres',
	port: 5432
})

module.exports = pool;