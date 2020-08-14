import * as vscode from 'vscode';
import {get_all_jobs_in_view} from '../jenkins/jenkins';


export class JenkinsBuildsProvider implements vscode.TreeDataProvider<Build> {
    constructor() {}

    getTreeItem(element: Build): vscode.TreeItem {
        return element;
    }

    collapsedItem(label: string, name: string) {
        return new Build(label, name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    FinalItem(label: string, name: string, command: vscode.Command) {
        return new Build(label, name, vscode.TreeItemCollapsibleState.None, command);
    }

    getChildren(element?: Build): Thenable<Build[]> {
        if (!element) {

            return get_all_jobs_in_view('.Dev Jobs').then(
                (jobs: any) => jobs.map(job => new Build(job.name, job.name, vscode.TreeItemCollapsibleState.Collapsed)));
        }
        return Promise.resolve([
            this.FinalItem("Open in Browser", element.label, {
            command: 'jenkins.open',
            title: '',
            arguments: [element.jobname]}),
            this.FinalItem("Build", element.label, {
                command: 'jenkins.build',
                title: '',
                arguments: [element.jobname]})
        ]);
    }
}

export class Build extends vscode.TreeItem {
    constructor(
        public label: string,
        public jobname: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }
}