const express = require("express");
const app = express();
const PORT = 5700;

app.use(express.json());

const db = require("./models");
db.sequelize.sync({ alter: true });

const { authRoutes } = require("./routes");

app.use("/auth", authRoutes);

// app.get("/auth/login", (req, res) => {});
// app.post("/auth/register", (req, res) => {});

app.get(
  "/:name",
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    // return res.send({
    //   message: "ini masih di middleware",
    // });
    if (req.params.name == "dimas") {
      req.myname = "mr. " + req.params.name;
      next();
    } else {
      return res.send({
        message: "ini masih di middleware, silahken isi nama",
      });
    }
  },
  (req, res) => {
    res.status(200).json({
      message: "hello " + req.myname,
      data: null,
    });
  }
);

app.listen(PORT, () => {
  console.log("server run on port = ", PORT);
});
