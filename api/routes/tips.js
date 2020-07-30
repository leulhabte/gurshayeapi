const express = require('express');
const mongoose = require('mongoose');
const routes = express.Router();

require('../model/gurshaye');
const Tips = mongoose.model('tips');

routes.post('/save', (req, res)=>{
    console.log("Invoked");
    console.log(req.body);
    const newTips = {
        league: req.body.league,
        team1: req.body.team1,
        team2: req.body.team2,
        time: req.body.time,
        date: req.body.date,
        tip: req.body.tip	
    };

    new Tips(newTips).save()
    .then(tip=>{
        res.json({
            message: "saved",
            data: tip
        });
    })
    .catch(err=>{console.log(err)});
});

routes.get('/posts',(req, res)=>{
    Tips.find({}).then(tips=>{
        console.log(tips)
        res.json({
            Total: tips.length,
            data: tips
        });
    })
});

routes.put('/edit/:id', (req, res)=>{
    Tips.findOne({
        _id: req.params.id
    }).then((value)=>{
        value.league = req.body.league,
        value.team1 = req.body.team1,
        value.team2 = req.body.team2,
        value.time = req.body.time,
        value.date = req.body.date,
        value.tip = req.body.tip
        
        value.save().then(()=>{
            console.log("Value Saved");
            res.json({
                data: value
            });
        })
    });
});

routes.delete('/remove/:id', (req, res)=>{
    Tips.deleteOne({
        _id: req.params.id
    }).then(()=>{
        res.json({
            message: 'Success',
        });
    }).catch(err=>{
        res.json({
            message: 'Action Failed'
        });
    });
});

routes.get('/leagues', (req, res)=>{
    Tips.find({})
    .then(tips=>{
        const leagues = [], tempo=[], info=[];
        var temp, count=1;
        tips.map(data=>{
            leagues.push(data.league)
        });
        for(var i=0;i<leagues.length; i++){
            if(leagues[i]!='A'){
                temp = leagues[i];
                tempo.push(temp);
            }else{
                continue;
            }
            for(var j=i+1; j<leagues.length; j++){
                if(temp == leagues[j]){
                    count++;
                    leagues[j]='A'
                }
            }
            info.push({
                name: tempo[0],
                count: count
            });
            count = 1;
            tempo.pop();

        }
        res.json({
            Total: tips.length,
            Leagues: info
        })
    })
});

routes.post('/incorrect/:id', (req, res)=>{
    Tips.findOne({
        _id: req.params.id
    }).then(tip=>{
        tip.correct = 'F'
        tip.save().then(res.json({tip: tip}))
    })
});

routes.get('/overall', (req, res)=>{
    Tips.find({}).
    then(tips=>{
        const overall = [];
        var count=0, corr;
        tips.map(data=>{
            overall.push(data.correct);
        });
        for(var i=0; i<overall.length; i++){
            if(overall[i] == 'F'){
                count++;
            }
        }
        corr = overall.length - count;
        res.json({
            correct: corr,
            Incorrect: count
        })
    })
});

routes.put('/change/:id', (req, res)=>{
    Tips.findOne({
        _id: req.params.id
    }).then(tip=>{
        tip.insertedAt = req.body.dt;
        tip.save().then(res.json({
            info: tip
        }));
    })
});

routes.get('/unchecked', (req, res)=>{
    Tips.find().
    then(tips=>{
        const info = []
        tips.map(data=>{
            if(data.correct == 'N/A'){
                info.push(data)
            }
        });
        
        res.json({
            tip: info
        })
    });
})

routes.get('/unchecked2', (req, res)=>{
    Tips.find().
    then(tips=>{
        const info = []
        var temp;
        tips.map(data=>{
            if(data.correct == 'N/A'){
               temp = {
                   info: {
                       _id: data._id,
                       correct: data.correct,
                       league: data.league,
                       match: `${data.team1} vs ${data.team2}`,
                       time: data.time.slice(11,16),
                       date: data.date.slice(0,10),
                       tip: data.tip,
                       insertedAt: data.insertedAt
                   }
               }
               info.push(temp.info);
            }
        });
        res.json({
            tip: info
        })
    });
})

routes.get('/stat', (req, res)=>{
    Tips.find({}).
    then(tips=>{
        const insertedAt = [], tempo=[], info=[];
        var temp, count=1;
        tips.map(data=>{
            insertedAt.push(data.insertedAt)
        });
        for(var i=0;i<insertedAt.length; i++){
            if(insertedAt[i]!='A'){
                var temp = `'${insertedAt[i]}'`.slice(1, 10);
                tempo.push(temp);
            }else{
                continue;
            }
            for(var j=i+1; j<insertedAt.length; j++){
                const date = `'${insertedAt[j]}'`.slice(1, 10)
                if(temp == date){
                    count++;
                    insertedAt[j]='A'
                }
            }
            info.push({
                name: tempo[0],
                count: count
            });
            count = 1;
            tempo.pop();

        }
        res.json({
            Total: tips.length,
            statistics: info
        })
    })
});

module.exports = routes;