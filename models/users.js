const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true, 
        trim : true
    },
    password : {
        type : String,
        unique : true, 
        required : true,
        trim : true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("The passowrd can't contain \"password\" string");
            } else if(value.length <= 6) { // or use min length 
                throw new Error("The password must be greater than 6")
            }
        }
    },
    capital: {
        type: Number,
        default: 100000
    }
}, {
    timestamps : true
});


userSchema.pre('save', async function(next) {
    const user = this;  

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;