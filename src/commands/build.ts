import {get_job_xml} from '../jenkins/jenkins';
import {get_parameters} from '../jenkins/parse';
import {parseString} from 'xml2js';

export async function build(job) {
    let config = await get_job_xml(job);
    let params = await new Promise((resolve, reject) => parseString(config, (err, result) => {
        if (err) { return reject(err); }
        return resolve(result);
    }));
    console.log("pp", params);
    return get_parameters(params);
}