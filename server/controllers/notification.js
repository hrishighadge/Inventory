const Notification = require("../models/notification");

exports.getNotification = (req, res) => {
    Notification.find({ markAsRead:false})
    .sort({ timestamp: -1 })
    .then((notification) => res.json(notification))
    .catch((err) => res.sendStatus(500));
};

exports.markNotification = (req, res) => {
    Notification.updateMany(
    { markAsRead:true})
    .then((notification) => res.json(notification))
    .catch((err) => res.sendStatus(500));
}
