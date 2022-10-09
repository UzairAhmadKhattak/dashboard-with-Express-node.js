//importing modules
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const db = require('./model/models')
const router_imported = require('./Routers/router')

const app = express()

app.set('view engine','ejs')

app.use(express.static('static'))

app.use(express.urlencoded({extended:true}))

// express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 , sameSite:'lax'}
    })
  )

//passport middleware
app.use(passport.initialize())
app.use(passport.session())


// express session middleware
app.use(flash())


// global variable for flash msgs
app.use((request,response,next)=>{
    response.locals.ensureauthintication_error = request.flash('ensureauthintication_error')
    response.locals.email_password_error = request.flash('error')
    next()
})

// middelware for routes
app.use(router_imported)

//importing for localstrategy

require('./Controller/controller').local_strategy()

const PORT = process.env.PORT || 5000
db.sequelize.sync().then((require)=>{
app.listen(PORT,function(){console.log(`listening at ${PORT}....`) })
})