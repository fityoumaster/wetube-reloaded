import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String
});

/* 비밀번호 단방향 해시처리 미들웨어 입니다. */
userSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 5);
});

const User = new mongoose.model("User", userSchema);
export default User;