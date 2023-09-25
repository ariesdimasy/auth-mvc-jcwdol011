const { authController } = require("../controllers");
//const authController = require("../controllers/auth");
const { verifyToken, checkRole } = require("./../middleware/auth");
const router = require("express").Router();

router.post("/register", authController.register);
// router.post("/",(req, res) => {})
router.get("/login", authController.login);
// router.post("/",(req, res) => { console.log("login")})
router.get("/users", verifyToken, checkRole, authController.users);

module.exports = router;
