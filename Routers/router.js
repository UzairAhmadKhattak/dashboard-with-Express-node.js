// importing moddules
const express = require('express')
const controller_imported = require('../Controller/controller')
const csurf = require('csurf')
const csrf_protection = csurf()

router = express.Router()

router.use(csrf_protection)
// get Home
router.get('/',controller_imported.EnsureAuthintication,controller_imported.home)
     

// get Registration
router.get('/signup',controller_imported.get_signup)


//get login 
router.get('/login',controller_imported.EnsureNotAuthintication,controller_imported.get_login)


//get logout
router.get('/logout',controller_imported.get_logout)



//submission of registration page
router.post('/signup',controller_imported.post_signup)

//submission of login page
router.post('/login',controller_imported.post_login)

module.exports = router