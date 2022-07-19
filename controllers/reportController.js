import Report from "../models/reportSchema.js";

export const reportPost = async (req, res) => {
  const report = req.body;
  const saveReport = new Report({ ...report });
  try {
    await saveReport.save();
    res.status(200).json("Success");
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Something went wrong" });
  }
};
