const renderForm = (req, res) => {
  const formSubmitted = req.query.formSubmitted === "true";
  const formError = req.query.formError === "true";
  const message = req.query.message;

  res.render("index", {
    title: "Digital Arts Technology Training Center Inc.",
    formSubmitted,
    formError,
    message,
  });
};

module.exports = { renderForm };