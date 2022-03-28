import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl : String,
    socialOnly : { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    location: String,
    videos: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Video"
    }]
});

/* 비밀번호 단방향 해시처리 미들웨어 입니다. */
userSchema.pre('save', async function(){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = new mongoose.model("User", userSchema);
export default User;