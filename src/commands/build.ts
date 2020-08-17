import {get_parameters} from '../jenkins/parse';
import {parseString} from 'xml2js';
import * as vscode from 'vscode';

export async function build(jenkins, job) {
    let configPromise = jenkins.get_job_xml(job);
    vscode.window.setStatusBarMessage("Getting build parameters", configPromise);
    try {
        var config = await configPromise;
    } catch(e) {
        vscode.window.showErrorMessage(e);
        return;
    }

    let params = await new Promise((resolve, reject) => parseString(config, (err, result) => {
        if (err) { return reject(err); }
        return resolve(result);
    }));
    let paramInputs;
    try {
        paramInputs = await get_parameters(params);
    } catch(e) {
        vscode.window.showErrorMessage(e);
    }

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
        } else if (buildSubmission['statusCode'] === 403) {
            vscode.window.showErrorMessage("Forbidden");
        } else {
            vscode.window.showErrorMessage(buildSubmission["statusCode"]);
        }
    } catch (err) {
        console.log("Err", err);
    }
}