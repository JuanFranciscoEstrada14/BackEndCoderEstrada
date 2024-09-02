require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    sessionSecret: process.env.SESSION_SECRET
};
