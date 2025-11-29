"use strict";
var __webpack_exports__ = {};
const core_namespaceObject = require("@actions/core");
const tool_cache_namespaceObject = require("@actions/tool-cache");
const github_namespaceObject = require("@actions/github");
const external_fs_namespaceObject = require("fs");
const external_crypto_namespaceObject = require("crypto");
async function setup() {
    let version = core_namespaceObject.getInput('version');
    if (0 === version.length) {
        const token = core_namespaceObject.getInput('token', {
            required: true
        });
        const octokit = (0, github_namespaceObject.getOctokit)(token, {
            baseUrl: 'https://api.github.com'
        });
        const release = await octokit.rest.repos.getLatestRelease({
            owner: 'mozilla',
            repo: 'sccache'
        });
        version = release.data.tag_name;
    }
    core_namespaceObject.info(`try to setup sccache version: ${version}`);
    let sccacheHome = (0, tool_cache_namespaceObject.find)('sccache', version);
    if ('' === sccacheHome) {
        const sccachePath = await downloadSCCache(version);
        if (sccachePath instanceof Error) return void core_namespaceObject.setFailed(sccachePath.message);
        {
            const dirname = getDirname(version);
            sccacheHome = await (0, tool_cache_namespaceObject.cacheDir)(`${sccachePath}/${dirname}`, 'sccache', version);
            core_namespaceObject.info(`sccache cached to: ${sccacheHome}`);
        }
    } else core_namespaceObject.info(`find sccache at: ${sccacheHome}`);
    core_namespaceObject.addPath(`${sccacheHome}`);
    core_namespaceObject.exportVariable('SCCACHE_PATH', `${sccacheHome}/sccache`);
    core_namespaceObject.exportVariable('ACTIONS_CACHE_SERVICE_V2', "on");
    core_namespaceObject.exportVariable('ACTIONS_RESULTS_URL', process.env.ACTIONS_RESULTS_URL || '');
    core_namespaceObject.exportVariable('ACTIONS_RUNTIME_TOKEN', process.env.ACTIONS_RUNTIME_TOKEN || '');
}
async function downloadSCCache(version) {
    const filename = getFilename(version);
    const downloadUrl = `https://github.com/mozilla/sccache/releases/download/${version}/${filename}`;
    const sha256Url = `${downloadUrl}.sha256`;
    core_namespaceObject.info(`sccache download from url: ${downloadUrl}`);
    const sccachePackage = await (0, tool_cache_namespaceObject.downloadTool)(downloadUrl);
    const sha256File = await (0, tool_cache_namespaceObject.downloadTool)(sha256Url);
    const fileBuffer = await external_fs_namespaceObject.promises.readFile(sccachePackage);
    const hash = external_crypto_namespaceObject.createHash('sha256');
    hash.update(fileBuffer);
    const calculatedChecksum = hash.digest('hex');
    const providedChecksum = (await external_fs_namespaceObject.promises.readFile(sha256File)).toString().trim();
    if (calculatedChecksum !== providedChecksum) return Error('Checksum verification failed');
    core_namespaceObject.info(`Correct checksum: ${calculatedChecksum}`);
    let sccachePath;
    sccachePath = 'zip' == getExtension() ? await (0, tool_cache_namespaceObject.extractZip)(sccachePackage) : await (0, tool_cache_namespaceObject.extractTar)(sccachePackage);
    core_namespaceObject.info(`sccache extracted to: ${sccachePath}`);
    return sccachePath;
}
function getFilename(version) {
    return `sccache-${version}-${getArch()}-${getPlatform()}.${getExtension()}`;
}
function getDirname(version) {
    return `sccache-${version}-${getArch()}-${getPlatform()}`;
}
function getArch() {
    switch(process.arch){
        case 'x64':
            return 'x86_64';
        case 'arm64':
            return 'aarch64';
        case 'arm':
            return 'armv7';
        default:
            return Error(`Unsupported arch "${process.arch}"`);
    }
}
function getPlatform() {
    switch(process.platform){
        case 'darwin':
            return 'apple-darwin';
        case 'win32':
            return 'pc-windows-msvc';
        case 'linux':
            if ('arm' == process.arch) return 'unknown-linux-musleabi';
            return 'unknown-linux-musl';
        default:
            return Error(`Unsupported platform "${process.platform}"`);
    }
}
function getExtension() {
    return 'tar.gz';
}
setup().catch((err)=>{
    core_namespaceObject.error(err);
    core_namespaceObject.setFailed(err.message);
});
for(var __webpack_i__ in __webpack_exports__)exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
