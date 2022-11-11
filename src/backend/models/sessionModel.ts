// A trolly session at a PLACE, with MEMBERS, at a certain TIME

import mongoose, { Schema } from "mongoose";


interface ISession {
    _id: mongoose.Types.ObjectId;
    place: String;
    members: [mongoose.Types.ObjectId] | [String];
    time: Date;
}

const sessionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    members: {
        // Array of Users because multiple mCart users will be present in a Cart Session
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

export {
    Session,
    ISession
};
