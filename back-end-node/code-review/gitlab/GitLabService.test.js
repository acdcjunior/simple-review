"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabService_1 = require("./GitLabService");
const user = GitLabService_1.GitLabService.getUser('antonio.junior');
user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));
