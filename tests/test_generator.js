
const assert = require('assert');
const generator = require('../backend/src/utils/generator');

console.log('Testing Generator...');

// Test generateCode
const code = generator.generateCode();
assert.ok(code.length > 0, 'Code should not be empty');
assert.ok(code.includes('@'), 'Code should contain @');
assert.ok(code.includes('#'), 'Code should contain #');
console.log('generateCode passed:', code);

// Test generatePassword
const password = generator.generatePassword(10);
assert.strictEqual(password.length, 10, 'Password length should match');
console.log('generatePassword passed:', password);

console.log('Generator tests passed!');
