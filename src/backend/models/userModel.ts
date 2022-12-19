import mongoose, { Schema } from "mongoose";
import { Session } from "./sessionModel";


enum UserType {
  congAdmin,
  publisher,
}

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: String;
  email: String;
  hashedPassword: String;
  userType: UserType;
  congregation: String;
  sessions: Array<typeof Session>;
}

// User blueprint
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
  userType: {
    type: String,
    enum: UserType,
    required: true
  },
  sessions: {
    type: Array<typeof Session>,
    required: false,
    default: []
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});


// Model which will be used to create new docs
const User = mongoose.model("User", userSchema);

export {
  User,
  IUser,
  UserType,
};

// more info -> https://mongoosejs.com/docs/guide.html
