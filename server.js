const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
var logger = require('morgan');

const cors = require('cors');

const apiRouter = require('./routes/api')
const config = require('./config')

const port = process.env.PORT || 3000;
const app = express();
app.use(bp.json());



app.use(cors());

app.use(logger('dev'));

app.use('/api', apiRouter)
app.get('/', (req, res) => {
    res.send('hello')
})



mongoose.set('useCreateIndex', true);
const connect = mongoose.connect(config.mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});
connect.then((db) => {
    console.log('Connected to the server');
  
    const port = 3000
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  }, (err) => {
    console.log(err);
})
