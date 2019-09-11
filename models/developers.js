let mongoose = require('mongoose');

// name: an object has
// first name  (required)
// last name
// Level: String and can be either ‘Beginner or Expert’. (required and should be saved in all caps)
// Address: Object has
// State
// Suburb
// Street
// Unit

let developersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        //enum : ['‘Beginner', 'Expert’']

    },
    address:{
        state: String,
        suburb: String,
        street: String,
        unit: String
    }
});

module.exports = mongoose.model('Developers', developersSchema);