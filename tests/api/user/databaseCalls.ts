import axios from "axios";
import { randomBytes } from "crypto";
import { listenAsync } from "../../../src/backend/app.js";

import { User, UserType } from "../../../src/backend/models/userModel.js";


const PORT = 4444;
const testCongName = "Some congregation for testing: " + randomBytes(10).toString();

// TODO:
// - Ensure that the listening connection is closed before listening again.
// - Or make the API listen in the testHelper instead of individual tests.

listenAsync(PORT);

async function testCreate() {
    const actualUser = generateUser();
    const req = axios.get(`http://localhost:`)
}

async function testGet() {

}

async function testUpdate() {

}

async function testDelete() {

}

async function testUserCRUD() {
    describe("User CRUD operations", () => {
        it("Test createUser", testCreate);
        it("Test getUser", testGet);
        it("Test updateUser", testUpdate);
        it("Test deleteUser", testDelete);
    });
}

async function generateUser() {
    return await User.create({
        name: "Test name",
        email: "test@test.com",
        congregation: testCongName,
        userType: UserType.user
    });
}


export {
    testUserCRUD
}
