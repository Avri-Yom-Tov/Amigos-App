


const Swal = require('sweetalert2');
const { ipcRenderer } = require('electron');

const listFilesInDirectory = require("../utils/listFilesInDirectory");
const { getValue } = require('../utils/electronStore');
const runShellCommand = require("../utils/runShellCommand");
const openBrowser = require('../utils/openBrowser');
const openFolder = require('../utils/openFolder');
const readFile = require('../utils/readFile');



const USER_HOME = require('os').homedir();
const REPO_FOLDER_PATH = getValue('repoPath');
const VSCODE_COMMAND = 'code .';


const isIntelliJSelected = () => getValue('ideSelect') === 'intellij';

const createButton = (src, title) => {
  const button = document.createElement("img");
  button.src = src;
  button.title = title;
  button.classList.add("icon-size");
  return button;
}


const openIDE = (idePath, folderToOpen, message) => {
  ipcRenderer.send('pop-up-progress-bar', 2, message);
  runShellCommand(`${REPO_FOLDER_PATH}\\${folderToOpen}`, idePath, true);
};

const openWithCode = (folderToOpen) => {
  try {
    if (isIntelliJSelected()) {
      const intelliJPath = getValue('intelliJPath');
      openIDE(`"${intelliJPath}"`, folderToOpen, 'Opening Intellij IDE..');
      return;
    }
    openIDE(VSCODE_COMMAND, folderToOpen, 'Opening VsCode IDE..');

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.message,
    });
  }
};

const openOnGithub = (element) => {
  ipcRenderer.send('pop-up-progress-bar', 1, 'Opening browser ..');
  openBrowser(`https://github.com/nice-cxone/${element}`);
}

const openOnFolder = (element) => {
  ipcRenderer.send('pop-up-progress-bar', 2, 'Opening Folder ..');
  openFolder(REPO_FOLDER_PATH + "\\" + element);
}

const isConfigurationMissing = () => {
  console.log(getValue());
  const requiredKeys = ['ideSelect', 'repoPath', 'credentialsPath'];
  return requiredKeys.some(key => !getValue(key));
}


const isMissingIntelliJPath = () => {
  return isIntelliJSelected() && !getValue('intelliJPath');
}

const openResource = async (element, resourceType) => {
  try {
    const pipesUrls = await readFile(`${USER_HOME}\\amigosData.json`, true);
    if (pipesUrls[element] && pipesUrls[element]?.[resourceType]) {
      ipcRenderer.send('pop-up-progress-bar', 2, `Open on ${resourceType}..`);
      setTimeout(() => { openBrowser(pipesUrls[element][resourceType]) }, 1500);
      return;
    }

    const title = `I'm sorry, Missing details to continue ..`;
    const msg = 'One or more the Urls in the configuration file are missing, To solve this problem you need to edit the configuration file and then try again ..';
    const buttons = ['Yes, Set It Now !', 'Not now .'];

    ipcRenderer.send('show-config-dialog', 'info', title, msg, buttons);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error.message,
    });
  }
}



window.onload = async () => {

  if (isConfigurationMissing()) {
    const title = 'Hey user, Pay attention !';
    const msg = 'Probably this is your first time running this software, you must configure some important settings before you start ..'
    const buttons = ['Yes, Set It Now !', 'No, Exit ..'];

    ipcRenderer.send('show-init-dialog', 'info', title, msg, buttons);
    return;
  }

  if (isMissingIntelliJPath()) {
    const title = 'Hey user, Pay attention !';
    const msg = `It looks like you set your preferred IDE to be IntelliJ -  But you didn't set its install location..`
    const buttons = ['Set It On Settings !', 'No, Exit ..'];

    ipcRenderer.send('show-init-dialog', 'info', title, msg, buttons);
    return;
  }


  const searchBox = document.getElementById("searchBox");
  const searchType = document.getElementById("searchType");
  const scriptsList = document.getElementById("scripts");
  const workFolderRepositories = await listFilesInDirectory(REPO_FOLDER_PATH);
  workFolderRepositories.sort((a, b) => a - b);


  let listItems = [];

  workFolderRepositories.forEach((element) => {

    const btnContainer = document.createElement("div");
    const card = document.createElement("li");
    const title = document.createElement("h4");
    const body = document.createElement("p");
    card.classList.add("collection-item");

    const repoName = element.startsWith("cloud-formation-") && element !== 'cloud-formation-cxhist-storage' ? element.substring("cloud-formation-".length) : element;
    title.innerHTML = repoName.charAt(0).toUpperCase() + repoName.slice(1).toLowerCase();
    title.classList.add("card-title");


    btnContainer.classList.add("cardAss");


    const buttons = [
      { img: "../img/programming.png", label: "Open On IDE", action: (() => openWithCode(element)) },
      { img: "../img/social.png", label: "Open On Github", action: (() => { openOnGithub(element) }) },
      { img: "../img/open-folder.png", label: "Open On Folder", action: (() => { openOnFolder(element) }) },
      { img: "../img/jenkins.png", label: "Open On Jenkins", action: (() => { openResource(element, 'job') }) },
      { img: "../img/amazon.png", label: "Open On Aws", action: (() => { openResource(element, 'aws') }) }
    ];


    buttons.forEach(({ img, label, action }) => {
      const button = createButton(img, label);
      button.addEventListener('click', action);
      btnContainer.appendChild(button);
    });


    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(btnContainer);

    scriptsList.appendChild(card);
    listItems.push({ element, card });
  });





  const filterRepositories = () => {

    const searchValue = searchBox.value.toLowerCase();
    const filterType = searchType.value;

    listItems.forEach(item => {
      const repoName = item.element.toLowerCase();
      const listItem = item.card;

      const isHistorical = repoName.includes('cxhist');
      let shouldDisplay = false;

      if (filterType === 'All') {
        shouldDisplay = repoName.includes(searchValue);
      }
      else if (filterType === 'AppLink') {
        shouldDisplay = !isHistorical && repoName.includes(searchValue);
      }
      else if (filterType === 'Historical') {
        shouldDisplay = isHistorical && repoName.includes(searchValue);
      }

      listItem.style.display = shouldDisplay ? "" : "none";
    });
  };

  searchBox.addEventListener('keyup', filterRepositories);
  searchType.addEventListener('change', filterRepositories);
};





