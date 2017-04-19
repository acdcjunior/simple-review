"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitLabConfig = require("../domain/GitLabConfig");
var rest_1 = require("../infra/rest");
var GitLabService = (function () {
    function GitLabService() {
    }
    GitLabService.getCommits = function (perPage) {
        if (perPage === void 0) { perPage = 10; }
        return rest_1.rest("GET", GitLabConfig.projectsUrl(perPage), GitLabConfig.privateToken);
    };
    GitLabService.getUser = function (committerEmail) {
        return rest_1.rest("GET", GitLabConfig.usersUrl(committerEmail), GitLabConfig.privateToken);
    };
    return GitLabService;
}());
exports.GitLabService = GitLabService;
