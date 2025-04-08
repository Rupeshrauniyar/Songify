const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.route');
const songsRoutes = require('./routes/songs.route');

app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

 