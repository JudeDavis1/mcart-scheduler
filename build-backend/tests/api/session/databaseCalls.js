import axios from "axios";
import assert from "assert";
import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { listenAsync } from "../../../src/backend/app.js";
import { User, UserType } from "../../../src/backend/models/userModel.js";
import { Session } from "../../../src/backend/models/sessionModel.js";
const PORT = 65523;
const testCongName = "Some congregation for testing: " + randomBytes(20).toString();
const server = await listenAsync(PORT);
async function testCreate() {
    const sessionGen = await generateSession();
    const req = await axios.post(`http://localhost:${PORT}/api/v1/session/create`, sessionGen);
    sessionGen._id = req.data.session._id;
    const actualSession = sessionGen;
    const receivedSession = await Session.findByIdAndDelete(actualSession._id);
    await User.deleteMany({ congregation: testCongName });
    it("validity", () => {
        assert(receivedSession);
    });
    const memberResults = actualSession.members.map((val, i) => val.toString() == receivedSession.members[i].toString());
    assert(memberResults.every((val) => val));
    assert(actualSession._id == receivedSession._id);
    assert(actualSession.place == receivedSession.place);
    assert(parseInt(actualSession.time) == receivedSession.time.getTime());
}
async function testGet() {
    const actualSession = await generateSession();
    const createdSession = await Session.create(actualSession);
    actualSession._id = createdSession._id;
    const req = await axios.get(`http://localhost:${PORT}/api/v1/session/get?sessionId=` +
        actualSession._id);
    const receivedSession = req.data.session;
    await User.deleteMany({ congregation: testCongName });
    await Session.deleteOne({ _id: actualSession._id });
    assert(receivedSession);
    assert(actualSession._id == receivedSession._id);
    const memberResults = actualSession.members.map((val, i) => val.toString() == receivedSession.members[i].toString());
    assert(memberResults.every((val) => val));
    assert(parseInt(actualSession.time) == Date.parse(receivedSession.time));
    assert(actualSession.place == receivedSession.place);
}
async function testUpdate() {
    const actualSession = await generateSession();
    const createdSession = await Session.create(actualSession);
    actualSession._id = createdSession._id;
    const newId = new mongoose.Types.ObjectId();
    const newMember = await User.create({
        _id: newId,
        name: "A new name",
        email: "eeeee@example.com",
        congregation: testCongName,
        userType: UserType.publisher,
    });
    actualSession.members = [newId];
    const req = await axios.patch(`http://localhost:${PORT}/api/v1/session/update`, {
        sessionId: actualSession._id,
        updates: {
            members: [newId],
        },
    });
    const receivedSession = req.data.session;
    await User.deleteOne({ _id: newId });
    await User.deleteMany({ congregation: testCongName });
    await Session.deleteOne({ _id: actualSession._id });
    assert(receivedSession);
    assert(actualSession._id == receivedSession._id);
    assert(newId.toString() == receivedSession.members[0].toString());
    assert(parseInt(actualSession.time) == Date.parse(receivedSession.time));
    assert(actualSession.place == receivedSession.place);
}
async function testDelete() {
    const actualSession = await generateSession();
    const createdSession = await Session.create(actualSession);
    await axios.delete(`http://localhost:${PORT}/api/v1/session/delete?sessionId=` + createdSession._id);
    await User.deleteMany({ congregation: testCongName });
    const sessionExists = await Session.exists({ _id: createdSession._id });
    assert(!sessionExists);
}
async function testSessionCRUD() {
    describe("Session CRUD operations", function () {
        it("Test createSession", testCreate);
        it("Test getSession", testGet);
        it("Test updateSession", testUpdate);
        it("Test deleteSession", testDelete);
    });
}
async function generateSession() {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(3);
    date.setDate(29);
    date.setHours(12);
    const tmpUserId1 = new mongoose.Types.ObjectId();
    const tmpUserId2 = new mongoose.Types.ObjectId();
    await User.create({
        _id: tmpUserId1,
        name: "Test name",
        email: "test@test.com",
        congregation: testCongName,
        userType: UserType.publisher,
    });
    await User.create({
        _id: tmpUserId2,
        name: "Test name2",
        email: "test2@test.com",
        congregation: testCongName,
        userType: UserType.publisher,
    });
    const session = {
        place: "Some place",
        members: [tmpUserId1, tmpUserId2],
        time: date.getTime(),
    };
    return session;
}
export { testSessionCRUD, server };
