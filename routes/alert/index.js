const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const myConfig = require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    console.log('in alert/publish', myConfig.DMS);
    // IMS 2sec,    
    // AMS 2sec, 
    // RMS 4sec
    // Promise Parallel
    // Await 
    console.log('req,bosy is ', req.headers);
    if (!req.body) {
        res.json({ msg: "Please fill out complete form" });
    }
    if (!req.headers) {
        res.json({ msg: "Please fill out token in headers" });
    }
    const token = req.headers.authorization;
    console.log(process.env.IMS + '/user/profile');
    // var header = {
    //     headers :{
    //        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfZG9jIjp7Il9pZCI6IjVlODhiMzMyOGJmYmQxMzdmNGY3ZjI5YiIsInVzZXJuYW1lIjoiamF0aW4zNDVhbmFuZEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRCV3UucXBXSzBpWi5wZ2duT1dkNG5lYmlGTHFGdmhCWXFnVllnWHVtVjgwS24xZWVxOUxXLiIsImZpcnN0bmFtZSI6ImdmZ2ciLCJsYXN0bmFtZSI6ImZkZ2RnIiwicGhvbmUiOiIwOTgyMTk2MDcyNiIsImV4IjoiZGZnIiwibG9jYXRpb24iOiJ1cyIsInJvbGUiOiJmZmciLCJjb21wYW55IjoiZmZnZmRmZmYiLCJpbmR1c3RyeSI6Im5vbi1pdCIsIl9fdiI6MX0sImV4cGlyZXNJbiI6NjA0ODAwLCJpYXQiOjE1ODYyNjE3MTV9.sAT2QNOhpf9597Hi0_aPlELE3YTNOjYFxCyj2lPbrAU"
    //     }
    // };
    var header = {
        headers: {
            Authorization: token
        }
    };

    let info = await axios.get(process.env.DMS + '/api/document/list');
    console.log(info.data);
    let info2 = await axios.get(process.env.IMS + '/user/profile', header);
    console.log(info2.data);
    let info3 = await axios.get(process.env.AMS + '/alert/get');
    console.log(info3.data);
    let resposnseObj = {};
    resposnseObj.DMS = info.data;
    resposnseObj.IMS = info2.data;
    resposnseObj.AMS = info3.data;
    res.json(resposnseObj);
});
router.post('/publish/async', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log('in alert/publish', myConfig.DMS);
    // IMS 2sec,    
    // AMS 2sec, 
    // RMS 4sec
    // Promise Parallel
    // Await 
    console.log('req,bosy is ', req.headers);
    if (!req.body) {
        res.json({ msg: "Please fill out complete form" });
    }
    if (!req.headers) {
        res.json({ msg: "Please fill out token in headers" });
    }
    const token = req.headers.authorization;
    console.log(process.env.IMS + '/user/profile');
    // var header = {
    //     headers :{
    //        Authorization: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfZG9jIjp7Il9pZCI6IjVlODhiMzMyOGJmYmQxMzdmNGY3ZjI5YiIsInVzZXJuYW1lIjoiamF0aW4zNDVhbmFuZEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQxMCRCV3UucXBXSzBpWi5wZ2duT1dkNG5lYmlGTHFGdmhCWXFnVllnWHVtVjgwS24xZWVxOUxXLiIsImZpcnN0bmFtZSI6ImdmZ2ciLCJsYXN0bmFtZSI6ImZkZ2RnIiwicGhvbmUiOiIwOTgyMTk2MDcyNiIsImV4IjoiZGZnIiwibG9jYXRpb24iOiJ1cyIsInJvbGUiOiJmZmciLCJjb21wYW55IjoiZmZnZmRmZmYiLCJpbmR1c3RyeSI6Im5vbi1pdCIsIl9fdiI6MX0sImV4cGlyZXNJbiI6NjA0ODAwLCJpYXQiOjE1ODYyNjE3MTV9.sAT2QNOhpf9597Hi0_aPlELE3YTNOjYFxCyj2lPbrAU"
    //     }
    // };
    var header = {
        headers: {
            Authorization: token
        }
    };
    //     function handleFulfilledA(data) {
    //      console.log('data is ',data);
    //     }
    //     function handleRejectedA(error) {
    //   console.log('error is ',error);
    //     }
    //     const myPromise =
    //         (new Promise(axios.get(process.env.DMS + '/api/document/list')))
    //             .then(handleFulfilledA, handleRejectedA);
    // var promise = new Promise(function(resolve, reject) { 
    //     const x = "geeksforgeeks"; 
    //     const y = "geeksforgeeks"
    //     axios.get(process.env.DMS + '/api/document-/list')
    //     if(x === y) { 
    //       resolve(); 
    //     } else { 
    //       reject(); 
    //     } 
    //   }); 

    //   promise. 
    //       then(function () { 
    //           console.log('Success, You are a GEEK'); 
    //       }). 
    //       catch(function () { 
    //           console.log('Some error has occured'); 
    //       });
    let info, info2, info3;
    axios.get(process.env.AMS + '/alert/get')
    .then((response) => {
        // handle success
        info3 = response.data;
        let resposnseObj = {};
        resposnseObj.DMS = info;
        resposnseObj.IMS = info2;
        resposnseObj.AMS = info3;
        console.log('done ',resposnseObj);
        res.json(resposnseObj);
    })
    .catch((error) => {
        // handle error
        console.log('in error ', error);
    })
    .then(() => {
        // always executed
        console.log('response is ', info);
    });
    // axios.get(process.env.DMS + '/api/document/list')
    //     .then((response) => {
    //         // handle success
    //         info = response.data;
    //         axios.get(process.env.IMS + '/user/profile', header)
    //             .then((response) => {
    //                 // handle success
    //                 info2 = response.data;
    //                 axios.get(process.env.AMS + '/alert/get')
    //                     .then((response) => {
    //                         // handle success
    //                         info3 = response.data;
    //                         let resposnseObj = {};
    //                         resposnseObj.DMS = info;
    //                         resposnseObj.IMS = info2;
    //                         resposnseObj.AMS = info3;
    //                         // res.json(resposnseObj);
    //                     })
    //                     .catch((error) => {
    //                         // handle error
    //                         console.log('in error ', error);
    //                     })
    //                     .then(() => {
    //                         // always executed
    //                         console.log('response is ', info);
    //                     });
    //             })
    //             .catch((error) => {
    //                 // handle error
    //                 console.log('in error ', error);
    //             })
    //             .then(() => {
    //                 // always executed
    //                 console.log('response is ', info);
    //             });
    //         // console.log('in res ',response);
    //     })
    //     .catch((error) => {
    //         // handle error
    //         console.log('in error ', error);
    //     })
    //     .then(() => {
    //         // always executed
    //         console.log('response is ', info);
    //     });

    // console.log('outside ',info);
    // let info2 =axios.get(process.env.IMS+'/user/profile',header);
    // console.log(info2.data);
    // let info3 =axios.get(process.env.AMS+'/alert/get');
    // console.log(info3.data);
    let resposnseObj = {};
    // resposnseObj.DMS = info.data;
    // resposnseObj.IMS= info2.data;
    // resposnseObj.AMS= info3.data;
    // res.json(resposnseObj);
});

module.exports = router; 
