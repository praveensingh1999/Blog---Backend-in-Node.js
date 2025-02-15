const Like = require("../models/likeModel");
const Post = require("../models/postModel");

exports.dummyLink = (req, res) => {
    res.send("This is your dummy page");
};


exports.likePost = async (req, res) => {
    try {
        const { post, user } = req.body;
        const like = new Like({
            post, user,
        });
        const savedLike = await like.save();

        //update post collection basis on this
        const updatedPost = await Post.findByIdAndUpdate(post, { $push: { likes: savedLike._id } }, { new: true })
            .populate("likes").exec();

        res.status(200).json({
            success: true,
            data: updatedPost,
            message: `Like post successfully`,
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
};

//unlike a post

exports.unlikePost = async (req, res) => {
    try {
        const { post, like } = req.body;
        //  find and delete the like collection me se
        const deletedLike = await Like.findOneAndDelete({ post: post, _id: like });

        //update the post collection
        const updatedPost = await Post.findByIdAndUpdate(post, { $pull: { likes: deletedLike._id } }, { new: true });

        res.json({
            posts: updatedPost,
        });
    }
    catch (error) {
        return res.status(400).json({
            error: "Error while unliking post",
        });
    }
}