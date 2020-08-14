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
    if (paramInputs === undefined) {
        // User might have dismissed the inputs
        console.log("Cancelling build request");
        vscode.window.setStatusBarMessage("Not building..", 2000);
        return;
    }
    try {
        let buildSubmissionPromise = jenkins.build_with_params(job, paramInputs);
        vscode.window.setStatusBarMessage("Starting build..", buildSubmissionPromise);
        let buildSubmission = await buildSubmissionPromise;
        console.log(buildSubmission);
        if (buildSubmission["statusCode"] === 201) {
            vscode.window.showInformationMessage("Started build successfully");
        }
    } catch (err) {
        console.log(err);
    }
}