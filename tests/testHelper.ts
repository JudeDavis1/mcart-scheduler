// Test different aspects of the application
// Usage: testHelps.ts {testType}
// For example, to test the API, run:
// `npm run test-backend api`

import { listenAsync } from "../src/backend/app.js";
import { server, testSessionCRUD } from "./api/session/databaseCalls.js";

// Test type. So far only supporting API test
// In this case, run `testHelper.ts api`
var testType = process.argv[2];
var testFinished: boolean = false;

if (!testType) {
  console.error("[-] No test specified.");
  process.exit(-1);
}

testType = testType.toLowerCase();

console.log("[*] Initializing test cases for session...");

listenAsync();
describe("Running tests:", async () => {
  await testSessionCRUD();
  testFinished = true;
});

// Check if the testing process is finished.
setInterval(async () => {
    if (testFinished)
    {
      server.close();
      process.exit();
    }
}, 2000);
