import * as vscode from 'vscode';
import {get_all_jobs_in_view} from './jenkins/jenkins';


export class JenkinsJobsProvider implements vscode.TreeDataProvider<Job> {
    constructor() {}

    getTreeItem(element: Job): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Job): Thenable<Job[]> {
        return get_all_jobs_in_view('.Dev Jobs').then(
            (jobs: any) => jobs.map(job => new Job(job.name, vscode.TreeItemCollapsibleState.Collapsed)));
    }
}

export class Job extends vscode.TreeItem {
    constructor(public name: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
        super(name, collapsibleState);
    }
}