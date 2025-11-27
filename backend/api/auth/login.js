const { prisma } = require('../../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Login Endpoint
 * POST /api/auth/login
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Response:
 * {
 *   "user": { "id": "...", "email": "...", "name": "..." },
 *   "token": "jwt-token-here"
 * }
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Return user data (without password) and token
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Something went wrong during login'
        });
    }
}

module.exports = login;
