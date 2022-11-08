// Test different aspects of the application
// Usage: testHelps.ts {testType}
// For example, to test the API, run:
// `testHelps.ts api`


// Test type. So far only supporting API test
// In this case, run `testHelper.ts api`
const testType = process.argv[2];

if (!testType) {
    console.error('[-] No test specified.');
    process.exit(-1);
}
