import * as vscode from 'vscode';

export class JenkinsJobsProvider implements vscode.TreeDataProvider<Job> {
    private _onDidChangeTreeData: vscode.EventEmitter<Job | undefined | void> = new vscode.EventEmitter<Job | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Job | undefined | void> = this._onDidChangeTreeData.event;
    private jenkins;

    constructor(jenkins) {
        this.jenkins = jenkins;
    }

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

    makeJobsFromApi(jobs: any)  {
        return jobs.map(job => new Job(job.name, job.name, vscode.TreeItemCollapsibleState.Collapsed));
    }
    getChildren(element?: Job): Thenable<Job[]> {
        if (this.jenkins === undefined || this.jenkins.url === "") {
            vscode.window.showInformationMessage('Please configure Jenkins URL in settings');
            return Promise.resolve([]);
        }
        if (!element) {
            let view = vscode.workspace.getConfiguration().get("jenkins.view");
            if (view === undefined || view === "All") {
                console.log("Getting all jobs");
                return this.jenkins.get_all_jobs().then(jobs => this.makeJobsFromApi(jobs));
            }
            console.log("Getting jobs in view", view);
            return this.jenkins.get_all_jobs_in_view(view).then(
                (jobs: any) => this.makeJobsFromApi(jobs));
        }
        return Promise.resolve([
            this.FinalItem("Build", element.label, {
                command: 'jenkins.build',
                title: '',
                arguments: [element.jobname]}),
            this.FinalItem("Open in Browser", element.label, {
                command: 'jenkins.open',
                title: '',
                arguments: [element.jobname]}),
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