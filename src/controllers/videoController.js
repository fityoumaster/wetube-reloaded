let videos = [
    {
        title: "First Video",
        rating: 5,
        comment: 2,
        createdAt: "2 minute ago",
        views: 59,
        id: 1
    },
    {
        title: "Second Video",
        rating: 5,
        comment: 2,
        createdAt: "2 minute ago",
        views: 59,
        id: 2
    },
    {
        title: "Third Video",
        rating: 5,
        comment: 2,
        createdAt: "2 minute ago",
        views: 59,
        id: 3
    }
];
export const trending = (req, res) => {
    return res.render("home", { pageTitle: "Home", videos });
}
export const watch = (req, res) => {
    //const id = req.params.id;
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => {
    return res.send(req.params);
}