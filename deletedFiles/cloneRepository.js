const git = require('simple-git');
const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const fs = require('fs');
const path = require("path");
const readFile = require("../utils/readFile");
const listFilesInDirectory = require("../accessories/listFilesInDirectory");


(async () => {
  const folderPath = "C:\\Works\\amigos-team";
  const workFolderRepositories = await listFilesInDirectory(folderPath);
  const folderName = 'data';
  const rootDir = path.resolve(__dirname, '..');
  const filePathToSave = path.join(rootDir, folderName);
  const totalFilePath = path.join(filePathToSave, 'filtered-repositories.txt');
  let repositoriesFromFile = await readFile(totalFilePath);
  repositoriesFromFile = JSON.parse(repositoriesFromFile);

  const mapArray = repositoriesFromFile.map((item) => item);
  const filerCloneArray = difference(mapArray, workFolderRepositories);
  if (filerCloneArray.length) {

    const container = document.getElementById('content');
    filerCloneArray.forEach((item) => {

      const div = document.createElement('div');
      const h3 = document.createElement('h3');
      div.className = 'gap';
      div.id = item.name;
      h3.className = 'updateButton';
      h3.textContent = item.name;
      h3.title = "Created At : " + new Date(item.created_at).toLocaleString();
      h3.style.cursor = 'default';



      h3.addEventListener('click', () => {
        Swal.fire({
          title: 'Cloning in progress...',
          html: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const newRepoPath = path.join(folderPath, item.name);
        fs.mkdirSync(newRepoPath);
        git().clone(item.clone_url, newRepoPath)
          .then(() => {
            Swal.close();
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: `Finished cloning repo  !`
            });

            console.log('Repository cloned!');

            document.getElementById(item.name).style.display = "none";
          })
          .catch((err) => {
            Swal.close();
            Swal.fire(`Error cloning repo: ${err.message}`);
            console.error('Failed: ', err);
          });
      });

      div.appendChild(h3);
      container.appendChild(div);
    });


    let style = document.createElement("style");
    document.head.appendChild(style);




  }
  else {
    document.getElementById("Repo").style.display = 'none';
    document.getElementById("backButton").style.display = 'none';
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    setTimeout(() => {
      Toast.fire({
        icon: 'success',
        title: `You have already all the repositories !`
      });
      setTimeout(() => {
        ipcRenderer.send('navigate-to-main');
      }, 3000);
    }, 1500);
  }


  const backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    ipcRenderer.send('navigate-to-main');
  });

})();



function difference(arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item.name) && item.name !== "webapp-as");
}


// Git.Clone(item.clone_url, localPath)
//   .then((repository) => {
//     console.log('Repository cloned to', localPath);
//   })
//   .catch((err) => console.error('Error cloning repository:', err));