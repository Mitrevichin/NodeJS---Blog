const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Method to format dates
postSchema.methods.formatDate = function (date) {
    return date.toDateString();
}

module.exports = mongoose.model('Post', postSchema);