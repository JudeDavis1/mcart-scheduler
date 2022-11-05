import mongoose, { Schema } from "mongoose";


// User blueprint
const userSchema: Schema = new Schema({
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

// Model which will be used to create new docs
const User = mongoose.model("User", userSchema);

export default User;

// more info -> https://mongoosejs.com/docs/guide.html
