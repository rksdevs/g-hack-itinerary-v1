import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"})

        //set up the token in a http-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', //this needs to be true when in production that is https
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        })
}