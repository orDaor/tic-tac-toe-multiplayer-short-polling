//imports built-in
//...

//imports 3rd party
//...

//imports custom
//...

function errorHandlingMiddleware(error, req, res, next) {
  console.log(error);
  res.redirect("/500");
}

//export
module.exports = errorHandlingMiddleware;
