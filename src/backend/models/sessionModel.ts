// A trolly session at a PLACE, with MEMBERS, at a certain TIME

import User from "./userModel";
import mongoose, { Schema } from "mongoose";


const sessionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    members: {
        // Array of Users because multiple mCart users will be present in a Cart Session
        type: Array<typeof User>,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
