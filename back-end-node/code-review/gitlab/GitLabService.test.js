"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitLabService_1 = require("./GitLabService");
var user = GitLabService_1.GitLabService.getUser('antonio.junior');
user.then(function (x) { return console.log('ok', x); }).catch(function (x) { return console.log('err', x); });
