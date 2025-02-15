//import model 
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

// business logic
exports.createComment = async (req, res) => {
  try {

    //fetch data from req body
    const { post, user, body } = req.body;
    //create a comment object
    const comment = new Comment({
      post, user, body
    });

    // save the new comment into the database
    const savedComment = await comment.save();

    // find the post by id add the new comment to its comments array // populate the comment array with comment document
    const updatedPost = await Post.findByIdAndUpdate(post, { $push: { comments: savedComment._id } }, { new: true }).populate("comments").exec();
    res.status(200).json({
      success: true,
      data: updatedPost,
      message: `Comment successfully`,
    });
  }
  catch (err) {
    console.log(err);
    res.status(500)
      .json({
        success: false,
        error: err.message,
        message: 'Server Error',
      });
  }
}