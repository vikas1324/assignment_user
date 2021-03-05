const mongoose=require('mongoose')
var crypto = require('crypto');
const UserSchema=new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true
    },
    hash : String, 
    salt : String, 
    us_fname:{
        type:String,
        required:true
    },
    us_lname:{
        type:String,
        required:true
    },
    us_mail:{
        type:String,
        required:true
    },
    us_mobile:{
        type:Number,
        required:true
    },
    us_address:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
})

// Method to set salt and hash the password for a user 
UserSchema.methods.setPassword = function(password) { 
     
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // Hashing user's salt and password with 1000 iterations, 
        
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 
     
   // Method to check the entered password is correct or not 
   UserSchema.methods.validPassword = function(password) { 
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
       return this.hash === hash; 
   }; 
   const User = module.exports=mongoose.model('User',UserSchema)