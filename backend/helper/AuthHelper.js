const jwt = require('jsonwebtoken'); 


const AuthHelper = module.exports; 

AuthHelper.createJWTToken = (payload) => {
    try {
        const token = jwt.sign(
            payload, 
            process.env.SECRET_KEY, 
            {
                issuer: 'ROLERTASKER',
                audience: 'yourAppAudience'
            }
        )
        return token;
    } catch (error) {
       throw error
    }
}
AuthHelper.validateToken = (req, res,  next) =>{
    console.log(req.headers)
    let token = req.headers['x-auth-token']; 
    console.log("token", token)
    if(!token){
        return res.status(403).send("No Auth Token"); 
    }
    try {
       const verifyToken = jwt.verify(token, process.env.SECRET_KEY, {
        issuer: 'ROLERTASKER', // Validate issuer
        audience: 'yourAppAudience' // Validate audience
       }); 
        // Manually check for token expiration
        if (verifyToken.exp * 1000 < Date.now()) {
            return res.status(401).send('Token expired');
        }
       req.user = verifyToken.user; 
       next();
    } catch (error) {
        return res.status(401).send({ message: "Error", error: error.message })
    }
}