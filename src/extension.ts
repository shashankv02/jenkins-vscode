// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {JenkinsJobsProvider, Job} from './data';
import {build as buildCmd} from './commands/build';

function build(job: String) {
	buildCmd(job);
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "jenkins-in-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('jenkins-in-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Jenkins in VSCode!');
	});

	// Open in browser command
	vscode.commands.registerCommand("jenkins.open", name => vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`https://healthbot-ci.juniper.net/job/${name}/build?delay=0sec`)));

	// Build command
	vscode.commands.registerCommand("jenkins.build", (job) => build(job));

	// Sidebar
	const jenkinsJobsProvider = new JenkinsJobsProvider();
	vscode.window.registerTreeDataProvider('jenkins-view', jenkinsJobsProvider);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
