const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) =>{
    const authToken = req.header('auth-token');
    if(!authToken)
        res.status(401).send({error:"Please authenticate using a valid token"});
    
    try {
        const data = jwt.verify(authToken, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"});
    }
}

module.exports = fetchuser;