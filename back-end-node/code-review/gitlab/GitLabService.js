"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitLabConfig_1 = require("../domain/GitLabConfig");
var rest_1 = require("../infra/rest");
var GitLabService = (function () {
    function GitLabService() {
    }
    GitLabService.getCommits = function (perPage) {
        if (perPage === void 0) { perPage = 10; }
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.projectsUrl(perPage), GitLabConfig_1.GitLabConfig.privateToken);
    };
    GitLabService.getUser = function (committerEmail) {
        return rest_1.rest("GET", GitLabConfig_1.GitLabConfig.usersUrl(committerEmail), GitLabConfig_1.GitLabConfig.privateToken);
    };
    return GitLabService;
}());
exports.GitLabService = GitLabService;
