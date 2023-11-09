const fs = require('fs').promises;
const ini = require('ini');

const AWS_CREDENTIALS_PATH = 'C:\\Users\\avrahamy\\.aws\\credentials';

const parseAWSCredentials = (data) => {
    const config = ini.parse(data);
    return Object.keys(config).map((profile) => ({ profile, ...config[profile] }));
};

const setAWSCredentialsEnv = async () => {


    try {
        const data = await fs.readFile(AWS_CREDENTIALS_PATH, 'utf-8');
        const credentialsArray = parseAWSCredentials(data);
        const { aws_access_key_id, aws_secret_access_key, aws_session_token } = credentialsArray[2];

        process.env.AWS_ACCESS_KEY_ID = aws_access_key_id;
        process.env.AWS_SECRET_ACCESS_KEY = aws_secret_access_key;
        process.env.AWS_SESSION_TOKEN = aws_session_token;


        console.log(`setAWSCredentials: ${true}`);
    } catch (err) {
        console.error('An error occurred:', err);
    }

};



module.exports = setAWSCredentialsEnv();