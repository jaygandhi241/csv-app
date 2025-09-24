import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

export function authenticateJWT(req, res, next) {
  const header = req.headers.authorization || '';
  console.log('header', header);
  const token = header.split(' ')[1] || null;
  console.log("token", token);

  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Best-effort user attachment for logging purposes; does not enforce auth
export function attachUserIfPresent(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role };
    } catch (_e) {
      // ignore
    }
  }
  next();
}


