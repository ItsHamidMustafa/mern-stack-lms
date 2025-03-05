const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  materials: [
    {
      title: {
        type: String,
        required: true,
      },
      file: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Help", helpSchema);
