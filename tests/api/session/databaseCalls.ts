// Test the CRUD operations in database calls:

import axios from "axios";
import assert from "assert";
import mongoose from "mongoose";
import { randomBytes } from "crypto";

import { listenAsync } from "../../../src/backend/app.js";
import { User, UserType } from "../../../src/backend/models/userModel.js";
import { ISession, Session } from "../../../src/backend/models/sessionModel.js";


const PORT = 65523;
const testCongName =
  "Some congregation for testing: " + randomBytes(20).toString();

// Async so that we can test the API
const server = await listenAsync(PORT);

async function testCreate() {
  const sessionGen = await generateSession();
  const req = await axios.post(
    `http://localhost:${PORT}/api/v1/session/create`,
    sessionGen
  );

  // Update ID in generated session because it is undefined.
  sessionGen._id = req.data.session._id;
  const actualSession: ISession = sessionGen;

  // Retreive required data and cleanup
  const receivedSession = await Session.findByIdAndDelete(actualSession._id);
  await User.deleteMany({ congregation: testCongName });

  it("validity", () => {
    assert(receivedSession);
  });

  // Test session members equals true (all of them)
  const memberResults: Array<Boolean> = actualSession.members.map(
    (val, i) => val.toString() == receivedSession!.members[i].toString()
  );
  assert(memberResults.every((val) => val));

  // *TEST _ID*
  assert(actualSession._id == receivedSession!._id);

  // *TEST PLACE*
  assert(actualSession.place == receivedSession!.place);

  // *TEST TIME*
  assert(parseInt(actualSession.time) == receivedSession!.time.getTime());
}

async function testGet() {
    const actualSession: ITestSession = await generateSession();
    const createdSession = await Session.create(actualSession);
    actualSession._id = createdSession._id;

    const req = await axios.get(
      `http://localhost:${PORT}/api/v1/session/get?sessionId=` +
        actualSession._id
    );
    const receivedSession: ISession = req.data.session;

    // Free up MongoDB storage space
    await User.deleteMany({ congregation: testCongName });
    await Session.deleteOne({ _id: actualSession._id });

    // Test that the received session actually exists
    assert(receivedSession);

    // *TEST _ID*
    assert(actualSession._id == receivedSession._id);
    
    // *TEST MEMBERS*
    const memberResults: Array<Boolean> = actualSession.members.map(
      (val, i) => val.toString() == receivedSession.members[i].toString()
    );
    assert(memberResults.every((val) => val));

    // *TEST TIME*
    assert(parseInt(actualSession.time) == Date.parse(receivedSession.time));

    // *TEST PLACE*
    assert(actualSession.place == receivedSession.place);
}

async function testUpdate() {
  const actualSession: ITestSession = await generateSession();
  const createdSession = await Session.create(actualSession);
  actualSession._id = createdSession._id;

  // Update local session
  const newId = new mongoose.Types.ObjectId();
  const newMember = await User.create({
    _id: newId,
    name: "A new name",
    email: "eeeee@example.com",
    congregation: testCongName,
    userType: UserType.sessionCreator,
  });
  actualSession.members = [newId];

  const req = await axios.patch(
    `http://localhost:${PORT}/api/v1/session/update`,
    {
      sessionId: actualSession._id,
      updates: {
        members: [newId],
      },
    }
  );
  const receivedSession: ISession = req.data.session;

  // MongoDB cleanup
  await User.deleteOne({ _id: newId }); // Delete updated member (Just in case the congregation is different)
  await User.deleteMany({ congregation: testCongName }); // Delete the other users created
  await Session.deleteOne({ _id: actualSession._id });

  // Test that the received session actually exists
  assert(receivedSession);

  // *TEST _ID*
  assert(actualSession._id == receivedSession._id);

  // *TEST MEMBERS*
  assert(newId.toString() == receivedSession.members[0].toString());

  // *TEST TIME*
  // This will be comparing milliseconds since 1970 for both objects.
  // Convert the actualSession time to an integer then parse the received session time which returns milliseconds also.
  assert(parseInt(actualSession.time) == Date.parse(receivedSession.time));

  // *TEST PLACE*
  assert(actualSession.place == receivedSession.place);
}

async function testDelete() {
  const actualSession: ITestSession = await generateSession();
  const createdSession = await Session.create(actualSession);

  // Delete session
  await axios.delete(`http://localhost:${PORT}/api/v1/session/delete?sessionId=` + createdSession._id);

  // MongoDB cleanup
  await User.deleteMany({ congregation: testCongName });
  // The following returns null if the session does not exist
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

// Helper functions

interface ITestSession {
  _id: mongoose.Types.ObjectId;
  members: Array<mongoose.Types.ObjectId>;
  place: String;
  time: string;
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
    congregation: testCongName,
    userType: UserType.user,
  });

  await User.create({
    _id: tmpUserId2,
    name: "Test name2",
    email: "test2@test.com",
    congregation: testCongName,
    userType: UserType.user,
  });

  const session = {
    place: "Some place",
    members: [tmpUserId1, tmpUserId2],
    time: date.getTime(),
  };

  return session;
}

export { testSessionCRUD, server };
