import User from "../models/User.js";

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
    await User.create({
        name, 
        username, 
        email, 
        password, 
        location
    });
    return res.redirect("/login");
};
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("remove");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see user");