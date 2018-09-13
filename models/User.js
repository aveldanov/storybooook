const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema

const UserSchema = new Schema({
  googleID: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  image:{
    type:String
  },
  story:{
    type: Schema.Types.ObjectId,
    ref:'stories'
  }
  
});

//Create collection and add schema

mongoose.model('users', UserSchema);