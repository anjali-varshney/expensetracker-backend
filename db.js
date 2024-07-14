const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectToMongo = () =>{
    mongoose.connect(mongoURI);
}

module.exports = connectToMongo;