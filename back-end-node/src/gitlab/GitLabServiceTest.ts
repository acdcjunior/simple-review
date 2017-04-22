import {GitLabService} from "./GitLabService";
import {Email} from "../geral/Email";

const user = GitLabService.getUserByEmail(new Email('antonio.junior@example.com'));
user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));