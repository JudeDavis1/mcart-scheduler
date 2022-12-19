import mongoose, { Schema } from "mongoose";
var UserType;
(function (UserType) {
    UserType[UserType["congAdmin"] = 0] = "congAdmin";
    UserType[UserType["publisher"] = 1] = "publisher";
})(UserType || (UserType = {}));
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
        type: (Array),
        required: false
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
const User = mongoose.model("User", userSchema);
export { User, UserType, };
