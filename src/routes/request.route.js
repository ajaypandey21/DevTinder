const express = require("express");
const { userAuth } = require("../utils/middlewares");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/conenectionRequets");
const UserModel = require("../models/user.model");
requestRouter.post(
  "/request/send/:status/:toUser",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUser;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status!!!");
      }
      const isToUserExisting = await UserModel.findById(toUserId);
      if (!isToUserExisting) {
        throw new Error("User you trying to send request not found");
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Connection Request already Existed");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionRequest.save();
      res
        .status(200)
        .json({ message: `${req.user.firstName} is ${status}`, data });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);
module.exports = requestRouter;