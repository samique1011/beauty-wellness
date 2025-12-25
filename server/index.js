const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

app.listen(PORT, async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/beauty_wellness')
        console.log("DB connected");
        console.log(`Server running on http://localhost:${PORT}`);
    }catch(err){
        console.log("Database connectivity error");
    }
    
});
