//imports built-in
//...

//imports 3rd party
//...

//imports custom
//...

//path not found
function notFoundMidlleware(req, res) {
  //check if the request forwarded here is an ajax request
  const acceptedResponseData = req.accepts(["html", "json"]);

  //if the request is ajax it wants json data as response,
  //otherwise it wants html data
  if (acceptedResponseData === "html") {
    res.redirect("/404");
  } else if (acceptedResponseData === "json") {
    const reponseData = {
      message: "The requested resource was not found",
    };
    res.status(404).json(reponseData);
  }
}

//export
module.exports = notFoundMidlleware;
