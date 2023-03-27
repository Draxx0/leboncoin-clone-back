const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UploadFileSchema = new Schema({
  ETag: {
    type: String,
  },
  ServerSideEncryption: {
    type: String,
  },
  Location: {
    type: String,
  },
  Key: {
    type: String,
  },
  Bucket: {
    type: String,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  imageLink: {
    type: String,
  },
});

module.exports = mongoose.model("UploadFile", UploadFileSchema);
