import User from "../models/User.js";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "join";
    if(password !== password2){
        return res.status(400).render("join", { 
            pageTitle,
            errorMessage: "Password confirmation dose not match.",
        });
    }
    /* $or : 둘 중 하나라도 있다면 true를 반환합니다. */
    const exists = await User.exists({ $or: [{username}, {email}] });
    if(exists){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    try{
        await User.create({
            name, 
            email, 
            username, 
            password, 
            location
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", { 
            pageTitle,
            errorMessage: error._message
         });
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle : "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";

    // 입력한 계정정보가 있는지 확인합니다.
    const user = await User.findOne({ username, socialOnly: false });
    if(!user){
        return res
            .status(400)
            .render("login", {
                pageTitle, 
                errorMessage: "An account with this username dose not exists."
            });
    }

    // 비밀번호를 체크합니다.
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res
            .status(400)
            .render("login", {
                pageTitle, 
                errorMessage: "Wrong password."
            });
    }
    // 유저 로그인 정보를 세션에 저장합니다.
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENTID,
        allow_signup: false,

        // Github 요청 시 scope는 반드시 공백으로 구분하여 요청합니다.
        scope: "read:user user:email"
    }

    // URLSearchParams: key/value 를 url querystring 으로 변환해주는 내장 함수입니다.
    const params = new URLSearchParams(config).toString();
    const redirectUrl = `${baseUrl}?${params}`;
    return res.redirect(redirectUrl);
};

export const finishGithubLogin = async (req, res) => {

    // 1. github user 정보를 알기위해 callback 으로 전달받은 code 값으로 access_token 값을 요청합니다.
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENTID,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const fetchUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(
        await fetch(fetchUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();

    // 2. 전달받은 access_token 값으로 user정보를 요청합니다.
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";

        // 2-1. user 정보 전체를 요청합니다.
        const githubUserData = await(
            await fetch(`${apiUrl}/user`,{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        
        // 2-1. user email 정보 전체를 요청합니다.
        const githubEmailData = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();

        console.log(githubUserData);
        console.log(githubEmailData);
        
        // 2-2. primary / verified ture인 email 객체를 찾습니다.
        const emailObj = githubEmailData.find(
            (email) => email.primary === true && email.verified === true
        );
        
        if(!emailObj){
            return res.redirect("/login");
        }
        
        let user = await User.findOne({ email : emailObj.email });
        if(!user){
            // 실제 github 계정 설정에 name, email 등 입력이 안되어있는 경우가 있을 수 있습니다.
            user = await User.create({
                name: githubUserData.name,
                avatarUrl: githubUserData.avatar_url,
                username: githubUserData.login,
                email: githubUserData.email,
                password: "",
                socialOnly: true,
                location: githubUserData.location
            });
        }
        // github 계정으로 로그인 할 경우 이미 가입된 이메일일경우 바로 로그인을 수행합니다.
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const { session: { user: { _id, avatarUrl } }, body: { name, email, username, location }, file } = req;
    const originEmail = req.session.user.email;
    const originUsername = req.session.user.username;
    if(originEmail !== email || originUsername !== username){
        const exists = await User.exists({ $or: [{email}, {username}] });
        if(exists){
            return res.status(400).render("users/edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This email/username is already taken.",
            });
        }
    }
    
    // findByIdAndUpdate {new:true} arg는 업데이트 된 값을 리턴해주는 mongoose 자체 옵션 arg 입니다.
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location
    }, {new: true});
    req.session.user = updateUser;
    
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true){
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
    const { session: { user: { _id, password } }, body : { oldPassword, newPassword, newPasswordConfirmed } } = req;
    const comparePassword = await bcrypt.compare(oldPassword, password);
    if(!comparePassword){
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The current password is incorrect." });
    }
    if(newPassword !== newPasswordConfirmed){
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The password dose not match the confirmation." });
    }

    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    
    // 세션도 반드시 업데이트를 해줍니다.
    req.session.user.password = user.password;
    return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("see user");