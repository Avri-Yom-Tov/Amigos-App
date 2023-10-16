

const ProgressBar = require("electron-progressbar");
const axios = require('axios');
const fs = require('fs');
const path = require('path');



const getFilterRepositories = async (includeJava) => {
  const orgName = 'nice-cxone';
  const specificUsers = ['Avri-Yom-Tov', 'itchySun', 'OffirLandau', 'OENice'];
  const targetLanguages = includeJava ? ['JavaScript', 'Java'] : ['JavaScript'];
  const per_page = 100;
  const githubToken = process.env.GIT_TOK;

  const progressBar = new ProgressBar({
    indeterminate: true,
    text: 'Fetching Repos ...',
    detail: "Wait..."
  });
  try {


    const filteredRepos = [];
    for (const lang of targetLanguages) {
      let page = 1;
      while (true) {
        const repoResponse = await axios.get(`https://api.github.com/search/repositories?q=org:${orgName}+language:${lang}&per_page=${per_page}&page=${page}`, {
          headers: {
            'Authorization': `token ${githubToken}`
          }
        });

        const repos = repoResponse.data.items;
        repos.forEach(async (element) => {
          progressBar.detail = `Processing ... ${element.name} ..`;

          const contributorsResponse = await axios.get(element.contributors_url, {
            headers: {
              'Authorization': `token ${githubToken}`
            }
          });
          const contributors = contributorsResponse.data;

          for (const contributor of contributors) {

            if (specificUsers.includes(contributor.login)) {
              filteredRepos.push({
                name: element.name,
                language: element.language,
                html_url: element.html_url,
                clone_url: element.clone_url,
                created_at: element.created_at
              });
              break;
            }
          }

        });

        if (repos.length < per_page) {

          break;
        }

        page++;
      }
    }

    console.log('Filtered Repositories:', filteredRepos);


    progressBar.detail = `Write it  ... !`;
    const stringToWrite = JSON.stringify(filteredRepos);
    const folderName = 'data';
    const rootDir = path.resolve(__dirname, '..');
    const filePathToSave = path.join(rootDir, folderName);
    const totalFilePath = path.join(filePathToSave, 'filtered-repositories.txt');


    fs.writeFile(totalFilePath, stringToWrite, { flag: 'w' }, (err) => {
      if (err) {
        progressBar.setCompleted();
        throw err;
      } else {
        progressBar.setCompleted();
        console.log('File has been written !');
      }
    });


  } catch (error) {
    progressBar.setCompleted();
    console.error('An error occurred:', error);
    throw error;
  }
}



module.exports = getFilterRepositories;

