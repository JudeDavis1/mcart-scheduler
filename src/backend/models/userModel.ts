import mongoose, { Schema } from "mongoose";


enum UserType {
  congAdmin,
  publisher,
}

interface IUser {
  name: String;
  email: String;
  userType: UserType;
  congregation: String;
  _id: mongoose.Types.ObjectId;
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
  hashedPassword: {
    type: String,
    enum: UserType,
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
