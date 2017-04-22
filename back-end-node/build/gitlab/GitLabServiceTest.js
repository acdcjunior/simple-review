"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabService_1 = require("./GitLabService");
const Email_1 = require("../geral/Email");
const user = GitLabService_1.GitLabService.getUserByEmail(new Email_1.Email('antonio.junior@example.com'));
user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));
