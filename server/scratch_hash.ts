import auth from './src/config/auth.js';

async function generate() {
    // Better Auth handles password hashing internally for credentials provider
    // The easiest way to get a valid hash is to create a dummy user
    try {
        const hash = await auth.api.signUpEmail({
            body: {
                email: 'dummy@test.com',
                password: 'password123',
                name: 'Dummy'
            }
        });
        console.log(hash);
    } catch (e) {
        console.error(e);
    }
}
generate();
