// Test the CRUD operations in database calls:

import axios from 'axios';
import mongoose from 'mongoose';
import { stdout } from 'process';

import { listenAsync } from '../../../src/backend/app.js';
import { User, UserType } from '../../../src/backend/models/userModel.js';
import { ISession, Session } from '../../../src/backend/models/sessionModel.js';


// Async so that we can test the API
listenAsync();

async function testCreate(): Promise<Boolean> {
    var testResults: Array<Boolean> = [];

    const req = await axios.post('http://localhost:3001/api/v1/session/create', await generateSession());
    const actualSession: ISession = req.data.session;
    const receivedSession = await Session.findByIdAndDelete(req.data.session._id);
    
    await User.deleteMany({congregation: "Some Congregation"});
    if (!receivedSession) return false;

    // Sort members so that they can 
    const actualMembers = actualSession.members.map((val) => val.toString());
    const receivedMembers = receivedSession.members.map((val) => val.toString());

    // Assert that both member lengths are equal
    
    // *TEST MEMBERS*
    if (actualSession.members.length != receivedSession.members.length) testResults.push(false);
    actualSession.members.forEach((item, i) => {
        testResults.push(actualMembers[i] == receivedMembers[i]);
    });

    var result = true;

    // *TEST _ID*
    result = actualSession._id == receivedSession._id;
    testResults.push(result);
    logResult('[*] Testing _id...        ', result);
    
    // *TEST PLACE*
    
    result = actualSession.place == receivedSession.place;
    testResults.push(result);
    logResult('[*] Testing _id...        ', result);

    // *TEST TIME*
    result = Date.parse(actualSession.time) == receivedSession.time.getTime();
    testResults.push(result);
    logResult('[*] Testing _id...        ', result);

    // Return whether or not all items are TRUE in testResults
    return testResults.every((val) => val);
}

function testGet() {
    const session = generateSession();
}

function testUpdate() {

}

function testDelete() {

}

async function testSessionCRUD() {
    if (await testCreate()) console.log("[*] Passed Test for Session CRUD");
    else console.log("[-] Test failed for Session CRUD");
    testGet();
    testUpdate();
    testDelete();
}


// Helper functions

function logResult(text: String, result: Boolean): void {
    stdout.write('[*] Testing place...      ');
    if (result) console.log("PASSED!");
    else console.log("FAILED!");
}

async function generateSession(): Promise<Object> {
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


export {
    testSessionCRUD
}
