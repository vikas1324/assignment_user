const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const Users=require('../models/users')
var verifyToken = require('../middlewear/verifytoken');
var dateTime = require('node-datetime');
var jwt = require('jsonwebtoken');
var config = require('../config/configToken');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - Login
 *     name: User registration
 *     summary: User registration
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *             password:
 *               type: string
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             us_mail:
 *               type: string
 *             mobile:
 *               type: integer
 *             address:
 *               type: string
 *         required:
 *           - user_id
 *           - password
 *           - firstname
 *           - lastname
 *           - us_mail
 *           - mobile
 *           - address 
 *     responses:
 *       '200':
 *         description: Insert user data Successfully
 *       '400':
 *         description: error
 * 
 * /users/{userid}:
 *   delete:
 *     tags:
 *       - User
 *     name: Delete User
 *     summary: Delete User
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "userid"
 *         in: path
 *         schema:
 *           type: object
 *     responses:
 *       '200':
 *         description: User is deleted
 *       '400':
 *         description: error
 *  
 * /users/{user_id}:
 *   put:
 *     tags:
 *       - User
 *     name: Update User 
 *     summary: Update User 
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "user_id"
 *         in: path
 *         schema:
 *           type: object
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             user_fname:
 *               type: string
 *             user_lname:
 *               type: string
 *             user_mail:
 *               type: string
 *             user_mobile:
 *               type: integer
 *             user_address:
 *               type: string
 *         required:
 *           - user_id
 *           - user_fname
 *           - user_lname
 *           - user_mail
 *           - user_mobile
 *           - user_address
 *     responses:
 *       '200':
 *         description: Project Updated
 *       '400':
 *         description: error
 * 
 * /users/{id}:
 *   get:
 *     tags:
 *       - User
 *     name: Show User
 *     summary: Show User Details
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: "id"
 *         in: path
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *         required:
 *           - id
 *     responses:
 *       '200':
 *         description: fetch users successfully
 *       '400':
 *         description: Error
 *     security:
 *       - bearerAuth: []
 * 
 * /users/{page}/{limit}:
 *   get:
 *     tags:
 *       - User
 *     name: Show User
 *     summary: Show User list
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: "page"
 *         in: path
 *         schema:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *         required:
 *           - page
 *       - name: "limit"
 *         in: path
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: integer
 *         required:
 *           - limit
 *     responses:
 *       '200':
 *         description: fetch users successfully
 *       '400':
 *         description: Error
 *     security:
 *       - bearerAuth: []
 * 
 * /search/{search}/{page}/{limit}:
 *   get:
 *     tags:
 *       - User
 *     name: Show User
 *     summary: Show User list
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: "search"
 *         in: path
 *         schema:
 *           type: object
 *           properties:
 *             search:
 *               type: string
 *         required:
 *           - string
 *       - name: "page"
 *         in: path
 *         schema:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *         required:
 *           - page
 *       - name: "limit"
 *         in: path
 *         schema:
 *           type: object
 *           properties:
 *             limit:
 *               type: integer
 *         required:
 *           - limit
 *     responses:
 *       '200':
 *         description: fetch users successfully
 *       '400':
 *         description: Error
 *     security:
 *       - bearerAuth: []
 * 
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     name: Login
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: User found and logged in successfully
 *       '401':
 *         description: Bad username, not found in db
 *       '400':
 *         description: Username don't match
 */

/** 
 * Insert users data into DB 
 */
router.post('/signup',(req,res)=>{
    let ts = Date.now();
    let mobile=req.body.mobile;
    let email=req.body.us_mail;
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;    
    if(req.body.user_id=='' || req.body.user_id==null){
      res.status(401).json({"status":false,"message":"id is not passed"})
      return false
    }
    if(req.body.password=='' || req.body.password==null){
      res.status(401).json({"status":false,"message":"User password is not passed"})
      return false
    }
    if(req.body.firstname=='' || req.body.firstname==null){
      res.status(401).json({"status":false,"message":"First name is not passed"})
      return false
    }
    if(req.body.lastname=='' || req.body.lastname==null){
      res.status(401).json({"status":false,"message":"Last name is not passed"})
      return false
    }
    if(req.body.us_mail=='' || req.body.us_mail==null){
      res.status(401).json({"status":false,"message":"Email is not passed"})
      return false
    }
    if(!email.match(mailformat)){
      res.status(401).json({"status":false,"message":"Mail id is not valid"})
      return false
    }
    if(req.body.mobile=='' || req.body.mobile==null){
      res.status(401).json({"status":false,"message":"Mobile number is not passed"})
      return false
    }
    if(mobile.length!=10){
      res.status(401).json({"status":false,"message":"Mobile number should be 10 digit"})
      return false
    }
    if(req.body.address=='' || req.body.address==null){
      res.status(401).json({"status":false,"message":"address is not passed"})
      return false
    }
    const user = new Users()
    user.id=req.body.user_id;
    user.password=req.body.password;
    user.setPassword(req.body.password);
    user.us_fname=req.body.firstname;
    user.us_lname=req.body.lastname;
    user.us_mail=req.body.us_mail;
    user.us_mobile=req.body.mobile;
    user.us_address=req.body.address;
    user.createdAt=formatted;
       
      user.save().then(createdUser => {
        res.status(201).json({
          message: "User added successfully"
        //   userId: createdUser._id
        });
      });
})
/** 
 * Get the list of users
*/  
router.get('/users/:page/:limit',verifyToken,(req,res)=>{
    let perPage=parseInt(req.params.limit);
    let page=parseInt(req.params.page);
    Users.find({},{_id:0,id:1,us_fname:1,us_lname:1,us_mail:1,us_mobile:1,us_address:1,createdAt:1})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(userData => {
        res.status(200).json({
          message: "Users data fetched successfully!",
          data: userData
        });
      });
})
/**
 * Get the user details using id   
 */ 
