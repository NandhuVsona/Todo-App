const mongoose = require("mongoose");
const port = 3000;
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");

mongoose
  .connect(process.env.DB)
  .then(() =>
    app.listen(port, () => {
      console.log(`Hey server is listening on the port ${port}`);
    })
  )
  .catch((err) => console.log(err));
