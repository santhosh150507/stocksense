/**
 * Middleware to restrict access based on user roles
 * @param {string|string[]} roles - Allowed role(s) ('inventory_manager', 'warehouse_staff')
 */
const roleMiddleware = (...roles) => {
  const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: User role '${req.user.role}' lacks permission for this action.`
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
