const jwt = require('jsonwebtoken');

/**
 * JWT Token Verification Middleware
 * 
 * Usage: Add this middleware to any route that requires authentication
 * Example: app.get('/api/protected', verifyToken, (req, res) => { ... })
 * 
 * The middleware expects the token in the Authorization header:
 * Authorization: Bearer <token>
 * 
 * If valid, it attaches the decoded user data to req.user
 * If invalid, it returns a 401 Unauthorized response
 */
function verifyToken(req, res, next) {
    try {
        console.log('[verifyToken] Starting token verification...');

        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        console.log('[verifyToken] Authorization header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader) {
            console.log('[verifyToken] FAILED: No authorization header');
            return res.status(401).json({
                error: 'No authorization token provided'
            });
        }

        // Check if it's a Bearer token
        if (!authHeader.startsWith('Bearer ')) {
            console.log('[verifyToken] FAILED: Invalid format, header:', authHeader.substring(0, 20));
            return res.status(401).json({
                error: 'Invalid authorization format. Use: Bearer <token>'
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('[verifyToken] Token extracted, length:', token.length);

        if (!token) {
            console.log('[verifyToken] FAILED: Empty token after extraction');
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        // Verify token
        console.log('[verifyToken] Verifying token with JWT_SECRET...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('[verifyToken] Token verified successfully for user:', decoded.email);

        // Attach user data to request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        // Continue to next middleware/route handler
        next();

    } catch (error) {
        console.error('[verifyToken] FAILED: Token verification error:', error.name, error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token has expired'
            });
        }

        return res.status(500).json({
            error: 'Failed to authenticate token'
        });
    }
}

module.exports = verifyToken;
