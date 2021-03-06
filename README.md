# jenkins-in-vscode

Trigger jenkins jobs directly from VSCode. This extension adds a sidebar view from where you can start the
builds directly.

## Features

Supports filtering jobs by views

Supports parameter inputs

## Extension Settings

This extension contributes the following settings:

* `jenkins.url`: (Required) Jenkins URL.
* `jenkins.view`: (Optional) By default, all jobs will be listed. Specifying a view will list only jobs belonging to the view.


# Notes

1) The user needs read access for `job` and `view` resources in Jenkins. To get the
parameters of a parameterized job, user also needs configure permissions for `job`
resource. Obviously, this grants the user more than required permissions,
so the following Jenkins extension is recommended which adds "ExtendedRead"
permission which provides read access on job configuration without providing
the write access - https://plugins.jenkins.io/extended-read-permission/

2) Extension has only been tested with pipeline jobs with parameters. It may work with other types of jobs as well but it is not tested.
Feel free to open a github issue if there is a problem.

## Known Issues

CSRF Protection on jenkins must be disabled for the extension to be able to make API calls to Jenkins.

## Release Notes

### 0.0.1

Initial release


### 0.0.2

Minor doc fix

### 0.0.3, 0.0.4, 0.0.5

Reduce extension size using webpack

### 0.0.6

Pressing escape or clicking outside the input box now cancels the build creation

### 0.0.7, 0.0.8, 0.0.9, 0.1.0

Show error messages when API calls fail