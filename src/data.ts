import * as vscode from 'vscode';
import {get_all_jobs_in_view} from './jenkins/jenkins';


export class JenkinsJobsProvider implements vscode.TreeDataProvider<Job> {
    constructor() {}

    getTreeItem(element: Job): vscode.TreeItem {
        return element;
    }

    collapsedItem(label: string, name: string) {
        return new Job(label, name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    FinalItem(label: string, name: string, command: vscode.Command) {
        return new Job(label, name, vscode.TreeItemCollapsibleState.None, command);
    }

    getChildren(element?: Job): Thenable<Job[]> {
        if (!element) {
            return get_all_jobs_in_view('.Dev Jobs').then(
                (jobs: any) => jobs.map(job => new Job(job.name, job.name, vscode.TreeItemCollapsibleState.Collapsed)));
        }
        if (element.label === "Build") {
            vscode.window.showInformationMessage("Building");
            return Promise.resolve([]);
        }
        return Promise.resolve([this.FinalItem("Build", element.label, {
            command: 'jenkins.open',
            title: '',
            arguments: [element.jobname]})]);
    }
}

export class Job extends vscode.TreeItem {
    constructor(
        public label: string,
        public jobname: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }
}