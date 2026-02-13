const assert = require('assert');
const { validateContact } = require('../lib/validate');

console.log('Running contact validation tests...');

// Valid cases
assert.strictEqual(validateContact({ name: 'A', email: 'a@b.com', message: 'hi' }), true, 'email + name + message should be valid');
assert.strictEqual(validateContact({ name: 'B', phone: '+923334106520', message: 'hi' }), true, 'phone + name + message should be valid');
assert.strictEqual(validateContact({ name: 'C', email: 'test@domain.co', phone: '03334106520', message: 'order' }), true, 'both contact methods present should be valid');

// Invalid cases
assert.strictEqual(validateContact({ email: 'a@b.com', message: 'no name' }), false, 'missing name should be invalid');
assert.strictEqual(validateContact({ name: 'X', message: '' }), false, 'empty message should be invalid');
assert.strictEqual(validateContact({ name: 'Y', email: '', phone: '' , message: 'hi'}), false, 'missing both email and phone should be invalid');
assert.strictEqual(validateContact({ name: 'Z', email: 'bad-email', message: 'hi' }), false, 'invalid email format should be invalid');
assert.strictEqual(validateContact({ name: 'P', phone: 'abc123', message: 'hi' }), false, 'invalid phone format should be invalid');

console.log('All tests passed.');