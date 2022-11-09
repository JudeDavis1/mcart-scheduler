// Test the CRUD operations in database calls:

import app from '../../src/backend/app.js';


function testCreate() {
    (async function() {
        app.listen(4444, () => {
            console.log("[*] Test server initialized.");
        })
    }());
    console.log('Hello');
}

function testGet() {

}

function testUpdate() {

}

function testDelete() {

}


export {
    testCreate,
    testGet,
    testUpdate,
    testDelete
}
