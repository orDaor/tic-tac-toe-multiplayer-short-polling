//imports built-in
//...

//imports 3rd party
//...

//imports custom
//...

function errorHandlingMiddleware(error, req, res, next) {
  console.log(error);

  //check if the request forwarded here is an ajax request
  const acceptedResponseData = req.accepts(["html", "json"]);
  console.log(acceptedResponseData);

  //if the request is ajax it wants json data as response,
  //otherwise it wants html data
  if (acceptedResponseData === "html") {
    res.redirect("/500");
  } else if (acceptedResponseData === "json") {
    const reponseData = {
      message: "An error occured in the server, maybe try later?",
    };
    res.status(500).json(reponseData);
  }
}

//export
module.exports = errorHandlingMiddleware;
