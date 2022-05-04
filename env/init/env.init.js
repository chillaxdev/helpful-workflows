const core = require('@actions/core');

try {
    const jsonFilePath = core.getInput('file');
    console.log(`JSON file specified is ${jsonFilePath}`);
} catch (error) {
    core.setFailed(error.message);
}
