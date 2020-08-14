import * as vscode from 'vscode';

export async function get_parameters(config) {
    let paramsKey = 'hudson.model.ParametersDefinitionProperty';
    let params = config["flow-definition"].properties[0][paramsKey][0].parameterDefinitions[0];
    const stringParam = 'hudson.model.StringParameterDefinition';
    const boolParam = 'hudson.model.Boolean';
    const choiceParam = 'org.biouno.unochoice.ChoiceParameter';
    let userInputs = {};

    for (const [key, value] of Object.entries(params)) {
        let inputs = await get_string_param_inputs(value);
        if (inputs === undefined) {
            // User dismissed inputs
            return undefined;
        }
        switch(key) {
            case stringParam:
                userInputs = {...userInputs, ...inputs};
            case boolParam:
                userInputs = {...userInputs, ...inputs};
            case choiceParam:
                userInputs = {...userInputs, ...inputs};
        }
    }
    return userInputs;
}

async function get_string_param_inputs(params) {
    let results = {};
    for (const param of params) {
        let name = param.name[0];
        let defaultValue = param.defaultValue;
        let description = param.description;
        let userInput = await get_string_input(name, description, defaultValue);
        // Check if user dismissed the input box
        if (userInput === undefined) {
            return undefined;
        }
        results[name] = userInput;
    }
    return results;
}

async function get_string_input(text, description, defaultValue) {
    return await vscode.window.showInputBox({
        prompt: text + ' - ' + description,
        value: defaultValue
    });
}