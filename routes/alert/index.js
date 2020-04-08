const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const myConfig = require('dotenv').config();
var multer = require('multer')
// define multer storage configuration     
const storage = require('../../logics/file');
const upload = multer({ storage: storage });
const datetime = require('node-datetime');
const dt = datetime.create();
const formatted = dt.format('Y-m-d H:M:S');
// pool
router.post('/publish', passport.authenticate('jwt', { session: false }), upload.array('documents', 50), async (req, res, next) => {
    console.log('in alert/publish');

    // console.log('req,bosy is ', req.headers);
    if (!req.body) {
        res.json({ msg: "Please fill out complete form" });
    }
    if (!req.headers) {
        res.json({ msg: "Please fill out token in headers" });
    }
    const token = req.headers.authorization;
    console.log(process.env.IMS + '/user/profile');

    var header = {
        headers: {
            Authorization: token
        }
    };
    let info = await axios.get(process.env.IMS + '/user/profile', header);
    const userIms = info.data;
    console.log('is authorized :yes', userIms);
    if (!userIms) {
        return res.json({ 'msg': "unauthoried!! Please check token." });
    }
    
    // Get Docs IDs from DMS of all Documents
    if(!req.files){
        return res.json({ 'msg': "Please upload documents" });
    }
    const files = req.files;
    console.log(files);
    var dmsFileOBj ={};
    dmsFileOBj.files = files;
    console.log(dmsFileOBj);
    let info3 = await axios.post(process.env.DMS + '/api/document/upload/getId', dmsFileOBj);
    var DocumentsIDs = info3.data
    console.log('Documents ids from DMS ', DocumentsIDs);

    if (!req.body.industry) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out industry field.',
            },
        });
    }
    if (!req.body.territory) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out territory field.',
            },
        });
    }
    if (!req.body.authority) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out authority field.',
            },
        });
    }

    if (!req.body.RegulationId) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out RegulationId field.',
            },
        });
    }
    if (!req.body.regulationDocType) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out regulationDocType field.',
            },
        });
    }
    if (!req.body.dateOfDeadline) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out dateOfDeadline field.',
            },
        });
    }
    if (!req.body.dateOfPublication) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out dateOfPublication field.',
            },
        });
    }

    if (!req.body.keywords) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out keywords field.',
            },
        });
    }
    if (!req.body.summary) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out Summary field.',
            },
        });
    }
    if (!req.body.clients) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out clients field.',
            },
        });
    }
    if (!req.body.source) {
        return res.status(200).json({
            errors: {
                message: 'Please fill out source field.',
            },
        });
    }
    
    var DocumentsIDs =[ 17 ]; // Recieved from DMS
    const industry = req.body.industry;
    const territory = req.body.territory;
    var RegulationId = req.body.RegulationId;
    const regulationDocType = req.body.regulationDocType;
    const dateOfDeadline = req.body.dateOfDeadline;
    const dateOfPublication = req.body.dateOfPublication;
    const keywords = req.body.keywords;
    const summary = req.body.summary;
    const clients = req.body.clients;
    const source = req.body.source;
    var documentId = DocumentsIDs;
    const authority = req.body.authority;
    // Check Regulation Title Exist or Not
    let info1 = await axios.get(process.env.RMS + '/api/reg/fetch/' + RegulationId);
    var checkRegID = info1.data
    if (checkRegID.length == 0) {
        console.log('create new regulation ', checkRegID);
        var regObj = {
            "title": RegulationId,
            "status": regulationDocType
        }
        let info2 = await axios.post(process.env.RMS + '/api/reg/create/getId', regObj);
        RegulationId = info2.data;
        console.log('new id ', RegulationId);
    }
    // Insert Regulation and Documents data in RegulationDoc Table (RMS)
    var regDocBodyObj = {};
    regDocBodyObj.reg_id = RegulationId;
    regDocBodyObj.dms_doc_id=documentId;    

    let info5 = await axios.post(process.env.RMS + '/api/regdoc/create/getId',regDocBodyObj);
    const autoIdRegDoc = info5.data;
    console.log('Stored in RegDoc Table',autoIdRegDoc);
    // Store Data into AMS (Alert and Authority )
    var alertCreateObj ={};
    industry,territory,RegulationId,regulationDocType,dateOfDeadline,dateOfPublication,keywords,summary,clients,source,documentId
    alertCreateObj.industry = industry;
    alertCreateObj.territory = territory;
    alertCreateObj.RegulationId = RegulationId;
    alertCreateObj.regulationDocType = regulationDocType;
    alertCreateObj.dateOfDeadline = dateOfDeadline;
    alertCreateObj.dateOfPublication = dateOfPublication;
    alertCreateObj.keywords = keywords;
    alertCreateObj.summary = summary;
    alertCreateObj.clients = clients;
    alertCreateObj.source = source;
    alertCreateObj.documentId = documentId;
    alertCreateObj.authority = authority;
    let info4 = await axios.post(process.env.AMS + '/alert/create',alertCreateObj);
    const alertCreated = info4.data;
    console.log('AMS alert created ',alertCreated);
    let resposnseObj = {};
    resposnseObj.message ='Alert Publish Successfully!!'
      resposnseObj.AMS = alertCreated;

    res.json(resposnseObj);
}); 

module.exports = router; 


// old
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
