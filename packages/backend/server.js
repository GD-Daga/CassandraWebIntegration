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

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

