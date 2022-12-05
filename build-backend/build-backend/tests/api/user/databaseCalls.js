import axios from "axios";
import assert from "assert";
import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { listenAsync } from "../../../src/backend/app.js";
import { User, UserType } from "../../../src/backend/models/userModel.js";
const PORT = 4444;
const testCongName = "Some congregation for testing: " + randomBytes(10).toString();
listenAsync(PORT);
async function testCreate() {
    const userGen = await generateUser();
    const req = await axios.post(`http://localhost:${PORT}/api/v1/user/create`, userGen);
    const foundUser = await User.findByIdAndDelete(req.data.user._id);
    const actualUser = userGen;
    assert(foundUser);
    assert(actualUser.name == foundUser.name);
    assert(actualUser.email == foundUser.email);
    assert(actualUser.congregation == foundUser.congregation);
    assert(actualUser.userType.toString() == foundUser.userType);
}
async function testGet() {
    const actualUser = await generateUser(true);
    const req = await axios.get(`http://localhost:${PORT}/api/v1/user/get?userId=` + actualUser._id);
    const foundUser = req.data.user;
    await User.deleteOne({ _id: actualUser._id });
    assert(foundUser);
    assert(actualUser._id == foundUser._id);
    assert(actualUser.name == foundUser.name);
    assert(actualUser.email == foundUser.email);
    assert(actualUser.congregation == foundUser.congregation);
    assert(actualUser.userType.toString() == foundUser.userType);
}
async function testUpdate() {
    const actualUser = await generateUser(true);
    const updates = {
        email: "updated_test@test.com"
    };
    actualUser.email = updates.email;
    const req = await axios.patch(`http://localhost:${PORT}/api/v1/user/update`, {
        userId: actualUser._id,
        updates: updates
    });
    const updatedUser = req.data.user;
    await User.deleteOne(actualUser._id);
    assert(updatedUser);
    assert(actualUser._id == updatedUser._id);
    assert(actualUser.name == updatedUser.name);
    assert(actualUser.email == updatedUser.email);
    assert(actualUser.congregation == updatedUser.congregation);
    assert(actualUser.userType.toString() == updatedUser.userType);
}
async function testDelete() {
    const createdUser = await generateUser(true);
    await axios.delete(`http://localhost:${PORT}/api/v1/user/delete?userId=` + createdUser._id);
    const userExists = await User.exists({ _id: createdUser._id });
    assert(!userExists);
}
async function testUserCRUD() {
    describe("User CRUD operations", () => {
        it("Test createUser", testCreate);
        it("Test getUser", testGet);
        it("Test updateUser", testUpdate);
        it("Test deleteUser", testDelete);
    });
}
async function generateUser(dbCreate = false) {
    const userJson = {
        _id: new mongoose.Types.ObjectId(),
        name: "Test name",
        email: "test@test.com",
        congregation: testCongName,
        userType: UserType.publisher
    };
    if (dbCreate)
        await User.create(userJson);
    return userJson;
}
export { testUserCRUD };
