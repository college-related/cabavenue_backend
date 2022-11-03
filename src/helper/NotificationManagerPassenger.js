var admin = require('firebase-admin');

class NotificationManagerPassenger {
static initialized = false;
static init() {
  if (!this.initialized) {
    this.initialized = true;
    var serviceAccount = require('../config/cabavenue-passenger-firebase-adminsdk-5e1vx-b97bb3d67e.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    }, 'for-passenger');
    console.log('Notification Manager initialized.');
  } else {
    console.log('Notification Manager already initialized.');
  }
}

static async sendToDevices(notification, devices) {
  if (!Array.isArray(devices)) throw new Error('Array expected.');
  await admin.app('for-passenger')
    .messaging()
    .sendMulticast({
      tokens: devices.map((d) => d.toString()),
      notification: notification,
      playSound: true,
    })
    .then((r) => {
      r.responses.forEach((r) => console.log(r.error && r.error.toString()));
      if (r.failureCount) {
        console.log('Failed to send ' + notification + ' to ' + r.failureCount + ' devices.');
      } else {
        console.log('Sent ' + notification + ' to ' + r.successCount + ' devices.');
      }
    })
    .catch((e) => {
      console.log('Error Sending Notification: ' + e);
    });
}}

NotificationManagerPassenger.init();

module.exports.NotificationManagerPassenger = NotificationManagerPassenger;
