import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags : [{ type: String }],
    meta: {
        views: { type: Number, required: true, default: 0 },
        rating: { type: Number, required: true, default: 0 }
    }
});

/* 해쉬태그 '#'처리 미들웨어 입니다. */
/* videoSchema.pre('save', async function(){
    this.hashtags = this.hashtags[0].split(",").map(word => word.stratsWith("#") ? word : `#${word}`);
}); */

/* 해쉬태그 '#'처리 static 함수 입니다. */
videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map( word => word.startsWith("#") ? word : `#${word}`);
});

const Video = new mongoose.model("Video", videoSchema);
export default Video;