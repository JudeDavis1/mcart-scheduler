// Test different aspects of the application
// Usage: testHelps.ts {testType}
// For example, to test the API, run:
// `testHelps.ts api`

import {
    testCreate,
    testGet,
    testUpdate,
    testDelete
} from './api/databaseCalls.js';

// Test type. So far only supporting API test
// In this case, run `testHelper.ts api`
var testType = process.argv[2];

if (!testType) {
    console.error('[-] No test specified.');
    process.exit(-1);
}

testType = testType.toLowerCase()


if (testType == 'api') {
    testCreate();
    testGet();
    testUpdate();
    testDelete();
}
