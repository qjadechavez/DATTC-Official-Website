const { app, port } = require("./server/serverConfig/envconfig.js");
const { configureViewEngine } = require("./server/serverConfig/viewconfig.js");
const { mountRoutes } = require("./server/apis/apiRoutes/routes.js");

configureViewEngine();
mountRoutes();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
