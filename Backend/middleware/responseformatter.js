module.exports = (req, res, next) => {
  res.success = (message, data = null, status = 200) => {
    return res.status(200).json({
      message,
      status,
      data
    });
  };

  res.error = (message, status = 500) => {
    return res.status(200).json({
      message,
      status,
      data: null
    });
  };

  next();
};
