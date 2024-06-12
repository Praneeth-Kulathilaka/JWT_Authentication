const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({message:'No token provided'})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err,decoded)=>{
        if (err) {
            return res.status(500).json({message:'Failed to authorize token'})
        }
        req.user = decoded;
        next();
    });
}

function checkRole(roles){
    return (req,res,next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({message:'Access Denied'})
        }
        next();
    }
}
module.exports = { verifyToken, checkRole }