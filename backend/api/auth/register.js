const { prisma } = require('../../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Registration Endpoint
 * POST /api/auth/register
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "name": "John Doe" (optional)
 * }
 * 
 * Response:
 * {
 *   "user": { "id": "...", "email": "...", "name": "..." },
 *   "token": "jwt-token-here"
 * }
 */
async function register(req, res) {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null
            }
        });

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
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Something went wrong during registration'
        });
    }
}

module.exports = register;
