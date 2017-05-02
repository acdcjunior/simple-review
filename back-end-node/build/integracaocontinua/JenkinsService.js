"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("../infra/rest");
class JenkinsService {
    static getSagas2Job() {
        return rest_1.Rest.get(JenkinsURLs.sagas2PipelineUrl());
    }
}
class JenkinsURLs {
    static sagas2PipelineUrl() {
        return JenkinsURLs.jobUrl('Sesol-2', 'sagas2.pipeline');
    }
    static jobUrl(grupo, job) {
        return `http://srv-ic-master:8089/view/${grupo}/job/${job}/api/json?pretty=true`;
    }
}
class JenkinsCache {
    static consultarJenkins() {
        JenkinsService.getSagas2Job().then(data => {
            JenkinsCache.sagas2JobData = data;
        }).catch(() => { });
    }
}
JenkinsCache.sagas2JobData = { color: undefined };
exports.JenkinsCache = JenkinsCache;
setInterval(JenkinsCache.consultarJenkins, 180 * 1000);
JenkinsCache.consultarJenkins(); // chamada inicial
