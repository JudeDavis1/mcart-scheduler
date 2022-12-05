import mongoose, { Schema } from "mongoose";
const sessionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    members: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});
const Session = mongoose.model("Session", sessionSchema);
export { Session };
