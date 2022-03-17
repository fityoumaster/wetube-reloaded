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
    const user = await User.findOne({ username });
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

    // 1. github user 정보를 알기위해 전달받은 code값으로 access_token 값을 요청하여 리턴받습니다.
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENTID,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const fetchUrl = `${baseUrl}?${params}`;
    const tokenFetch = await(
        await fetch(fetchUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();

    // 2. 전달받은 access_token 값으로 user 정보 api를 요청하여 파라미터를 리턴 받습니다.
    if("access_token" in tokenFetch){
        const { access_token } = tokenFetch;
        const userRequest = await(
            await fetch("https://api.github.com/user",{
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        console.log(userRequest);
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("remove");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see user");