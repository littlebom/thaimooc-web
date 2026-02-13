const bcrypt = require('bcryptjs');

async function hash() {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
}

hash();
