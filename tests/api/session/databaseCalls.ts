// Test the CRUD operations in database calls:

import axios from 'axios';
import mongoose from 'mongoose';
import { stdout } from 'process';

import { listenAsync } from '../../../src/backend/app.js';
import { User, UserType } from '../../../src/backend/models/userModel.js';
import { ISession, Session } from '../../../src/backend/models/sessionModel.js';
import assert from 'assert';


const PORT = 4444;

// Async so that we can test the API
listenAsync(PORT);

async function testCreate(): Promise<Boolean> {
    var testResults: Array<Boolean> = [];

    const req = await axios.post(`http://localhost:${PORT}/api/v1/session/create`, await generateSession());
    const actualSession: ISession = req.data.session;
    const receivedSession = await Session.findByIdAndDelete(req.data.session._id);

    if (!receivedSession) {
        logResult("validity", false);
        return false;
    }

    // Sort members so that they can
    const actualMembers = actualSession.members.map((val) => val.toString());
    const receivedMembers = receivedSession.members.map((val) => val.toString());

    // Assert that both member lengths are equal

    // *TEST MEMBERS*
    if (actualSession.members.length != receivedSession.members.length) testResults.push(false);
    actualSession.members.forEach((item, i) => {
        testResults.push(actualMembers[i] == receivedMembers[i]);
        assert.equal(actualMembers[i], receivedMembers[i]);
    });
    if (testResults.every((val) => val)) logResult("members", true);

    var result: Boolean;

    // *TEST _ID*
    result = actualSession._id == receivedSession._id;
    testResults.push(result);
    assert(result);
    // logResult("_id", result);

    // *TEST PLACE*

    result = actualSession.place == receivedSession.place;
    testResults.push(result);
    assert(result);
    // logResult("place", result);

    // *TEST TIME*
    result = Date.parse(actualSession.time) == receivedSession.time.getTime();
    testResults.push(result);
    // logResult("time", result);
    assert(result);

    // Return whether or not all items are TRUE in testResults
    return testResults.every((val) => val);
}

async function testGet(): Promise<Boolean> {
    var testResults = [];

    const actualSession: ITestSession = await generateSession();
    const createdSession = await Session.create(actualSession);
    actualSession._id = createdSession._id;

    const req = await axios.get("http://localhost:3001/api/v1/session/get?sessionId=" + actualSession._id);
    const receivedSession: ISession = req.data.session;

    // Free up MongoDB storage space
    await User.deleteMany({ congregation: "Some Congregation" });
    await Session.deleteOne({ _id: actualSession._id });

    if (!receivedSession) {
        logResult("validity", false);
        return false;
    }
    logResult("validity", true);

    var result: Boolean;

    // *TEST _ID*
    result = actualSession._id == receivedSession._id;
    assert(result);
    testResults.push(result);
    logResult("_id", result);

    // *TEST MEMBERS*
    actualSession.members.forEach((val, i, arr) => {
        testResults.push(val.toString() == receivedSession.members[i].toString());
        assert(val.toString() == receivedSession.members[i].toString());
    });

    // *TEST TIME*
    result = parseInt(actualSession.time) == Date.parse(receivedSession.time);
    testResults.push(result);
    assert(result);
    // logResult("time", result);

    // *TEST PLACE*
    result = actualSession.place == receivedSession.place;
    testResults.push(result);
    assert(result);
    // logResult("place", result);

    return true;
}

function testUpdate() {

}

function testDelete() {

}

async function testSessionCRUD() {
    // passedTests("createSession", await testCreate());
    // passedTests("getSession", await testGet());

    describe("API", function() {
        describe("#SessionCRUD", function() {
            it("Test createSession", testCreate);
            it("Test getSession", testGet);
        });
    });

    testUpdate();
    testDelete();
}


// Helper functions

interface ITestSession {
    _id: mongoose.Types.ObjectId;
    members: Array<mongoose.Types.ObjectId>;
    place: String;
    time: string;
}

function logResult(text: String, result: Boolean): void {
    stdout.write(`[*] Testing ${text}...      `);
    if (result) console.log("PASSED!");
    else console.log("FAILED!");
}

async function generateSession(): Promise<any> {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(3);
    date.setDate(29);
    date.setHours(12);

    // Create 2 IDs and user objects. Save the ID so that we can delete it later.
    const tmpUserId1 = new mongoose.Types.ObjectId();
    const tmpUserId2 = new mongoose.Types.ObjectId();

    await User.create({
        _id: tmpUserId1,
        name: "Test name",
        email: "test@test.com",
        congregation: "Some Congregation",
        userType: UserType.user
    });

    await User.create({
        _id: tmpUserId2,
        name: "Test name2",
        email: "test2@test.com",
        congregation: "Some Congregation",
        userType: UserType.user
    });

    const session = {
        place: "Some place",
        members: [
            tmpUserId1,
            tmpUserId2
        ],
        time: date.getTime()
    };

    return session;
}

function passedTests(subject: String, didPass: Boolean) {
    if (didPass)
        console.log(`\n** Passed tests for \`${subject}\` **\n`);
    else
        console.log(`\n** Test failed for \`${subject}\` **\n`);
}


export {
    testSessionCRUD
}
