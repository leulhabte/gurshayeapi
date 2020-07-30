const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const tips = require('./api/routes/tips');
const path = require('path');

dotenv.config();

mongoose.connect(`mongodb+srv://leulhabte:${process.env.MONGO_PASS}@cluster0-saiuw.mongodb.net/test?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(console.log('Database connected...')).catch(err=>{console.log(err)});

const app = express();

const user = require('./api/routes/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Handling CORS Error
app.use((req, res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }    
    next();
});

app.use('/tips', tips);
app.use('/user', user);

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
});

if(process.env.NODE_ENV == 'production'){
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

module.exports = app;