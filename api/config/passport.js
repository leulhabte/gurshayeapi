const LocalStratagy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../model/user');
const User = mongoose.model('user');

module.exports = function(passport){
    passport.use( new LocalStratagy({usernameField: 'name'}, (name, password, done)=>{
        User.findOne({
            name: name
        }).then((user)=>{
            if(!user){
                return done(null, false);
            }
            bcrypt.compare(password, user.password, (err, isMatched)=>{
                if(!isMatched){
                    return done(null, false);
                }else{
                    console.log('Success...');
                    return done(null, user);
                }
            });
        })
    }));
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    })

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        })
    })
}