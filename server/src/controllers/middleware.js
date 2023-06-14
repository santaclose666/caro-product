const jwt = require('jsonwebtoken')

const middleware = {
    verifyToken: (req, res, next) =>{
        const token = req.headers.token
        if(token){
            const accessToken = token.split(' ')[1]
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user)=>{
                if(err){
                    return res.status(403).json('invalid token')
                }
                req.user = user
                next()
            })
        }
        else{
            return res.status(401).json('unauthenticate')
        }
    },

    verifyTokenAndUser: (req, res, next)=>{
        middleware.verifyToken(req, res, ()=>{
            if(req.user.id === req.params.id || req.user.admin){
                next()
            }else{
                return res.status(402).json('U cant do that!')
            }
        })
    },

}

module.exports = middleware