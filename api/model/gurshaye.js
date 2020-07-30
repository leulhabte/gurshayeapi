const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataSchema = Schema({
    league : {
        type: String,
        required: true
    },
    team1 : {
        type: String,
        required: true
    },
    team2 : {
        type: String,
        required: true
    },
    time : {
        type: String,
        required: true
    },
    date : {
        type: String,
        required: true
    },
    tip : {
        type: String,
        required: true
    },
    correct: {
        type: String,
        required: true,
        default: 'N/A'
    },
    insertedAt : {
        type: Date,
        default: Date.now
    },
});

mongoose.model('tips', dataSchema);