


const fs = require('fs').promises;
const ini = require('ini');
const runCommandAdmin = require("../utils/runCommandAdmin");

const AWS_CREDENTIALS_PATH = 'C:\\Users\\avrahamy\\.aws\\credentials';

const parseAWSCredentials = (data) => {
  const config = ini.parse(data);
  return Object.keys(config).map((profile) => ({ profile, ...config[profile] }));
}

const setAWSCredentialsEnv = async (deleteCredentials) => {

  if (deleteCredentials) {

    try {
      const deleteIt = `reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /F /V AWS_SESSION_TOKEN && reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /F /V AWS_SECRET_ACCESS_KEY && reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /F /V AWS_ACCESS_KEY_ID`;

      await runCommandAdmin(deleteIt);
      return;
    } catch (error) { return }

  }

  try {

    const data = await fs.readFile(AWS_CREDENTIALS_PATH, 'utf-8');
    const credentialsArray = parseAWSCredentials(data);

    const { aws_access_key_id, aws_secret_access_key, aws_session_token } = credentialsArray[2];

    const setEnvCommand = `cmd /K "setx AWS_ACCESS_KEY_ID ${aws_access_key_id} /m && setx AWS_SECRET_ACCESS_KEY ${aws_secret_access_key} /m && setx AWS_SESSION_TOKEN ${aws_session_token} /m"`;

    await runCommandAdmin(setEnvCommand);

  } catch (err) {

    console.error('An error occurred:', err);
  }
}

module.exports = setAWSCredentialsEnv;




