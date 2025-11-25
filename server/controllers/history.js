import video from "../Modals/video.js";
import history from "../Modals/history.js";

export const handlehistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  try {
    // Remove existing history entry if exists to avoid duplicates
    await history.findOneAndDelete({ viewer: userId, videoid: videoId });
    
    // Create new history entry
    await history.create({ viewer: userId, videoid: videoId });
    
    // Increment view count
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error("History error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const handleview = async (req, res) => {
  const { videoId } = req.params;
  try {
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ viewAdded: true });
  } catch (error) {
    console.error("View error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getallhistoryVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const historyvideo = await history
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .sort({ watchedon: -1 })
      .exec();
    return res.status(200).json(historyvideo);
  } catch (error) {
    console.error("Get history error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clearHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    await history.deleteMany({ viewer: userId });
    return res.status(200).json({ message: "History cleared" });
  } catch (error) {
    console.error("Clear history error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};