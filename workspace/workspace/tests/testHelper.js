import { listenAsync } from "../src/backend/app.js";
import { server, testSessionCRUD } from "./api/session/databaseCalls.js";
import { testUserCRUD } from "./api/user/databaseCalls.js";
var testType = process.argv[2];
var testFinished = false;
if (!testType) {
    console.error("[-] No test specified.");
    process.exit(-1);
}
testType = testType.toLowerCase();
console.log("[*] Initializing test cases for session...");
listenAsync();
describe("Running tests:", async () => {
    await testSessionCRUD();
    await testUserCRUD();
});
testFinished = true;
setInterval(async () => {
    if (testFinished) {
        server.close();
        process.exit();
    }
}, 4000);
