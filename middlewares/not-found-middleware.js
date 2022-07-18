//imports built-in
//...

//imports 3rd party
//...

//imports custom
//...

//path not found
function notFoundMidlleware(req, res) {
  res.redirect("/404");
}

//export
module.exports = notFoundMidlleware;
