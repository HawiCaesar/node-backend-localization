import jwt from 'jsonwebtoken'

const config = process.env;

export const auth = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send(req.t("token.required"));
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send(req.t("token.invalid"));
    }
    return next();
  };