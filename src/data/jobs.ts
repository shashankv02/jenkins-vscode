import * as vscode from 'vscode';
import {get_all_jobs_in_view as get_all_builds_by_user} from '../jenkins/jenkins';


export class JenkinsJobsProvider implements vscode.TreeDataProvider<Job> {
    private _onDidChangeTreeData: vscode.EventEmitter<Job | undefined | void> = new vscode.EventEmitter<Job | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Job | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

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
            return get_all_builds_by_user('.Dev Jobs').then(
                (jobs: any) => jobs.map(job => new Job(job.name, job.name, vscode.TreeItemCollapsibleState.Collapsed)));
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

export class Job extends vscode.TreeItem {
    constructor(
        public label: string,
        public jobname: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }
}