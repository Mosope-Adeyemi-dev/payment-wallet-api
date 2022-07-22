// options for cors
module.exports = (req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000', //frontend preview link
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
    'Origin, Content-Type, Authorization'
  );
  next();
};
