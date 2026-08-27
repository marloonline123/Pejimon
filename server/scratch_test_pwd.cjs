const crypto = require('crypto');

const hashString = "b4a9a7a67cb8867a5bfcfcf2fb3df54f:32f5eb33cf85289fb3698de2b781e6c3821a8d56b46ef32943b006969cfb8ee9e5572886f784e27fcaaa9655fba18ef1fa1953258c70757a3d3c8c7f9ea8d25f";
const [salt, key] = hashString.split(':');

const passwords = ["password", "password123", "admin", "12345678", "test", "john-doe"];

passwords.forEach(pwd => {
    // try different scrypt parameters if default doesn't work. Better Auth default is usually scrypt.
    crypto.scrypt(pwd, Buffer.from(salt, 'hex'), 64, (err, derivedKey) => {
        if (err) throw err;
        if (derivedKey.toString('hex') === key) {
            console.log(`Match found! Password is: ${pwd}`);
        }
    });
});
