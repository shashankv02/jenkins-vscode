import * as jenkinsapi from 'jenkins-api';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export class Jenkins {
    private jenkins;
    public url;

    constructor(url: String) {
        this.init(url);
    }

    init(url) {
        console.log("Initializing jenkins with url");
        this.url = url;
        this.jenkins = jenkinsapi.init(url);
    }

    callback(resolve, reject) {
        return function(err: any, data: any) {
            if (err) { return reject(err); }
            return resolve(data);
        };
    }


    get_all_jobs_in_view(view: any) {
        return new Promise((resolve, reject) => {
            this.jenkins.all_jobs_in_view(view, function(err: any, data: any) {
                if (err){ return reject(err); }
                return resolve(data);
            });
        });
    }

    get_job_xml(name: String) {
        return new Promise((resolve, reject) => {
            this.jenkins.get_config_xml(name, function(err: any, data: any) {
                if (err){ return reject(err); }
                return resolve(data);
              });
        });
    }


    build_with_params(name: String, params: Object): Promise<Object> {
        return new Promise((resolve, reject) => {
            this.jenkins.build_with_params(name, params, function(err: any, data: any) {
                if (err) { return reject(err); }
                return resolve(data);
            });
        });
    }

    get_queue_item(number: String) {
        return new Promise((resolve, reject) => {
            this.jenkins.queue_item(number, this.callback(resolve, reject));
        });
    }


    get_all_builds(job: String, user: String) {
        return new Promise((resolve, reject) => {
            this.jenkins.all_builds(job, this.callback(resolve, reject));
        });
    }

    get_all_jobs() {
        return new Promise((resolve, reject) => {
            this.jenkins.all_jobs(this.callback(resolve, reject));
        });
    }
}
