// options for cors
module.exports = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000', //frontend preview link
    'https://rave-pay.vercel.app',
    'https://retropay.vercel.app',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, authorization'
  );
  next();
};
