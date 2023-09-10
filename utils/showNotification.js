
function showNotification(text1, text2 = "...", isSilent = true, time = 3000) {
  const { Notification } = require("electron");

  const notification = new Notification({
    title: text1,
    body: text2,
    silent: isSilent,
  });

  notification.show();

  setTimeout(() => {
    notification.close();
  }, 5000);
}


module.exports = showNotification;
