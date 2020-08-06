import * as vscode from 'vscode';

export class JenkinsJobsProvider implements vscode.TreeDataProvider<Job> {
    constructor() {}

    getTreeItem(element: Job): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Job): Thenable<Job[]> {
        return Promise.resolve([new Job("test", vscode.TreeItemCollapsibleState.Collapsed)]);
    }
}

export class Job extends vscode.TreeItem {
    constructor(public name: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
        super(name, collapsibleState);
    }
}