"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitLabConfig = require("./GitLabConfig");
var rest_1 = require("../infra/rest");
var GitLab = (function () {
    function GitLab() {
    }
    GitLab.getCommits = function () {
        return rest_1.rest("GET", GitLabConfig.projectsUrl(), GitLabConfig.privateToken);
    };
    GitLab.getUser = function (committerEmail) {
        return rest_1.rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken);
    };
    return GitLab;
}());
exports.GitLab = GitLab;
