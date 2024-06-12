const mysql = require('mysql2/promise');
const dbConfig = require('./config/db.config');
const bcrypt = require('bcrypt');
const getuserByID = require('./database');
const jwt = require('jsonwebtoken');

async function userLogin (req,res) {
    try {
        const db = await mysql.createConnection(dbConfig);
        
        const {email, password} = req.body;

        console.log(email,password);

        const user = await getuserByID(email);

        if (user == null) {
            return res.status(201).json({message:'User does not exists'});
        } 

        const checkValidPassword = bcrypt.compareSync(password,user.password);
        if (checkValidPassword) {
            user.password = undefined;
            const accessToken = generateToken(user);
            res.cookie('token', accessToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 60*60*1000
            })

            const refreshToken = generateRefreshToken(user);
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 24*60*60*1000
            })
            console.log(refreshToken);
            return res.status(200).json({ token: accessToken, refreshToken: refreshToken });

        }
        
    } catch (error) {
        console.log("Failed operation",error);
        return res.status(201).json({message: 'Process Failed'})
    }
    
}

async function refresh(req,res){
    try {
        console.log('Cookies:', req.cookies);
        const refreshToken = req.cookies.refresh_token;
        console.log(refreshToken);
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(406).json({ message: 'Unauthorized' });
            } else {
                // Fetch user details from database based on the user ID in the token
                const user = getuserByID(decoded.user);
                const accessToken = jwt.sign({ 
                    user: decoded.user,
                    role: user.userRole // Include user role in the access token payload
                }, process.env.SECRET_KEY, { expiresIn: '30m' });

                // Set access token as a cookie in the response
                res.cookie('token', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 60 * 1000 });
                return res.status(200).json({ token: accessToken });
            }
        });
    
    } catch (error) {
        console.log("Failed operation",error);
        return res.status(201).json({message: 'Process Failed'})
    }

    
}

async function logout(req,res){
    try {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log("Failed operation",error);
        return res.status(201).json({message: 'Process Failed'})
    }
}

const generateToken = (user) => {
    return jwt.sign({
        id: user.email,
        role: user.role
    },process.env.SECRET_KEY, {
        expiresIn: '1h'
    })
}

const generateRefreshToken = (user) => {
    
    const refreshToken = jwt.sign({
        id: user.email
    },process.env.REFRESH_KEY, {
        expiresIn: '1d'
    })
    
    return refreshToken;
}
module.exports = { userLogin, refresh, logout };