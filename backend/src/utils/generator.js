
const crypto = require('crypto');

class Generator {
    static generateCode() {
        const numbers = '0123456789';
        const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const smalls = 'abcdefghijklmnopqrstuvwxyz';

        const rand = (str) => str[Math.floor(Math.random() * str.length)];

        let code = '';
        code += rand(numbers) + rand(numbers);
        code += rand(capitals);
        code += rand(smalls);
        code += rand(capitals);
        code += rand(smalls);
        code += '@';
        code += rand(numbers) + rand(numbers);
        code += rand(capitals);
        code += rand(smalls);
        code += rand(capitals);
        code += rand(smalls);
        code += rand(numbers) + rand(numbers);
        code += '#';

        return code;
    }

    static generatePassword(length = 12) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        return password;
    }
}

module.exports = Generator;
