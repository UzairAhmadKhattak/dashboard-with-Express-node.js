// importing modules
const passport = require('passport')
const  {User_ORM}   = require('../model/models')
const bcrypt = require('bcrypt')
const {check,validationResult} = require('express-validator')
// var { randomBytes } = require('crypto')
const LocalStrategy = require('passport-local').Strategy


// EnsureAuthintication
const EnsureAuthintication = (request,response,next)=>{
    if (request.isAuthenticated()){
        next()
    }
    else{
    request.flash('ensureauthintication_error','Please login first')
    response.redirect('/login')  
    }
}


// EnsureNotAuthintication
const EnsureNotAuthintication = (request,response,next)=>{
    if (request.isAuthenticated() === false){
        next()
    }
    else{
    response.redirect('/')  
}
}


// geting home page
const home = (request,response)=>{
    
    email = request.user

    User_ORM.findAll({where:{email:email}})
        .then((data_of_db)=>{console.log('db_data is present')
        data_of_db = data_of_db[0].dataValues
        response.render('home.ejs',{db_data:data_of_db})})
        
        .catch((error)=>{ if(error){
            console.log(error)
            console.log('Error in query')
        }    
        })
    }
 

//get signup page
const get_signup = (request,response)=>{

    response.render('signup.ejs',{ token : request.csrfToken()})
}

//get login page
const get_login = (request,response)=>{
    response.render('login.ejs',{ token : request.csrfToken()})
}

//get logout page
const get_logout = (request,response)=>{
    request.logout()
    response.redirect('/login')
}

//post signup page
const post_signup = (request,response)=>{
    
    [
        check("password1","Please Enter valid Password")
        .exists()
        .isLength({min:8})
    
    ]

    const errors = validationResult(request)
    
    if(! errors.isEmpty()  ){
        const alert = errors.array()
        response.render('signup.ejs',{errors:alert})
    }

    else{
        if (request.method === 'POST'){
            form_data = request.body
            user_name = form_data.user_name
            password1 = form_data.password1
            password2 = form_data.password2
            email = form_data.email
           

            if (password1 === password2){
                
                
                // Password hashing
                bcrypt.genSalt(10,function(eoror,salt){
                    bcrypt.hash(password1,salt,function(error,hash){
                        password1 = hash
                    
                        // db inserting
                        User_ORM.create({
                            user_name:user_name,
                            email:email,
                            password:password1
                        })
                        .then(function(value) {response.render('signup',{registered:'User Registered', token : request.csrfToken()})})
                        .catch((error)=>{
                            console.log('error is catched is posting route')
                            response.render('signup',{email_error:'User Name Or Email already exist or lenght of any field is greater then 20', token : request.csrfToken()})}
                                )
        
                            })

                        }) 
                        
                    }
        
            else{
                response.render('signup.ejs',{password_error:'Password Not Matched', token : request.csrfToken()})
                }
        
        }   
        
        else{
            console.log('Error in request.post section')
            }
    }
}


//post login page
const post_login = (request,response,next)=>{

        passport.authenticate('local',{

            successRedirect:'/',
            failureRedirect:'/login',
            failureFlash:true

        })
        (request,response,next)

}

// localstrategy function
const local_strategy = ()=>{
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        
            // Match user 
            User_ORM.findAll({where:{email:email}})
                .then((user)=>{
                  
                    if (user){
                        user = user[0].dataValues
                        console.log('email is present')
                    // Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) throw err
                                
                            if (isMatch) {
                                return done(null, user)
                            } 
                            else {
                                return done(null, false, { message: 'Password incorrect' })
                                }
        
                             })
                            passport.serializeUser(function(user, done) {
                                done(null, user.id)
                            })
                            
                            passport.deserializeUser(function(id, done) {
                                done(null,user.email) 
                                
                            });    
                        }
                })
                .catch((error)=>{
                
                    if(error){
                        console.log(error)
                        return done(null, false, { message: 'Email is not registered Please register first' })
                    }
                    
                  
    
                })
     
            }))
} 

module.exports = {

    EnsureAuthintication,
    EnsureNotAuthintication,
    home,
    get_signup,
    get_login,
    get_logout,
    post_signup,
    post_login,
    local_strategy

}

