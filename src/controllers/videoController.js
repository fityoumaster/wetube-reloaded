import Video from "../models/Video.js"
import User from "../models/User.js"

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
}

export const watch = async (req, res) => {
    const { id } = req.params;

    // populate("owner") Video 모델에 ref: "User" 모델을 참조하겠다고 선언했기 때문에 관계 객체를 형성합니다.
    const video = await Video.findById(id).populate("owner");
    if(!video){
        return res.status(404).render("error/404", { pageTitle: "Video not found." });    
    }
    return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
    const { user: { _id } } = req.session;
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("error/404", { pageTitle: "Video not found." });    
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
    const { user: { _id } } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id});
    if(!video){
        return res.status(404).render("error/404", { pageTitle: "Video not found." });    
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags), 
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("videos/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const { user: { _id } } = req.session;
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    try{
        const newVideo = await Video.create({
            title,
            description,
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });

        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();

        return res.redirect("/");
    } catch(error){
        return res.status(400).render("videos/upload", { 
            pageTitle: "Upload Video",
            errorMessage: error._message
         });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("error/404", { pageTitle: "Video not found." });    
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
   await Video.findByIdAndDelete(id);
   return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        });
    }
    return res.render("search", { pageTitle : "Search", videos });
};