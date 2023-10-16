const { dialog } = require("electron")

const showGenericDialog = async (title, message, detail, buttons, onYes, onNo, checkboxLabel) => {
  detail = detail || "JsIsTheBest";
  buttons = buttons || ["Yes", "No"];
  onYes = onYes || (() => { });
  onNo = onNo || (() => { });

  const options = {
    type: "info",
    title: title,
    message: message,
    detail: detail,
    buttons: buttons,
    cancelId: 150,
    defaultId: 1,
  };
  
  if (checkboxLabel) {
    // Remember My Choice ! 
    options.checkboxLabel = checkboxLabel;
  }
  const response = await dialog.showMessageBox(options);
  console.log(response.response);
  if (response.response === 150) {
    return;
  }
  else if (response.response == 0) {
    onYes();
  }
  else if (response.response == 1) {
    onNo(detail);
  }
}

module.exports = showGenericDialog;
