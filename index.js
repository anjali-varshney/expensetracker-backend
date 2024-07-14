const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
app.use(cors())

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

/* 
  *express.json() is a built-in middleware function in the Express.js web framework.
  *It parses incoming JSON data from the request body of an HTTP POST or PUT request
  *and makes it available in the request.body object.
*/
app.use(express.json())

// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/expenses',require('./routes/expenses'))


app.get('/', (req, res) => {
  res.send('Hello World! This indicates the backend is running..')
})

app.listen(port, () => {
  console.log(`Expense Tracker backend listening on port http://localhost:${port}`)
})