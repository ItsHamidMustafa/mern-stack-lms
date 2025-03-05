const mongoose = require("mongoose");
const RoomSchema = mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: false,
  },
  resources: [
    {
      type: String,
      required: false,
    },
  ],
  status: {
    type: String,
    required: false,
    enum: ["Available", "Occupied"],
  },
});
