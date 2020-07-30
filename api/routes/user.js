const express = require('express');
const passport = require('passport');
const route = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

require('../config/passport')(passport);

require('../model/user');
const User = mongoose.model('user');

route.post('/login', (req, res)=>{
    console.log(req.body);
    User.findOne({
        name: req.body.name
    }).then((user)=>{
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, isMatched)=>{
                if(isMatched){
                    const token = jwt.sign({
                        name: user.name,
                        id: user._id
                    },
                    process.env.MONGO_PASS,
                    {
                        expiresIn: '2m'
                    }
                    );
                    // res.cookie('jwt', token, {httpOnly: true})
                    console.log(token);
                    res.json({
                        type: 1,
                        data: user,
                        token: token,
                    });
                }else{
                    res.json({
                        type: 0,
                        message: 'Username or password didn\'t match'
                    });
                }
            });
        }else{
            res.json({
                type: 0,
                message: 'Username or password didn\'t match'
            });
        }
    })
});

route.get('/loged', (req,res)=>{
    console.log(req.user);
    res.json({
        message: 'logged'
    });
});

route.post('/signup', (req, res)=>{
    User.find()
    .then((user)=>{
        if(user.length === 0){
            console.log(req.body.pwd);
            let error = [];
        
            if(req.body.pwd != req.body.rpwd){
                error.push('Password Didn\'t match');
            }
            if(req.body.pwd.length < 4){
                error.push('Password Must have at least 4 characters'); 
            }
            if(error.length > 0){
                res.json({
                    type: 0,
                    data: error
                });
            }else{
                const newUser = {
                    name: req.body.name,
                    password: req.body.pwd
                };
        
                bcrypt.genSalt(10, (error, salt)=>{
                    bcrypt.hash(newUser.password, salt, (error, hash)=>{
                        newUser.password = hash;
                        User(newUser).save()
                        .then(user=>{
                            console.log('Saved...'+user);
                            res.json({
                                type: 1,
                                data: user
                            })
                        }).catch(err =>{console.log(err)});
                    })
                })
            }
        }else if(user){
            res.json({
                type: 2
            })
        }
    })
    
});

route.get('/remove/:name', (req, res)=>{
    console.log(req.params.name)
    User.deleteOne(
        {_id: req.params.name}
    )
    .then(()=>{res.json({message: 'Deleted'})})
});

route.put('/userEdit', (req, res)=>{
    User.findOne().then(user=>{
        bcrypt.compare(req.body.ppwd, user.password, (err, isMatched)=>{
            if(!err){
                if(isMatched){
                    let error = [];
                    if(req.body.pwd != req.body.rpwd){
                        error.push('Password didn\'t match');
                    }
                    if(req.body.pwd.length < 4){
                        error.push('Password must be at least 4 characters long')
                    }
                    if(error.length == 0){
                        bcrypt.genSalt(10, (err, salt)=>{
                            bcrypt.hash(req.body.pwd, salt, (err, hash)=>{
                                req.body.pwd = hash;
                                user.name = req.body.name
                                user.password = req.body.pwd
                                user.save().then(res.json({
                                    type: 1,
                                    message: 'Profile Updated'
                                }))
                            })
                        })
                    }else{
                        res.json({
                            type: 0,
                            error: error
                        })
                    }
                }else{
                    res.json({
                        type: 2,
                        error: "Incorrect Password"
                    })                    
                }
            }

        })
    }).catch(err=>{
        res.json({
            message: "error",
            error: err.message
        })
    })
});

route.get('/get', (req, res)=>{
    User.find().then((user)=>{
        res.json({
            user: user
        })
    })
});

module.exports = route;