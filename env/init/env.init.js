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

const isGithubSecret = (varName) => varName.startsWith("$");

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

const outputsExported = [];
const exportOutput = (name, value) => {
    if (outputsExported.includes(name)) {
        throw new Error(`Duplicate output ${name} found. Please check your JSON file.`);
    }
    outputsExported.push(name);
    console.log(`Output ${name}=${value}`);
    core.setOutput(name, value);
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
    if ((typeof branchName !== 'string') || (branchName.length === 0)) {
        throw new Error(`Invalid Branch Name: ${branchName}`);
    }
    console.log(`Branch is ${branchName}`);
    const cd = JSON.parse(fs.readFileSync(jsonFilePath));
    exportEnvVariable('version', version);
    exportEnvVariable('branch', branchName);
    const fullVersionName = `${version}-${branchName}`;
    exportEnvVariable('version_full', fullVersionName);
    if ('image' in cd) {
        exportEnvVariable('image', cd.image);
        const imageTag = cd.image + ':' + fullVersionName;
        exportEnvVariable('image_tag', imageTag);
        exportOutput("imageTag", imageTag);
    }
    if ('vars' in cd) {
        Object.keys(cd.vars).forEach(varName => {
            const varValue = cd.vars[varName];
            if (branchName in varValue) {
                const branchValue = varValue[branchName];
                // Check if the value is a Github secret
                if (isGithubSecret(varName)) {
                    // Set Secret value as output
                    exportOutput(varName.slice(1), branchValue);
                } else {
                    exportEnvVariable(varName, branchValue);
                }
            } else {
                throw new Error(`${varName} has no value for branch ${branchName}`);
            }
        });
    }
} catch (error) {
    core.setFailed(error.message);
}
