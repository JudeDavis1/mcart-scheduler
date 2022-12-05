import { Session } from "../models/sessionModel.js";
async function createSession(req, res, next) {
    try {
        console.log('ehl;lodifhsds');
        const { place, members, time } = req.body;
        const sessionInvalid = !place || !members || !time;
        if (sessionInvalid)
            throw new Error("Invalid session");
        const timeObj = new Date();
        timeObj.setTime(parseInt(time));
        const createdSession = await Session.create({
            place: place,
            members: members,
            time: timeObj
        });
        res
            .status(200)
            .json({ data: "Created session.", session: createdSession });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Couldn't create session. Try checking your data." });
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
        await Session.deleteOne({ _id: sessionId });
        res
            .status(200)
            .json({ data: "Successfully delete session" });
    }
    catch (error) {
        res
            .status(400)
            .json({ error: "Couldn't delete session" });
        next(error);
    }
}
export { createSession, getSession, updateSession, deleteSession, };
