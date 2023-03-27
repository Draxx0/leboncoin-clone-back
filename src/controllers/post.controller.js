const UploadFileModel = require("../models/uploadFile.model");
const uploadOneFileInAws = require("../config/utils/aws-s3");
const Post = require("../models/post.model");

const PostController = {
  getAll: async (req, res) => {
    try {
      const { lat, lon } = req.query;
      if (parseFloat(lat) && parseFloat(lon)) {
        const posts = await Post.find({
          lat: { $gte: parseFloat(lat) - 0.1, $lte: parseFloat(lat) + 0.1 },
          lon: { $gte: parseFloat(lon) - 0.1, $lte: parseFloat(lon) + 0.1 },
        }).populate("uploadFiles");

        return res.send(posts);
      } else {
        const posts = await Post.find().populate("uploadFiles");
        return res.send(posts);
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate("uploadFiles");
      res.send(post);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  create: async (req, res) => {
    const { title, description, adress, city, postalCode, lat, lon } = req.body;
    try {
      const post = new Post({
        title,
        description,
        adress,
        city,
        postalCode,
        lat,
        lon,
      });
      await post.save();

      const uploadFilesInAws = await Promise.all(
        req.files.map((file) =>
          uploadOneFileInAws(file, post._id).then((file) => {
            const uploadFile = new UploadFileModel({
              ...file,
              post: post._id,
              imageLink: file.Key,
            });
            uploadFile.save();

            post.uploadFiles.push(uploadFile);
          })
        )
      );

      await post.save(uploadFilesInAws);

      res.send(post);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  update: async (req, res) => {
    const { title, description, adress, city, postalCode, lat, lon } = req.body;

    const post = await Post.findById(req.params.id).populate("uploadFiles");

    const uploadFilesStillInPost = post.uploadFiles.filter((file) => {
      return req.body.uploadFiles.some((fileInBody) => {
        return fileInBody === file._id.toString();
      });
    });

    let newUploadFiles = [...uploadFilesStillInPost];

    if (req.files.length > 0) {
      const uploadOnAws = await Promise.all(
        req.files.map((file) =>
          uploadOneFileInAws(file, post._id).then((file) => {
            const uploadFile = new UploadFileModel({
              ...file,
              post: post._id,
              imageLink: file.Key,
            });
            uploadFile.save();
            newUploadFiles.push(uploadFile);
          })
        )
      );

      await post.save(uploadOnAws);
    }

    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          adress,
          city,
          postalCode,
          lat,
          lon,
          uploadFiles: newUploadFiles,
        },
        {
          new: true,
        }
      ).populate("uploadFiles");
      await post.save();

      res.send(post);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      res.send({ message: "Post deleted", deletedPost });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  deleteAll: async (req, res) => {
    try {
      await Post.deleteMany({});
      res.send({ message: "All posts deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = PostController;
