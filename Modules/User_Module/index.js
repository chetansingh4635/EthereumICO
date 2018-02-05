var contract = require("truffle-contract");
var jwt = require('jsonwebtoken');
var Web3 = require("web3");
const request = require('request');
const constants = require('../../config/constants.json');
var createAccount = require('./Models/CreateAccountModel');
// var CrowdSale_artifacts =require("../../build/contracts/CrowdSale.json");
// var web3 = new Web3();
// web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:8001"));
// var CrowdSaleContract = contract(CrowdSale_artifacts);
// var AccountList;
// var defaultAccount;
// console.log(web3.isConnected())
// web3.eth.getAccounts(function (err, accs) {
//       if (err != null) {
//         console.log("There was an error fetching your accounts.");
//         return;
//       }

//       if (accs.length == 0) {
//         console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
//         return;
//       }
//        AccountList = accs;
//       defaultAccount = AccountList[0];

//       // setting up the default accounts for transaction realted to Authetication Contract
//       CrowdSaleContract.setProvider(web3.currentProvider);
// })
// var accountList=web3.personal.newAccount("hrhk");
// console.log(accountList);
module.exports = {
    getBalance: function (req, res, next) {
        if (req.params.address.length != constants.addressLength) {
            console.log("error");
            res.json({
                error: constants.addressSizeError
            })
        }
        else {
            const options = {
                url: `${constants.blockCipherTestURL}/addrs/${req.params.address}/balance`,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
                }
            };

            request(options, function (err, resonse, body) {
                let json = JSON.parse(body);
                console.log(json);
                res.json({
                    code: 200,
                    message: constants.success,
                    data: json
                })
            });
        }
    },

    createAcount: function (req, res, next) {
        if (!req.body.emailId) {
            console.log("error");
            res.json({
                error: "Email Required."
            })
        }
        else {
            createAccount.find(req.body).then(function (data) {
                console.log(data);
                if (!data.length) {
                    const options = {
                        url: `${constants.blockCipherTestURL}/addrs?token=${constants.token}`,
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json'
                        }
                    };

                    request(options, function (err, resonse, body) {
                        let json = JSON.parse(body);
                        console.log(json);
                        json.emailId = req.body.emailId;
                        console.log(json)
                        createAccount(json).save()
                            .then(function (doc) {
                                res.json({
                                    code: 200,
                                    message: constants.acountCreated,
                                    data: doc
                                })
                            }, function (reason) {
                                return reason;
                            });

                    });
                }
                else{
                    res.json({error:"user already have account"})
                }
            },
                function (error) {
                    console.log("error");

                })

        }
    },
    makeTransaction: function (req, res, next) {
        if ((!req.body.from || !req.body.to || !req.body.amount) || (req.body.from.length != constants.addressLength || req.body.to.length != constants.addressLength || req.boby.amount < 0)) {
            res.json({ error: "Invalid Parameters" })
        }
        const options = {
            url: `${constants.blockCipherTestURL}/txs/new?token=${constants.token}`,
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            data: {
                "inputs": [{ "addresses": [req.body.from] }],
                "outputs": [{
                    "addresses": [req.body.to],
                    "value": amount
                }]
            }

        }
        request(options, function (err, resonse, body) {
            let json = JSON.parse(body);
            console.log(json);

        });

    }
}
