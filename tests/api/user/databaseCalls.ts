import axios from "axios";
import assert from "assert";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
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

    it("validity", () => {
        assert(foundUser);
    });

    // *TEST _ID*
    it("_id", () => {
        assert(actualUser._id == foundUser!._id);
    });

    // *TEST name*
    it("name", () => {
        assert(actualUser.name == foundUser!.name);
    });

    // *TEST email*
    it("email", () => {
        assert(actualUser.email == foundUser!.email);
    });

    // *TEST congregation*
    it("congregation", () => {
        assert(actualUser.congregation == foundUser!.congregation);
    });

    // *TEST userType*
    it("userType", () => {
        assert(actualUser.userType.toString() == foundUser!.userType);
    });
}

async function testGet() {
    const actualUser: IUser = await generateUser(true);
    const req = await axios.get(`http://localhost:${PORT}/api/v1/user/get?userId=` + actualUser._id);
    const foundUser = req.data.user;

    // Cleanup
    await User.deleteOne({ _id: actualUser._id });

    it("validity", () => {
        assert(foundUser);
    });

    // *TEST _id*
    it("_id", () => {
        assert(actualUser._id == foundUser!._id);
    });

    // *TEST name*
    it("name", () => {
        assert(actualUser.name == foundUser!.name);
    });

    // *TEST email*
    it("email", () => {
        assert(actualUser.email == foundUser!.name);
    });

    // *TEST congregation*
    it("congregation", () => {
        assert(actualUser.congregation == foundUser!.congregation);
    });

    // *TEST userType*
    it("userType", () => {
        assert(actualUser.userType.toString() == foundUser!.userType);
    });
}

async function testUpdate() {
    const actualUser: IUser = await generateUser(true);
    // Updates for the created user
    const updates = {
        email: "updated_test@test.com"
    };
    // Update 
    actualUser.email = updates.email;
    const req = await axios.patch(`http://localhost:${PORT}/api/v1/user/update`, {
        userId: actualUser._id,
        updates: updates
    });
    const updatedUser = req.data.user;
    // Free MongoDB space
    await User.deleteOne(actualUser._id);

    // Validity
    it("validity", () => {
        assert(updatedUser);
    });

    // *TEST _id*
    it("_id", () => {
        assert(actualUser._id == updatedUser._id);
    });

    // *TEST name*
    it("name", () => {
        assert(actualUser.name == updatedUser.name);
    });

    // *TEST email*
    it("email", () => {
        assert(actualUser.email == updatedUser.email);
    });

    // *TEST congregation*
    it("congregation", () => {
        assert(actualUser.congregation == updatedUser.congregation);
    });

    // *TEST userType*
    it("userType", () => {
        assert(actualUser.userType.toString() == updatedUser.userType);
    });
}

async function testDelete() {

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

async function generateUser(create: Boolean = false): Promise<any> {
    const userJson = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test name",
        email: "test@test.com",
        congregation: testCongName,
        userType: UserType.user
    }
    if (create) await User.create(userJson);
    
    return userJson;
}


export {
    testUserCRUD
}
