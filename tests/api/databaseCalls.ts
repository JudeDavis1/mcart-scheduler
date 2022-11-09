// Test the CRUD operations in database calls:

import axios from 'axios';

import { listenAsync } from '../../src/backend/app.js';
import { Session } from '../../src/backend/models/sessionModel.js';


// Async so that we can test the API
listenAsync();

async function testCreate() {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(3);
    date.setDate(29);
    date.setHours(12);

    const req = await axios.post('http://localhost:3001/api/v1/', {
        place: "Hello",
        members: ["JDF", "dfh"],
        time: date.getTime()
    });

    const receivedSession = await Session.findByIdAndDelete(req.data);
}

function testGet() {

}

function testUpdate() {

}

function testDelete() {

}


export {
    testCreate,
    testGet,
    testUpdate,
    testDelete
}
