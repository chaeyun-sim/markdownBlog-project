const { User } = require("../models/user")

const auth = (req, res, next) => {
    if (req.session.logined) {
        req.user = req.session;
        next();
    } else {
        return res.jsond({
            isAuth: false,
            authSuccess: false,
        })
    }
};

module.exports = { auth }