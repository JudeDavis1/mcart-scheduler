import { Session } from "../models/sessionModel.js";
import { User } from "../models/userModel.js";
async function hasExistingTime(sessionTime) {
    const sessionsWithTime = await Session.find({ time: sessionTime });
    return Boolean(sessionsWithTime.length);
}
async function createSession(req, res, next) {
    try {
        const { place, members, time } = req.body;
        if (await hasExistingTime(parseInt(time)))
            throw new Error("An appointment at this time already exists!");
        const sessionInvalid = !place || !members || !time;
        if (sessionInvalid)
            throw new Error("Please fill out all fields");
        const getId = async (name) => {
            const user = await User.findOne({ name });
            return user?._id ? user?._id : null;
        };
        let hasNull = false;
        let userIds = [];
        for (let name of members) {
            const id = await getId(name);
            if (id)
                userIds.push(id);
            else
                hasNull = true;
        }
        if (hasNull)
            throw new Error("One or more publishers don't exist");
        if (userIds.length < 2)
            throw new Error("Must be 2 or more members");
        const timeObj = new Date();
        timeObj.setTime(parseInt(time));
        const createdSession = await Session.create({
            place: place,
            members: userIds,
            time: timeObj
        });
        Session.findOne({ _id: createdSession._id })
            .populate("members")
            .exec((err, session) => {
            if (err)
                console.log(err.message);
            session?.members.forEach(async (member) => {
                await User.findOneAndUpdate({ _id: member._id }, { $push: { sessions: session._id } });
            });
        });
        res
            .status(200)
            .json({ data: "Created session.", session: createdSession });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Couldn't create session. " + error.message });
        next(error);
    }
}
async function getSession(req, res, next) {
    try {
        const { sessionId } = req.query;
        if (!sessionId)
            throw new Error("Invalid ID");
        const session = await Session.findById(sessionId);
        if (!session)
            throw new Error("Data doesn't exist!");
        res
            .status(200)
            .json({ data: "Found session!", session: session.toJSON() });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Error receiving data: " + error.message });
        next(error);
    }
}
async function updateSession(req, res, next) {
    try {
        const { sessionId, updates } = req.body;
        if (!updates)
            throw new Error("Invalid updates");
        await Session.updateOne({ _id: sessionId }, updates);
        const updatedSession = await Session.findById(sessionId);
        res
            .status(200)
            .json({ data: "Successfully updated session", session: updatedSession });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Couldn't edit session: " + error.message });
        next(error);
    }
}
async function deleteSession(req, res, next) {
    try {
        const { sessionId } = req.query;
        if (!sessionId)
            throw new Error("Invalid ID");
        const session = await Session.findById(sessionId).populate("members");
        if (!session)
            throw new Error("Session doesn't exist");
        session.members.forEach(async (user) => {
            const userSessions = user.sessions.filter((val) => val.toString() != session._id.toString());
            await User.findByIdAndUpdate(user._id, { sessions: userSessions });
        });
        await Session.findByIdAndDelete(sessionId);
        res
            .status(200)
            .json({ data: "Successfully deleted session" });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Couldn't delete session: " + error.message });
        next(error);
    }
}
export { createSession, getSession, updateSession, deleteSession, };
