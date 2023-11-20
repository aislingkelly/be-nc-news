exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ msg: 'path not found' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleserverErrors = (err, req, res, next) => {
  console.log('Error', err);
  res.status(500).send({ msg: 'internal server error' });
};
