import {Rest} from "../infra/rest";

class JenkinsService {

    static getSagas2Job(): Promise<JenkinsJob> {
        return Rest.get<JenkinsJob>(JenkinsURLs.sagas2PipelineUrl());
    }

}

class JenkinsURLs {

    static sagas2PipelineUrl(): string {
        return JenkinsURLs.jobUrl('Sesol-2', 'sagas2.pipeline');
    }

    static jobUrl(grupo: string, job: string): string {
        return `http://srv-ic-master:8089/view/${grupo}/job/${job}/api/json?pretty=true`;
    }

}

interface JenkinsJob {
    readonly color: string;
}

export class JenkinsCache {
    public static sagas2JobData: JenkinsJob = {color: undefined};

    static consultarJenkins() {
        JenkinsService.getSagas2Job().then(data => {
            JenkinsCache.sagas2JobData = data;
        }).catch(() => { /* engole erro... */ });
    }
}

setInterval(JenkinsCache.consultarJenkins, 180 * 1000);
JenkinsCache.consultarJenkins(); // chamada inicial