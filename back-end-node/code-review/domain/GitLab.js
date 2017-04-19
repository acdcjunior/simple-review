"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitLabConfig_1 = require("./GitLabConfig");
var rest_1 = require("../infra/rest");
var GitLab = (function () {
    function GitLab() {
    }
    GitLab.getCommits = function () {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.projectsUrl(), GitLabConfig_1.GitLabConfig.privateToken);
    };
    GitLab.getUser = function (committerEmail) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUrl(committerEmail), GitLabConfig_1.GitLabConfig.privateToken);
    };
    return GitLab;
}());
exports.GitLab = GitLab;
