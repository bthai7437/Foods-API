const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    //reject files that are not jpeg or png
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(new Error('file type is not png/jpeg'),false);
    }
};    

const upload  = multer({storage: storage,
    limits:{
    fileSize: 1024 * 1024 * 5 //5 megabytes upload limit  
    },
    fileFilter:fileFilter
});




router.get('/foods',(req,res,next)=>{
    Food.find()
    .select('title type ingredients qty foodImage')
    .exec()
    .then(docs => {
        const response = {
            foods: docs.map(doc =>{
                return {
                    title: doc.title,
                    type: doc.type,
                    ingredients: doc.ingredients,
                    _id : doc._id,
                    qty: doc.qty,
                    foodImage: doc.foodImage,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/food-recipes/'+ doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/foods',upload.single('foodImage'),(req,res,next)=>{

    console.log(req.file);
   
    const food = new Food({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        type: req.body.type,
        ingredients: req.body.ingredients,
        qty: req.body.qty,
        foodImage: req.file.path
    });
    food.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /foods',
            createdProduct: {
                title: result.title,
                ingredients: result.ingredients,
                type: result.type,
                qty: result.qty,
                foodImage: result.foodImage,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/food-recipes/'+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/foods/:foodID',(req,res,next)=>{
    const id = req.params.foodID;
    Food.findById(id)
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
            res.status(500).json({
            error: err
        });
    });    
    
})

router.patch('/foods/:foodID',(req,res,next)=>{
    const id = req.params.foodID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Food.update({_id: id},{$set: updateOps})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
    res.status(200).json({
        message: 'Patched Food!',
    });    
})

router.delete('/foods/:foodID',(req,res,next)=>{
    const id = req.params.foodID;

    Food.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    res.status(200).json({
        message: 'Deleted Food!',
    });
    
})

module.exports = router;