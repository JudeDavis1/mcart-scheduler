// A trolly session at a PLACE, with MEMBERS, at a certain TIME

import mongoose, { Schema } from "mongoose";


interface ISession {
    place: String,
    members: Array<Schema.Types.ObjectId>,
    time: Date
}

const sessionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    members: {
        // Array of Users because multiple mCart users will be present in a Cart Session
        type: Array<Schema.Types.ObjectId>,
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
