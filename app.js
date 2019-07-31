const express = require('express');
const app = express();
const foodRoutes = require('./api/routes/food-recipes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use((req,res,next)=>{
    //allow any user to access api
    res.header("Access-Control-Allow-Origin","*"); 
    //"Origin,X-Requested-With,Content-Type,Accept,Authorization are available if specified instead of *
    res.header("Access-Control-Allow-Headers","*");
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',
                    'PUT',
                    'POST',
                    'PATCH',
                    'DELETE',
                    'GET');
        return res.status(200).json({});
    }
    next();
}); //This prevents CORS errors

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));
app.use('/food-recipes',foodRoutes);



mongoose.connect(
'mongodb+srv://tempUser:tekken7@cluster0-agkt2.mongodb.net/food-recipes?retryWrites=true&w=majority',
{ useNewUrlParser: true }
);

app.use(morgan('dev'));

//Handle errors
app.use((req,res,next)=>{
    const error = new Error('Not found!');
    error.status = 404;
    next(error); 
});

app.use((error,req,res,next)=>{
    res.status(500).json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;
