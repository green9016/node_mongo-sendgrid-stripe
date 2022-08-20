const sendgrid = require('../../../utils/sendgrid')
const kickbox = require('../../../utils/kickbox')
const jwt = require('jsonwebtoken')
const User = require('../../../models/user')


/*
    POST /api/auth/register
    {
        email,
        password
    }
*/
exports.register = (req, res) => {
    const { email, password } = req.body

    // verify email
    kickbox.checkValid(email).then( 
        data => {
            if (data.result != 'deliverable') {
                res.status(409).json({message: 'Email address is invalid'});
                return;
            }

            let newUser = null
            // create a new user if does not exist
            const create = (user) => {
                if(user) {
                    throw new Error('duplicated email address. already exists a user with this email.')
                } else {
                    return User.create(email, password)
                }
            }
        
            // send email
            const sendEmail = (user) => {
                newUser = user
                return sendgrid.send(newUser.email, 'Welcome', 'Welcome to register', '<p>Welcome to register</p>')
            }
        
            // respond to the client
            const respond = (mailret) => {
                res.json({
                    message: 'registered successfully',
                    user: newUser,
                    mailret
                })
            }
        
            // run when there is an error (username exists)
            const onError = (error) => {
                res.status(409).json({
                    message: error.message
                })
            }
        
            // check username duplication
            User.findOneByEmail(email)
            .then(create)
            .then(sendEmail)
            .then(respond)
            .catch(onError)
        }
    ).catch( 
        err => {
            res.status(409).json({
                message: err.message
            })
        }
    )
}

/*
    POST /api/auth/login
    {
        email,
        password
    }
*/

exports.login = (req, res) => {
    const {email, password} = req.body
    const secret = req.app.get('jwt-secret')

    // check the user info & generate the jwt
    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('login failed')
        } else {
            // user exists, check the password
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            email: user.email
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'dragon106.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p
            } else {
                throw new Error('login failed')
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    User.findOneByEmail(email)
    .then(check)
    .then(respond)
    .catch(onError)

}

/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}
