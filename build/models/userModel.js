// importing necessary modules from mongoose
import { Schema, Model } from "mongoose";
// creating the Schema (blueprint)
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    congregation: {
        type: String,
        required: true,
    },
});
// model which will be used to create new docs
const User = new Model("User", userSchema);
export default User;
// more info -> https://mongoosejs.com/docs/guide.html
