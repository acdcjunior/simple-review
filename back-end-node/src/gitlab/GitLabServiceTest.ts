import {GitLabService} from "./GitLabService";

const user = GitLabService.getUser('antonio.junior');
user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));