const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

//User Schema
const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    firstname: { type: String, unique: false, required: false },
    lastname: { type: String, unique: false, required: false },
    ex: { type: String, unique: false, required: false },
    phone: { type: String, unique: false, required: false },
    location: { type: String, unique: false, required: false },
    industry: { type: String, unique: false, required: false },
    role: { type: String, unique: false, required: false },
    company: { type: String, unique: false, required: false }
});

UserSchema.plugin(updateIfCurrentPlugin);

const User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = function(id,callback){
   
  User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
  const query = {username: username}
  console.log(query);
  
  User.findOne(query,callback); 
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10,(err,salt) =>{
    bcrypt.hash(newUser.password,salt, (err, hash)=>{
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword =  function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err,isMatch) => {
    if(err) throw err;
    callback(null, isMatch);

  });
}
// module.exports.isSuperUser = async ()=>{
//     // let dbResult = await User.find();
//     // return dbResult;
//     User.find({},(e,d)=>{
//      if(e){
//        console.log(e);
//      }
//      console.log('data is ',d);
//     });
// }
module.exports.isSuperUser = function(){
  // username : regaskmvp@gmail.com
  // Password : 123456
  var query = {"username" : "regaskmvp@gmail.com"};
  User.findOne(query,async (err,data)=>{
    if(err){
      console.log(err);
    }
    if(!data){
      // console.log('SuperAdmin ',data);
      var dbObj = [{
        "username" : "super@regask.com",
        "password" : "$2a$10$F93VEfZJzLnAUjiexgrgT.9SxGkB.eXYCvQYncmq70mHW68kGo8ra",
        "firstname" : "RegAsk",
        "lastname" : "Super Admin",
        "phone" : "8800971471",
        "location" : "india",
        "ex" : "+91",
        "role" : "superadmin",
        "company" : "techferry",
        "industry" : "IT"
      }];
      let dbOutput = await User.insertMany(dbObj);
      // console.log('Db created ',dbOutput);

    }
  });
  //  return out;
}