const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },

    users: Array,

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      // userModel 里导出模型名是 "Users"
      ref: "Users",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Messages", messageSchema);