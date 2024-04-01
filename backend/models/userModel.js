import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    currency: {
        type: String
    },
    isAdmin : {
        type: Boolean,
        default: false,
        required: true,
    }
}, {timestamps: true})

//method to check password
userSchema.methods.matchPasswords = async function (userEnteredPassword)  {
    return await bcrypt.compare(userEnteredPassword, this.password)
}

//method to hash password before saving the document
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

export default User;