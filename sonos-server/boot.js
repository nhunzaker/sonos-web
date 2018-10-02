const config = require("./config");

require("./index")().listen(config.port, () => {
  console.log("Listening at", config.domain);
});
