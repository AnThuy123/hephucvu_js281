const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
// Random code Token 
exports.generateAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        // , { expiresIn: '1h' } || 3650d
        jwt.sign(user, process.env.TOKEN_SECRET, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })
    })
}
// Check code Token
exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if (error) {
                reject(error)
            } else {
                resolve(decoded)
            }
        })
    })
}
