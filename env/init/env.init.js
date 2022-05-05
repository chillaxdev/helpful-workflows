const core = require('@actions/core');
const fs = require('fs');

const parseVersion = (jsonFilePath) => {
    // Parse JSON file
    const fileData = fs.readFileSync(jsonFilePath);
    // console.debug(`File contents: ${fileData}`);
    const json = JSON.parse(fileData);
    let version = "";
    if ('version' in json) {
        if (typeof json.version !== 'string') {
            throw new Error(`Version is not a string`);
        }
        version = json.version;
    }
    return 'v' + version;
};

const envVarsExported = [];
const exportEnvVariable = (name, value) => {
    const varName = 'ENV_' + name.toUpperCase();
    if (envVarsExported.includes(varName)) {
        throw new Error(`Duplicate env variable ${varName} found. Please check your JSON file.`);
    }
    envVarsExported.push(varName);
    console.log(`Exporting ${varName}=${value}`);
    core.exportVariable(varName, value);
};

try {
    const jsonFilePath = core.getInput('file');
    console.log(`JSON file specified is ${jsonFilePath}`);
    let version = parseVersion(jsonFilePath);
    if (version === "v") {
        console.log(`No version specified in ${jsonFilePath}. Attempting to read version from the local package.json file.`);
        version = parseVersion('./package.json');
        if (version === "v") {
            throw new Error(`No version specified in package.json`);
        }
    }
    console.log(`Version is ${version}`);
    // console.log(`Tag is ${}`)
    const githubRef = process.env.GITHUB_REF;
    const branchName = githubRef.split('/').reverse()[0];
    console.log(`Branch is ${branchName}`);
    const cd = JSON.parse(fs.readFileSync(jsonFilePath));
    exportEnvVariable('version', version);
    if ('image' in cd) {
        exportEnvVariable('image', cd.image);
        exportEnvVariable('image_tag', cd.image + ':' + version);
    }
    if ('vars' in cd) {
        Object.keys(cd.vars).forEach(key => {
            const value = cd.vars[key];
            if (branchName in value) {
                exportEnvVariable(key, value[branchName]);
            } else {
                throw new Error(`${key} has no value for branch ${branchName}`);
            }
        });
    }
} catch (error) {
    core.setFailed(error.message);
}
