// Test the CRUD operations in database calls:

import axios from 'axios';
import mongoose from 'mongoose';

import { listenAsync } from '../../../src/backend/app.js';
import { User, UserType } from '../../../src/backend/models/userModel.js';
import { ISession, Session } from '../../../src/backend/models/sessionModel.js';
import { ObjectId } from 'mongodb';
import { clear } from 'console';
import assert from 'assert';

// Async so that we can test the API
listenAsync();

async function testCreate(): Promise<Boolean> {
    var testResults: Array<Boolean> = [];

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

    const req = await axios.post('http://localhost:3001/api/v1/session/create', {
        place: "Some place",
        members: [
            tmpUserId1,
            tmpUserId2
        ],
        time: date.getTime()
    });
    const actualSession: ISession = req.data.session;
    const receivedSession = await Session.findByIdAndDelete(req.data.session._id);
    
    await User.deleteMany({congregation: "Some Congregation"});
    if (!receivedSession) return false;


    // Sort members so that they can 
    const actualMembers = actualSession.members.map((val) => val.toString());
    const receivedMembers = receivedSession.members.map((val) => val.toString());

    receivedSession.members;

    // Assert that both member lengths are equal
    
    // *TEST MEMBERS*
    if (actualSession.members.length != receivedSession.members.length) testResults.push(false);
    actualSession.members.forEach((item, i) => {
        testResults.push(actualMembers[i] == receivedMembers[i]);
        console.log(item.toString(), receivedSession.members[i].toString())
    });

    // *TEST _ID*
    testResults.push(actualSession._id == receivedSession._id);
    
    // *TEST PLACE*
    testResults.push(actualSession.place == receivedSession.place);

    // *TEST TIME*
    testResults.push(actualSession.time == receivedSession.time);

    return testResults.every((val) => val);
}

function testGet() {

}

function testUpdate() {

}

function testDelete() {

}

function testSessionCRUD() {
    testCreate();
    testGet();
    testUpdate();
    testDelete();
}

export {
    testSessionCRUD
}
