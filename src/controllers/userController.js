import User from "../models/User.js";
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
            username, 
            email, 
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
    return res.redirect("/");
};
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("remove");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see user");