import {get_parameters} from '../jenkins/parse';
import {parseString} from 'xml2js';
import * as vscode from 'vscode';

export async function build(jenkins, job) {
    let configPromise = jenkins.get_job_xml(job);
    vscode.window.setStatusBarMessage("Getting build parameters", configPromise);
    let config = await configPromise;
    let params = await new Promise((resolve, reject) => parseString(config, (err, result) => {
        if (err) { return reject(err); }
        return resolve(result);
    }));
    let paramInputs = await get_parameters(params);
    try {
        let buildSubmission = await jenkins.build_with_params(job, paramInputs);
        console.log(buildSubmission);
        if (buildSubmission["statusCode"] === 201) {
            vscode.window.showInformationMessage("Started build successfully");
        }
        let queueId = buildSubmission["queueId"];
        let buildDetails = await jenkins.get_queue_item(queueId);
        console.log(buildDetails);
    } catch (err) {
        console.log(err);
    }
}