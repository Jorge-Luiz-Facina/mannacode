const jwt = require('jsonwebtoken');

export const authenticateSocket = (token, secret) => {
  return jwt.verify(token, secret, function(err, decoded) {
   
    if (err) {
      return false;
    }
    return decoded.sub;
  });
};

export const authenticatePlayer = (token, secret) => {
  return jwt.verify(token, secret, function(err, decoded) {
   
    if (err) {
      return false;
    }
    return decoded.data.sub;
  });
};
export const getToken = (data, secret) => {
  return jwt.sign({
    data: data
  }, secret, { expiresIn: '24h' });
};
