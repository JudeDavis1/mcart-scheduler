// Controller for Session
import Session from "../models/sessionModel.js";
async function getSession(req, res, next) {
    // Write code here
}
async function createSession(req, res, next) {
    const { place, members, time } = JSON.parse(String(req.params));
    // Validate session attributes
    const sessionInvalid = !place || !members || !time;
    const timeInvalid = !time.year || !time.month || !time.day || !time.hour || !time.minute;
    if (sessionInvalid || timeInvalid) {
        res.status(400).send({ error: "Invalid request!" });
        return;
    }
    // Date object for session
    // MongoDB will save this date
    const dateTime = new Date();
    dateTime.setFullYear(time.year);
    dateTime.setMonth(time.month);
    dateTime.setDate(time.day);
    dateTime.setMinutes(time.minute);
    Session.create({
        place,
        members,
        time
    }).catch(() => {
        res.status(400).send({ error: "Couldn't create session!" });
        return;
    }).then(() => {
        res.status(200).send({ data: "Created session" });
        next();
    });
}
async function editSession(req, res, next) {
    // Write code here
}
export { getSession, createSession, editSession };
