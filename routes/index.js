const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/main', (req, res)=>{
    console.log('main router')
    res.sendFile(path.join(__dirname, '..', 'react-project', 'build', 'index.html'))
    // console.log('session : ', req.session.user)
})

module.exports = router;