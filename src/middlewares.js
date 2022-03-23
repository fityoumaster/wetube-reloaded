import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {}; 
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/");
    }
};

// https://github.com/expressjs/multer/blob/master/doc/README-ko.md
export const uploadFiles = multer({dest: "uploads/"});