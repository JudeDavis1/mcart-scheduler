import axios from "axios";
import assert from "assert";
import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { listenAsync } from "../../../src/backend/app.js";

import { IUser, User, UserType } from "../../../src/backend/models/userModel.js";


const PORT = 4444;
const testCongName = "Some congregation for testing: " + randomBytes(10).toString();

listenAsync(PORT);

async function testCreate() {
    const userGen = await generateUser();
    const req = await axios.post(`http://localhost:${PORT}/api/v1/user/create`, userGen);
    const foundUser = await User.findByIdAndDelete(req.data.user._id);
    const actualUser: IUser = userGen;

    assert(foundUser);

    // No ID test needed for this one.

    // *TEST name*
    assert(actualUser.name == foundUser!.name);

    // *TEST email*
    assert(actualUser.email == foundUser!.email);

    // *TEST congregation*
    assert(actualUser.congregation == foundUser!.congregation);

    // *TEST userType*
    assert(actualUser.userType.toString() == foundUser!.userType);
}

async function testGet() {
    const actualUser: IUser = await generateUser(true);
    const req = await axios.get(`http://localhost:${PORT}/api/v1/user/get?userId=` + actualUser._id);
    const foundUser = req.data.user;

    // Cleanup
    await User.deleteOne({ _id: actualUser._id });

    assert(foundUser);

    // *TEST _id*
    assert(actualUser._id == foundUser!._id);

    // *TEST name*
    assert(actualUser.name == foundUser!.name);

    // *TEST email*
    assert(actualUser.email == foundUser!.email);

    // *TEST congregation*
    assert(actualUser.congregation == foundUser!.congregation);

    // *TEST userType*
    assert(actualUser.userType.toString() == foundUser!.userType);
}

async function testUpdate() {
    const actualUser: IUser = await generateUser(true);
    // Updates for the created user
    const updates = {
        email: "updated_test@test.com"
    };
    // Update email
    actualUser.email = updates.email;
    const req = await axios.patch(`http://localhost:${PORT}/api/v1/user/update`, {
        userId: actualUser._id,
        updates: updates
    });
    const updatedUser = req.data.user;
    // Free MongoDB space
    await User.deleteOne(actualUser._id);

    // Validity
    assert(updatedUser);

    // *TEST _id*
    assert(actualUser._id == updatedUser._id);

    // *TEST name*
    assert(actualUser.name == updatedUser.name);
    
    // *TEST email*
    assert(actualUser.email == updatedUser.email);

    // *TEST congregation*
    assert(actualUser.congregation == updatedUser.congregation);
    
    // *TEST userType*
    assert(actualUser.userType.toString() == updatedUser.userType);
}

async function testDelete() {
    const createdUser: IUser = await generateUser(true);
    await axios.delete(`http://localhost:${PORT}/api/v1/user/delete?userId=` + createdUser._id);

    const userExists = await User.exists({ _id: createdUser._id });

    assert(!userExists);
}

// Main testing function
async function testUserCRUD() {
    describe("User CRUD operations", () => {
        it("Test createUser", testCreate);
        it("Test getUser", testGet);
        it("Test updateUser", testUpdate);
        it("Test deleteUser", testDelete);
    });
}

async function generateUser(dbCreate: Boolean = false): Promise<any> {
    const userJson = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test name",
        email: "test@test.com",
        congregation: testCongName,
        userType: UserType.publisher
    }
    if (dbCreate) await User.create(userJson);
    
    return userJson;
}


export {
    testUserCRUD
}
