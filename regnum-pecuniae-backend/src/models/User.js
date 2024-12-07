const pool = require('../db');

class User {
    static async findByEmail(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0];
    }

    static async create(email, password, verificationCode) {
        const res = await pool.query(
            'INSERT INTO users (email, password, verification_code) VALUES ($1, $2, $3) RETURNING *',
            [email, password, verificationCode]
        );
        return res.rows[0];
    }

    static async verifyEmail(email) {
        await pool.query('UPDATE users SET verified = true WHERE email = $1', [email]);
    }

    static async updateResetToken(email, resetToken) {
        await pool.query('UPDATE users SET reset_token = $1 WHERE email = $2', [resetToken, email]);
    }
}

module.exports = User;
