import { ApiError } from '../lib/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw ApiError.badRequest('Validation failed', errors);
  }

  // Replace with parsed (stripped unknown fields)
  // NOTE: req.query and req.params are read-only getters on IncomingMessage
  // in newer Node.js / Express versions — use Object.assign to mutate in-place.
  if (result.data.body != null) {
    req.body = result.data.body;
  }
  if (result.data.params != null) {
    Object.assign(req.params, result.data.params);
  }
  if (result.data.query != null) {
    Object.assign(req.query, result.data.query);
  }

  next();
};
