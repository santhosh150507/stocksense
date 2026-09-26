/**
 * Validate presence of required fields in req.body, req.query, or req.params
 * @param {string[]} requiredFields - List of keys required
 * @param {'body'|'query'|'params'} location - Where to look for fields
 */
const requireFields = (requiredFields, location = 'body') => {
  return (req, res, next) => {
    const target = req[location] || {};
    const missing = [];

    for (const field of requiredFields) {
      if (target[field] === undefined || target[field] === null || target[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required field(s) in ${location}: ${missing.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Validate using a custom function
 * @param {function(req): string|null} validatorFn - Function returning error string or null if valid
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const error = validatorFn(req);
    if (error) {
      return res.status(400).json({ error });
    }
    next();
  };
};

module.exports = {
  requireFields,
  validate
};
