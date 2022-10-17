const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: {
        type:  mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    userType: {
        type: String,
        enum: ['user', 'driver'],
        required: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    report: {
        type: String,
        required: true,
        trim: true,
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
