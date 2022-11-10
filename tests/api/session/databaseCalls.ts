// Test the CRUD operations in database calls:

import axios from 'axios';
import mongoose from 'mongoose';

import { listenAsync } from '../../../src/backend/app.js';
import { User, UserType } from '../../../src/backend/models/userModel.js';
import { ISession, Session } from '../../../src/backend/models/sessionModel.js';

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
    if (!receivedSession) return false;
    console.log(receivedSession.members.prototype == actualSession.members);
    console.log(receivedSession.members.prototype)

    testResults = [
        actualSession._id == receivedSession._id,
        actualSession.members == receivedSession.members.prototype
    ];


    return true;
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
