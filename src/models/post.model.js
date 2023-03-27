const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uploadFiles: [
    {
      type: Schema.Types.ObjectId,
      ref: "UploadFile",
    },
  ],
  adress: {
    type: String,
  },
  city: {
    type: String,
  },
  route: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  lat: {
    type: Number,
  },
  lon: {
    type: Number,
  },
});

module.exports = mongoose.model("Post", PostSchema);
