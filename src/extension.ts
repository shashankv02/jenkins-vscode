// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {JenkinsJobsProvider} from './data/jobs';
import {build as buildCmd} from './commands/build';
import {Jenkins} from './jenkins/jenkins';

var jenkinsUrlConfig = "jenkins.url";
var jenkinsViewConfig = "jenkins.view";

function build(jenkins, job: String) {
	buildCmd(jenkins, job);
}

function initializeJenkinsFromConfig(jenkins) {
	console.log("Configuring Jenkins URL");
	let url = vscode.workspace.getConfiguration().get(jenkinsUrlConfig);
	jenkins.init(url);
}

function configureJenkinsURL() {
	let msg = "Enter URL to connect to Jenkins";
	let placeholder = "https://username:password@yourjenkinsurl or https://username:token@yourjenkinsurl";
	vscode.window.showInputBox({prompt: msg, placeHolder: placeholder}).then(
		val => {
			vscode.workspace.getConfiguration().update(jenkinsUrlConfig, val, vscode.ConfigurationTarget.Global);
		}
	);
}

function configureJenkinsView() {
	let msg = "Enter Jenkins view name";
	let placeholder = "All";
	vscode.window.showInputBox({prompt: msg, placeHolder: placeholder}).then(
		val => {
			vscode.workspace.getConfiguration().update(jenkinsViewConfig, val, vscode.ConfigurationTarget.Global);
		}
	);
}

export function activate(context: vscode.ExtensionContext) {
	let url: String | undefined = vscode.workspace.getConfiguration().get(jenkinsUrlConfig);
	let jenkins;
	if (url === undefined || url === "") {
		console.log("URL not configured");
		jenkins = new Jenkins("");
	} else {
		jenkins = new Jenkins(url);
	}
	console.log('jenkins-in-vscode" is now active!');

	// Subscribe to config changes
	vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration(jenkinsUrlConfig)) {
			initializeJenkinsFromConfig(jenkins);
		}
	});

	// Open in browser command
	vscode.commands.registerCommand("jenkins.open", name => vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`https://healthbot-ci.juniper.net/job/${name}/build?delay=0sec`)));

	// Build command
	vscode.commands.registerCommand("jenkins.build", (job) => build(jenkins, job));

	// Configure URL command
	vscode.commands.registerCommand("jenkins.configureURL", () => configureJenkinsURL());

	// Configure View command
	vscode.commands.registerCommand("jenkins.configureView", () => configureJenkinsView());

	// Sidebar
	const jenkinsJobsProvider = new JenkinsJobsProvider(jenkins);
	vscode.window.registerTreeDataProvider('jobs-sub-view', jenkinsJobsProvider);
	vscode.commands.registerCommand('jobs-sub-view.refreshEntry', () =>
    	jenkinsJobsProvider.refresh()
  	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
