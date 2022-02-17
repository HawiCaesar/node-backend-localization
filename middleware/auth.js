import jwt from 'jsonwebtoken'

const config = process.env;

export const auth = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(200).send({ loggedIn: false });
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(403).send({
        statusCode: 403,
        errorMessage: req.t("token.required")
      });
    }
    return next();
  };