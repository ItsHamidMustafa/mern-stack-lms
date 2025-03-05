const Help = require("../models/Help");

const fetchHelps = async (req, res) => {
  const help = await Help.find();

  if (!help) {
    return res
      .status(301)
      .json({ warning: "No helping material found in database :(" });
  }

  return res.status(200).json(help);
};

const createHelps = async (req, res) => {
  const help = req.body;
  await Help.create(help);
};

module.exports = {
  fetchHelps,
  createHelps,
};
