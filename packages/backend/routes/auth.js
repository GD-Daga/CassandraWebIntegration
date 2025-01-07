const express = require('express');
const cassandra = require('cassandra-driver');
const bcrypt = require('bcrypt');
const router = express.Router();

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || '127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'user_db', // Database Keyspace
  authProvider: new cassandra.auth.PlainTextAuthProvider(
    process.env.CASSANDRA_USERNAME,
    process.env.CASSANDRA_PASSWORD
  ),
});

// **Initialize Cassandra Keyspace and Tables**
const initializeCassandra = async () => {
  const keyspaceQuery = `
    CREATE KEYSPACE IF NOT EXISTS ${process.env.CASSANDRA_KEYSPACE || 'user_db'}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
  `;

  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.CASSANDRA_KEYSPACE || 'user_db'}.users (
      username TEXT PRIMARY KEY,
      password TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      location TEXT,
      about TEXT
    );
  `;

  try {

    await client.execute(keyspaceQuery);
    console.log('Keyspace created or already exists.');

    await client.execute(createUsersTableQuery);
    console.log('Users table created or already exists.');
  } catch (error) {
    console.error('Error during Cassandra initialization:', error);
  }
};

initializeCassandra();

// **Registration Route**
router.post('/register', async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Username, password, first name, and last name are required.' });
  }

  try {
    const checkQuery = `SELECT username FROM ${process.env.CASSANDRA_KEYSPACE}.users WHERE username = ?`;
    const existingUser = await client.execute(checkQuery, [username], { prepare: true });

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `INSERT INTO ${process.env.CASSANDRA_KEYSPACE}.users (username, password, first_name, last_name, email, location, about) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await client.execute(insertQuery, [username, hashedPassword, firstName, lastName, "", "", ""], {
      prepare: true,
    });

    return res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// **Login Route**
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const query = `SELECT username, password, first_name, last_name, email, location, about FROM ${process.env.CASSANDRA_KEYSPACE}.users WHERE username = ?`;
    const result = await client.execute(query, [username], { prepare: true });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email || '',
        location: user.location || '',
        about: user.about || '',
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// **Get User Profile Route**
router.get('/profile', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required to fetch profile.' });
  }

  try {
    const query = `SELECT username, first_name, last_name, email, location, about FROM ${process.env.CASSANDRA_KEYSPACE}.users WHERE username = ?`;
    const result = await client.execute(query, [username], { prepare: true });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = result.rows[0];
    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        location: user.location || "",
        about: user.about || "",
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// **Update User Profile Route**
router.put('/update-profile', async (req, res) => {
  const { username, email, location, about } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required.' });
  }

  try {
    if (!email && !location && !about) {
      return res.status(400).json({ success: false, message: 'At least one field (email, location, about) must be provided.' });
    }

    const updateQuery = `UPDATE ${process.env.CASSANDRA_KEYSPACE}.users SET email = ?, location = ?, about = ? WHERE username = ?`;
    await client.execute(updateQuery, [email || '', location || '', about || '', username], { prepare: true });

    return res.status(200).json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
