// Test different aspects of the application
// Usage: testHelps.ts {testType}
// For example, to test the API, run:
// `testHelps.ts api`

import {
    testSessionCRUD
} from './api/session/databaseCalls.js';

// Test type. So far only supporting API test
// In this case, run `testHelper.ts api`
var testType = process.argv[2];

if (!testType) {
    console.error('[-] No test specified.');
    process.exit(-1);
}

testType = testType.toLowerCase()


if (testType == 'api') {
    console.log('[*] Initializing test cases for session...')
    if (testSessionCRUD()) {
        console.log("Passed Test for")
    }
}
