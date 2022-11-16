import mongoose, { Schema } from "mongoose";

interface IUser {
  name: String;
  email: String;
  congregation: String;
  _id: mongoose.Types.ObjectId;
}


enum UserType {
  congAdmin,
  sessionCreator,
  user,
}

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
  userType: {
    type: String,
    enum: UserType,
  },
});


// Model which will be used to create new docs
const User = mongoose.model("User", userSchema);

export {
  User,
  IUser,
  UserType,
};

// more info -> https://mongoosejs.com/docs/guide.html