router.get('/users/:id',verifyToken,(req,res)=>{
    if(req.params.id=='' || req.params.id==null){
      res.status(401).json({"status":false,"message":"id is not passed"})
      return false
    }
    Users.find({id:req.params.id},{_id:0,id:1,us_fname:1,us_lname:1,us_mail:1,us_mobile:1,us_address:1,createdAt:1}).then(user => {
        if (user) {
          res.status(200).json({
              status:true,
              message:'Success',
              data:user
            });
        } else {
          res.status(404).json({ 
            status:false,  
            message: "user is not found!",
         });
        }
      });
})

/**
 * Get the user details using  (first name, last name, email,  mobile no)    
 */ 
 router.get('/search/:search/:page/:limit',verifyToken,(req,res)=>{
  let perPage=parseInt(req.params.limit);
  let page=parseInt(req.params.page); 
  if(req.params.search=='' || req.params.search==null){
    res.status(401).json({"status":false,"message":"id is not passed"})
    return false
  }
  if(req.params.page=='' || req.params.page==null){
    res.status(401).json({"status":false,"message":"page is not passed"})
    return false
  }
  if(req.params.limit=='' || req.params.limit==null){
    res.status(401).json({"status":false,"message":"limit is not passed"})
    return false
  }
  let mobile=parseInt(req.params.search)
  if(isNaN(parseInt(req.params.search))){
    mobile=0;
  }
  Users.find({$or:[{us_fname:req.params.search},{us_lname:req.params.search},{us_mail:req.params.search},{us_mobile:mobile}]},{_id:0,id:1,us_fname:1,us_lname:1,us_mail:1,us_mobile:1,us_address:1,createdAt:1})
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .then(user => {
      if (user) {
        res.status(200).json({
            status:true,
            message:'Success',
            data:user
          });
      } else {
        res.status(404).json({ 
          status:false,  
          message: "user is not found!",
       });
      }
    });
})
/**
 * update user data
 */

router.put('/users/:id',verifyToken,(req,res)=>{
    let mobile=req.body.user_mobile;
    let email=req.body.user_mail;
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(req.params.id=='' || req.params.id==null){
      res.status(401).json({"status":false,"message":"id is not passed"})
      return false
    }
    if(req.body.user_fname=='' || req.body.user_fname==null){
      res.status(401).json({"status":false,"message":"User first name is not passed"})
      return false
    }
    if(req.body.user_lname=='' || req.body.user_lname==null){
      res.status(401).json({"status":false,"message":"User last name is not passed"})
      return false
    }
    if(req.body.user_mail=='' || req.body.user_mail==null){
      res.status(401).json({"status":false,"message":"Mail id is not passed"})
      return false
    }
    if(!email.match(mailformat)){
      res.status(401).json({"status":false,"message":"Mail id is not valid"})
      return false
    }
    if(mobile=='' || mobile==null){
      res.status(401).json({"status":false,"message":"Mobile number is not passed"})
      return false
    }
    if(req.body.user_address=='' || req.body.user_address==null){
      res.status(401).json({"status":false,"message":"User address is not passed"})
      return false
    }
    if(mobile.length!=10){
      res.status(401).json({"status":false,"message":"Mobile number should be 10 digit"})
      return false
    }
    const user ={ 
        us_fname: req.body.user_fname,
        us_lname: req.body.user_lname,
        us_mail: req.body.user_mail,
        us_mobile: req.body.user_mobile,
        us_address: req.body.user_address
      };
      Users.updateOne({id: req.params.id }, user).then(result => {
        res.status(200).json({ status:true,message: "Update successful!" });
      });
})
/**
 * Delete the user using user id
 */
router.delete('/users/:id',verifyToken,(req,res)=>{
    if(req.params.id=='' || req.params.id==null){
      res.status(401).json({"status":false,"message":"id is not passed"})
      return false
    }
    Users.deleteOne({ id: req.params.id }).then(result => {
        res.status(200).json({ status:true,message: "User deleted!" });
    });
})

/**
 *  user login
 */ 
router.post('/login', function(req, res) {
    if(req.body.email=='' || req.body.email==null){
        res.status(401).json({"status":false,"message":"email is not passed"})
        return false
    }
    if(req.body.password=='' || req.body.password==null){
        res.status(401).json({"status":false,"message":"Password is not passed"})
        return false
    }

    // Find user with requested email 
    Users.findOne({ us_mail : req.body.email }, function(err, user) { 
      if (user === null) { 
          return res.status(400).json({"status":false,"message":"User is not found"}) 
      } 
      else { 
          if (user.validPassword(req.body.password)) { 
            var token = jwt.sign({ id: req.body.email,pwd:req.body.password }, config.secret, {
              expiresIn: 3600 // expires in 1 hours
          });
          var data={ "auth": true, "token": token }
          res.status(200).send({"status":true,"message":"User logged In","data":data});
          } 
          else { 
            return res.status(400).json({"status":false,"message":"User is not found"})  
          } 
      } 
  }); 

})
/**
 *  user logout
 */ 
router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});
module.exports = router;