const express = require('express');
const cassandra = require('cassandra-driver');
const bcrypt = require('bcrypt');
const router = express.Router();

// Cassandra Client Configuration
const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || '127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: new cassandra.auth.PlainTextAuthProvider(
    process.env.CASSANDRA_USERNAME,
    process.env.CASSANDRA_PASSWORD
  ),
});

// **Registration Route**
router.post('/register', async (req, res, next) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password || !firstName || !lastName) {
    console.log('Missing required fields in request body');
    return res
      .status(400)
      .json({ message: 'Username, password, first name, and last name are required.' });
  }

  try {
    console.log(`Received registration request for username: ${username}`);

    const checkQuery = `SELECT username FROM ${process.env.CASSANDRA_KEYSPACE}.users WHERE username = ?`;
    const existingUser = await client.execute(checkQuery, [username], { prepare: true });

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO ${process.env.CASSANDRA_KEYSPACE}.users (username, password, first_name, last_name) VALUES (?, ?, ?, ?)`;
    await client.execute(insertQuery, [username, hashedPassword, firstName, lastName], {
      prepare: true,
    });

    console.log(`User ${username} registered successfully.`);
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    console.log(`Login attempt for username: ${username}`);

    const query = `SELECT username, password, first_name, last_name FROM ${process.env.CASSANDRA_KEYSPACE}.users WHERE username = ?`;
    const result = await client.execute(query, [username], { prepare: true });

    if (result.rows.length === 0) {
      console.log(`User ${username} not found`);
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid password.' });
    }

    console.log(`Login successful for user: ${username}`);
    return res
      .status(200)
      .json({ message: 'Login successful', user: { username, firstName: user.first_name, lastName: user.last_name } });
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
});

module.exports = router;
