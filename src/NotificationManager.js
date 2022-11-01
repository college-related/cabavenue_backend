var admin = require('firebase-admin');

class NotificationManager {
static initialized = false;
static init() {
  if (!this.initialized) {
    this.initialized = true;
    var serviceAccount = require('./config/cabavenue-drive-1f73c18535e4.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Notification Manager initialized.');
  } else {
    console.log('Notification Manager already initialized.');
  }
}

static async sendToDevices(notification, devices) {
  if (!Array.isArray(devices)) throw new Error('Array expected.');
  await admin
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

NotificationManager.init();

module.exports.NotificationManager = NotificationManager;
