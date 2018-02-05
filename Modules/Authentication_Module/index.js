var contract = require("truffle-contract");
var jwt = require('jsonwebtoken');
var Web3 = require("web3");
var AuthenticationContract_artifacts =require("../../build/contracts/AuthenticationContract.json");
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://171.18.1.213:8545"));
var AuthenticationContract = contract(AuthenticationContract_artifacts);
var AccountList;
var defaultAccount;
console.log(web3.isConnected() )
web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
       AccountList = accs;
      defaultAccount = AccountList[0];

      // setting up the default accounts for transaction realted to Authetication Contract
      AuthenticationContract.setProvider(web3.currentProvider);
      AuthenticationContract.defaults({
        from: defaultAccount,
        gas: 4712388,
        gasPrice: 100000000000
      })
})
// var accountList=web3.personal.newAccount("hrhk");
// console.log(accountList);
 module.exports={
   doSignUp:function(req,res,next){
       if(!req.body.userEmailId || !req.body.password || !req.body.gender){
           res.json({
               error:"Kindly provide all necessary fields."
           })
       }
       else{
            AuthenticationContract.deployed().then(function (instance) {
               console.log("Checking EmailId");
               return instance.checkEmailExistence(req.body.userEmailId,{from:defaultAccount});
           }).then(function (result) {
                    if(result=="userExist"){
                        console.log("EmailId exist");
                        res.json({
                            code:"101",
                            message:"userAlready registered"
                        })
                    }
                    else{
                            var accountAddress = web3.personal.newAccount("hrhk1234");
                            AuthenticationContract.deployed().then(function (instance) {
                                console.log("Creating Account");
                                return instance.doSignUp(accountAddress, req.body.userEmailId, req.body.password, req.body.gender, { from: defaultAccount});
                            }).then(function (result) {

                                console.log('Account Created ', result);
                                res.json({
                                    code:"102",
                                    message:"accountCreated Successfully"
                                })

                            });
                        }
            });
          
       }

   },
   doLogin:function(req,res,next){
                if (!req.body.userEmailId || !req.body.password) {
                    res.json({
                        error: "Kindly provide all necessary fields."
                    })
                }
                else {
                    AuthenticationContract.deployed().then(function (instance) {
                        console.log("Verifying user");
                        return instance.doLogin(req.body.userEmailId,req.body.password,{ from: defaultAccount});
                    }).then(function (result) {
                            if(result==true){
                                console.log('Login Successfull', result);
                                var token = jwt.sign({ email: req.body.userEmailId}, 'hrhk1234');
                                // jwt.verify(token, 'hrhk1234', function(err, decoded) {
                                // console.log("decoded token",decoded.email) 
                                });
                                res.json({
                                    code: "103",
                                    message: "Login Successfull",
                                    authToken:token
                                })
                            }
                            else{
                                console.log("invalid login",result);
                                res.json({
                                    code: "104",
                                    message: "invalid credential"
                                })
                            }

                    });
                }
   }
 }
