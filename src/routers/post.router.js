const express = require("express");
const PostController = require("../controllers/post.controller");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const endPoint = "/posts";

router.get(endPoint, PostController.getAll);
router.get(`${endPoint}/:id`, PostController.getOne);
router.post(endPoint, upload.array("files", 8), PostController.create);
router.put(`${endPoint}/:id`, upload.array("files", 8), PostController.update);
router.delete(`${endPoint}/:id`, PostController.delete);
router.delete(endPoint, PostController.deleteAll);

module.exports = router;
