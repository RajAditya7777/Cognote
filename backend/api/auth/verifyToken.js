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
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: 'No authorization token provided'
            });
        }

        // Check if it's a Bearer token
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Invalid authorization format. Use: Bearer <token>'
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            return res.status(401).json({
                error: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Attach user data to request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        // Continue to next middleware/route handler
        next();

    } catch (error) {
        console.error('Token verification error:', error);

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
