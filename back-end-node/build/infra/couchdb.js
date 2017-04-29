"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PouchDB = require("pouchdb");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
const ajaxOpts = {
    ajax: {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${CodeReviewConfig_1.codeReviewConfig.couchdb.user}:${CodeReviewConfig_1.codeReviewConfig.couchdb.password}`).toString('base64')
        },
        body: {
            name: CodeReviewConfig_1.codeReviewConfig.couchdb.user,
            password: CodeReviewConfig_1.codeReviewConfig.couchdb.password
        }
    }
};
exports.PouchDBService = new PouchDB(`http://${CodeReviewConfig_1.codeReviewConfig.couchdb.host}:${CodeReviewConfig_1.codeReviewConfig.couchdb.port}/${CodeReviewConfig_1.codeReviewConfig.couchdb.database}`, ajaxOpts);
