const express = require('express');
const cassandra = require('cassandra-driver');
const router = express.Router();

// Cassandra Client Configuration
const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS || '0.0.0.0'],
  localDataCenter: 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'user_db',
  authProvider: new cassandra.auth.PlainTextAuthProvider(
    process.env.CASSANDRA_USERNAME,
    process.env.CASSANDRA_PASSWORD
  ),
});

// **Create Bookmarks Table**
const createBookmarksTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bookmarks (
      username TEXT,
      church_name TEXT,
      district TEXT,
      address TEXT,
      nearest_mrt TEXT,
      PRIMARY KEY (username, church_name)
    );
  `;

  try {
    await client.execute(createTableQuery);
    console.log('Bookmarks table created successfully.');
  } catch (error) {
    console.error('Error creating bookmarks table:', error);
  }
};

createBookmarksTable();

// **Add Bookmark Route**
router.post('/add-bookmark', async (req, res) => {
  const { username, church } = req.body;

  if (!username || !church || !church.name) {
    return res.status(400).json({ message: 'Username and church details are required.' });
  }

  try {
    const insertQuery = `
      INSERT INTO bookmarks (username, church_name, district, address, nearest_mrt)
      VALUES (?, ?, ?, ?, ?);
    `;
    await client.execute(
      insertQuery,
      [username, church.name, church.district, church.address, church.nearest_mrt],
      { prepare: true }
    );

    return res.status(201).json({ message: `${church.name} has been added to your bookmarks.` });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// **Get Bookmarks Route**
router.get('/get-bookmarks', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required to fetch bookmarks.' });
  }

  try {
    const query = `SELECT church_name, district, address, nearest_mrt FROM bookmarks WHERE username = ?`;
    const result = await client.execute(query, [username], { prepare: true });

    return res.status(200).json({ bookmarks: result.rows });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// **Remove Bookmark Route**
router.delete('/remove-bookmark', async (req, res) => {
  const { username, church_name } = req.body;

  if (!username || !church_name) {
    return res.status(400).json({ message: 'Username and church name are required.' });
  }

  try {
    const deleteQuery = `DELETE FROM bookmarks WHERE username = ? AND church_name = ?`;
    await client.execute(deleteQuery, [username, church_name], { prepare: true });

    return res.status(200).json({ message: `${church_name} has been removed from your bookmarks.` });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
