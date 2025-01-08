const express = require('express');
const bodyParser = require('body-parser');
//const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookmarksRoutes = require('./routes/bookmarks');

//dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/bookmarks', bookmarksRoutes);

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['cassandra-0.cassandra.default.svc.cluster.local'],
  localDataCenter: 'datacenter1',
  keyspace: 'user_db',
  credentials: { username: 'cassandra', password: 'cassandra' }
});

// async function run() {
//   const query = 'SELECT * FROM users';
//   const result = await client.execute(query);
//   console.log(result.rows);
// }
// run().catch(console.error);

const PORT = process.env.PORT || 5000;
// const HOST = '0.0.0.0';
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
