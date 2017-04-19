"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Committer = require("./Committer");
var host = process.env.GITLAB_HOST || 'git';
var projectId = process.env.GITLAB_HOST_PROJECT_ID || 3;
var projectBranch = process.env.GITLAB_HOST_PROJECT_BRANCH || 'desenvolvimento';
var privateToken = process.env.GITLAB_HOST_PRIVATE_TOKEN || 'X_zfYU5k2VwDx2KegmdQ';
var GitLabConfig = (function () {
    function GitLabConfig() {
    }
    GitLabConfig.projectsUrl = function (perPage) {
        if (perPage === void 0) { perPage = 10; }
        return "http://" + host + "/api/v4/projects/" + projectId + "/repository/commits/?ref_name=" + projectBranch + "&per_page=" + perPage;
    };
    GitLabConfig.usersUrl = function (committerEmail) {
        var emailCorrigido = Committer.corrigirEmail(committerEmail);
        return "http://" + host + "/api/v4/users/?search=" + emailCorrigido;
    };
    GitLabConfig.commentsUrl = function (sha) {
        return "http://" + host + "/api/v4/projects/" + projectId + "/repository/commits/" + sha + "/comments";
    };
    Object.defineProperty(GitLabConfig, "privateToken", {
        get: function () {
            return privateToken;
        },
        enumerable: true,
        configurable: true
    });
    return GitLabConfig;
}());
exports.GitLabConfig = GitLabConfig;
console.log("\n    DADOS USADOS PARA CONEXAO DO BACKEND NODE COM GITLAB\n    ----------------------------------------------------\n    host: " + host + "\n    projectId: " + projectId + "\n    projectBranch: " + projectBranch + "\n    privateToken: " + privateToken + "\n    projectsUrl: " + GitLabConfig.projectsUrl() + "\n    usersUrl: " + GitLabConfig.usersUrl('meu@email.com') + "\n    commentsUrl: " + GitLabConfig.commentsUrl('sha1234') + "\n    ----------------------------------------------------\n");
