const { dialog } = require("electron");

async function showGenericDialog(
  title,
  message,
  detail = [],
  buttons = ["Yes", "No"],
  onOk = () => {},
  onList = () => {},
  defaultId = 0,
  cancelId = 0,
  checkboxLabel = "",
  boxLabelFunk = () => {}
) {
  const options = {
    type: "info",
    title: title,
    message: message,
    detail: detail,
    buttons: buttons,
    defaultId: defaultId,
    cancelId: cancelId,
  };
  if (checkboxLabel) {
    options.checkboxLabel = checkboxLabel;
  }
  const response = await dialog.showMessageBox(options);
  if (response.response === 0) {
    onOk();
  } 
  else {
    if (response.checkboxChecked) {
      boxLabelFunk();
    }
    onList(detail);
  }
}

module.exports = showGenericDialog;
