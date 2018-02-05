const express=require('express');
var app=express();
var router = express.Router();
var userModule=require('./Modules/User_Module/index');

// router.post('/SignUp',AuthenticationModule.doSignUp);
router.get('/user/getBalance/:address',userModule.getBalance);
router.post('/user/createAccount',userModule.createAcount);
router.post('/user/makeTransaction',userModule.makeTransaction);

module.exports=router;


