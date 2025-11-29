"use strict";
var __webpack_modules__ = {
    "./node_modules/@actions/exec/lib/exec.js": function(__unused_webpack_module, exports1, __webpack_require__) {
        var __createBinding = this && this.__createBinding || (Object.create ? function(o, m, k, k2) {
            if (void 0 === k2) k2 = k;
            Object.defineProperty(o, k2, {
                enumerable: true,
                get: function() {
                    return m[k];
                }
            });
        } : function(o, m, k, k2) {
            if (void 0 === k2) k2 = k;
            o[k2] = m[k];
        });
        var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function(o, v) {
            Object.defineProperty(o, "default", {
                enumerable: true,
                value: v
            });
        } : function(o, v) {
            o["default"] = v;
        });
        var __importStar = this && this.__importStar || function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (null != mod) {
                for(var k in mod)if ("default" !== k && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
            }
            __setModuleDefault(result, mod);
            return result;
        };
        var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
            function adopt(value) {
                return value instanceof P ? value : new P(function(resolve) {
                    resolve(value);
                });
            }
            return new (P || (P = Promise))(function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator["throw"](value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
        };
        Object.defineProperty(exports1, "__esModule", {
            value: true
        });
        exports1.getExecOutput = exports1.exec = void 0;
        const string_decoder_1 = __webpack_require__("string_decoder");
        const tr = __importStar(__webpack_require__("./node_modules/@actions/exec/lib/toolrunner.js"));
        function exec(commandLine, args, options) {
            return __awaiter(this, void 0, void 0, function*() {
                const commandArgs = tr.argStringToArray(commandLine);
                if (0 === commandArgs.length) throw new Error("Parameter 'commandLine' cannot be null or empty.");
                const toolPath = commandArgs[0];
                args = commandArgs.slice(1).concat(args || []);
                const runner = new tr.ToolRunner(toolPath, args, options);
                return runner.exec();
            });
        }
        exports1.exec = exec;
        function getExecOutput(commandLine, args, options) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function*() {
                let stdout = '';
                let stderr = '';
                const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
                const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
                const originalStdoutListener = null == (_a = null == options ? void 0 : options.listeners) ? void 0 : _a.stdout;
                const originalStdErrListener = null == (_b = null == options ? void 0 : options.listeners) ? void 0 : _b.stderr;
                const stdErrListener = (data)=>{
                    stderr += stderrDecoder.write(data);
                    if (originalStdErrListener) originalStdErrListener(data);
                };
                const stdOutListener = (data)=>{
                    stdout += stdoutDecoder.write(data);
                    if (originalStdoutListener) originalStdoutListener(data);
                };
                const listeners = Object.assign(Object.assign({}, null == options ? void 0 : options.listeners), {
                    stdout: stdOutListener,
                    stderr: stdErrListener
                });
                const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), {
                    listeners
                }));
                stdout += stdoutDecoder.end();
                stderr += stderrDecoder.end();
                return {
                    exitCode,
                    stdout,
                    stderr
                };
            });
        }
        exports1.getExecOutput = getExecOutput;
    },
    "./node_modules/@actions/exec/lib/toolrunner.js": function(__unused_webpack_module, exports1, __webpack_require__) {
        var __createBinding = this && this.__createBinding || (Object.create ? function(o, m, k, k2) {
            if (void 0 === k2) k2 = k;
            Object.defineProperty(o, k2, {
                enumerable: true,
                get: function() {
                    return m[k];
                }
            });
        } : function(o, m, k, k2) {
            if (void 0 === k2) k2 = k;
            o[k2] = m[k];
        });
        var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function(o, v) {
            Object.defineProperty(o, "default", {
                enumerable: true,
                value: v
            });
        } : function(o, v) {
            o["default"] = v;
        });
        var __importStar = this && this.__importStar || function(mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (null != mod) {
                for(var k in mod)if ("default" !== k && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
            }
            __setModuleDefault(result, mod);
            return result;
        };
        var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
            function adopt(value) {
                return value instanceof P ? value : new P(function(resolve) {
                    resolve(value);
                });
            }
            return new (P || (P = Promise))(function(resolve, reject) {
                function fulfilled(value) {
                    try {
                        step(generator.next(value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function rejected(value) {
                    try {
                        step(generator["throw"](value));
                    } catch (e) {
                        reject(e);
                    }
                }
                function step(result) {
                    result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                }
                step((generator = generator.apply(thisArg, _arguments || [])).next());
            });
        };
        Object.defineProperty(exports1, "__esModule", {
            value: true
        });
        exports1.argStringToArray = exports1.ToolRunner = void 0;
        const os = __importStar(__webpack_require__("os"));
        const events = __importStar(__webpack_require__("events"));
        const child = __importStar(__webpack_require__("child_process"));
        const path = __importStar(__webpack_require__("path"));
        const io = __importStar(__webpack_require__("@actions/io"));
        const ioUtil = __importStar(__webpack_require__("@actions/io/lib/io-util"));
        const timers_1 = __webpack_require__("timers");
        const IS_WINDOWS = 'win32' === process.platform;
        class ToolRunner extends events.EventEmitter {
            constructor(toolPath, args, options){
                super();
                if (!toolPath) throw new Error("Parameter 'toolPath' cannot be null or empty.");
                this.toolPath = toolPath;
                this.args = args || [];
                this.options = options || {};
            }
            _debug(message) {
                if (this.options.listeners && this.options.listeners.debug) this.options.listeners.debug(message);
            }
            _getCommandString(options, noPrefix) {
                const toolPath = this._getSpawnFileName();
                const args = this._getSpawnArgs(options);
                let cmd = noPrefix ? '' : '[command]';
                if (IS_WINDOWS) if (this._isCmdFile()) {
                    cmd += toolPath;
                    for (const a of args)cmd += ` ${a}`;
                } else if (options.windowsVerbatimArguments) {
                    cmd += `"${toolPath}"`;
                    for (const a of args)cmd += ` ${a}`;
                } else {
                    cmd += this._windowsQuoteCmdArg(toolPath);
                    for (const a of args)cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
                else {
                    cmd += toolPath;
                    for (const a of args)cmd += ` ${a}`;
                }
                return cmd;
            }
            _processLineBuffer(data, strBuffer, onLine) {
                try {
                    let s = strBuffer + data.toString();
                    let n = s.indexOf(os.EOL);
                    while(n > -1){
                        const line = s.substring(0, n);
                        onLine(line);
                        s = s.substring(n + os.EOL.length);
                        n = s.indexOf(os.EOL);
                    }
                    return s;
                } catch (err) {
                    this._debug(`error processing line. Failed with error ${err}`);
                    return '';
                }
            }
            _getSpawnFileName() {
                if (IS_WINDOWS) {
                    if (this._isCmdFile()) return process.env['COMSPEC'] || 'cmd.exe';
                }
                return this.toolPath;
            }
            _getSpawnArgs(options) {
                if (IS_WINDOWS) {
                    if (this._isCmdFile()) {
                        let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                        for (const a of this.args){
                            argline += ' ';
                            argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
                        }
                        argline += '"';
                        return [
                            argline
                        ];
                    }
                }
                return this.args;
            }
            _endsWith(str, end) {
                return str.endsWith(end);
            }
            _isCmdFile() {
                const upperToolPath = this.toolPath.toUpperCase();
                return this._endsWith(upperToolPath, '.CMD') || this._endsWith(upperToolPath, '.BAT');
            }
            _windowsQuoteCmdArg(arg) {
                if (!this._isCmdFile()) return this._uvQuoteCmdArg(arg);
                if (!arg) return '""';
                const cmdSpecialChars = [
                    ' ',
                    '\t',
                    '&',
                    '(',
                    ')',
                    '[',
                    ']',
                    '{',
                    '}',
                    '^',
                    '=',
                    ';',
                    '!',
                    "'",
                    '+',
                    ',',
                    '`',
                    '~',
                    '|',
                    '<',
                    '>',
                    '"'
                ];
                let needsQuotes = false;
                for (const char of arg)if (cmdSpecialChars.some((x)=>x === char)) {
                    needsQuotes = true;
                    break;
                }
                if (!needsQuotes) return arg;
                let reverse = '"';
                let quoteHit = true;
                for(let i = arg.length; i > 0; i--){
                    reverse += arg[i - 1];
                    if (quoteHit && '\\' === arg[i - 1]) reverse += '\\';
                    else if ('"' === arg[i - 1]) {
                        quoteHit = true;
                        reverse += '"';
                    } else quoteHit = false;
                }
                reverse += '"';
                return reverse.split('').reverse().join('');
            }
            _uvQuoteCmdArg(arg) {
                if (!arg) return '""';
                if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) return arg;
                if (!arg.includes('"') && !arg.includes('\\')) return `"${arg}"`;
                let reverse = '"';
                let quoteHit = true;
                for(let i = arg.length; i > 0; i--){
                    reverse += arg[i - 1];
                    if (quoteHit && '\\' === arg[i - 1]) reverse += '\\';
                    else if ('"' === arg[i - 1]) {
                        quoteHit = true;
                        reverse += '\\';
                    } else quoteHit = false;
                }
                reverse += '"';
                return reverse.split('').reverse().join('');
            }
            _cloneExecOptions(options) {
                options = options || {};
                const result = {
                    cwd: options.cwd || process.cwd(),
                    env: options.env || process.env,
                    silent: options.silent || false,
                    windowsVerbatimArguments: options.windowsVerbatimArguments || false,
                    failOnStdErr: options.failOnStdErr || false,
                    ignoreReturnCode: options.ignoreReturnCode || false,
                    delay: options.delay || 10000
                };
                result.outStream = options.outStream || process.stdout;
                result.errStream = options.errStream || process.stderr;
                return result;
            }
            _getSpawnOptions(options, toolPath) {
                options = options || {};
                const result = {};
                result.cwd = options.cwd;
                result.env = options.env;
                result['windowsVerbatimArguments'] = options.windowsVerbatimArguments || this._isCmdFile();
                if (options.windowsVerbatimArguments) result.argv0 = `"${toolPath}"`;
                return result;
            }
            exec() {
                return __awaiter(this, void 0, void 0, function*() {
                    if (!ioUtil.isRooted(this.toolPath) && (this.toolPath.includes('/') || IS_WINDOWS && this.toolPath.includes('\\'))) this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
                    this.toolPath = yield io.which(this.toolPath, true);
                    return new Promise((resolve, reject)=>__awaiter(this, void 0, void 0, function*() {
                            this._debug(`exec tool: ${this.toolPath}`);
                            this._debug('arguments:');
                            for (const arg of this.args)this._debug(`   ${arg}`);
                            const optionsNonNull = this._cloneExecOptions(this.options);
                            if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                            const state = new ExecState(optionsNonNull, this.toolPath);
                            state.on('debug', (message)=>{
                                this._debug(message);
                            });
                            if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                            const fileName = this._getSpawnFileName();
                            const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                            let stdbuffer = '';
                            if (cp.stdout) cp.stdout.on('data', (data)=>{
                                if (this.options.listeners && this.options.listeners.stdout) this.options.listeners.stdout(data);
                                if (!optionsNonNull.silent && optionsNonNull.outStream) optionsNonNull.outStream.write(data);
                                stdbuffer = this._processLineBuffer(data, stdbuffer, (line)=>{
                                    if (this.options.listeners && this.options.listeners.stdline) this.options.listeners.stdline(line);
                                });
                            });
                            let errbuffer = '';
                            if (cp.stderr) cp.stderr.on('data', (data)=>{
                                state.processStderr = true;
                                if (this.options.listeners && this.options.listeners.stderr) this.options.listeners.stderr(data);
                                if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
                                    const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
                                    s.write(data);
                                }
                                errbuffer = this._processLineBuffer(data, errbuffer, (line)=>{
                                    if (this.options.listeners && this.options.listeners.errline) this.options.listeners.errline(line);
                                });
                            });
                            cp.on('error', (err)=>{
                                state.processError = err.message;
                                state.processExited = true;
                                state.processClosed = true;
                                state.CheckComplete();
                            });
                            cp.on('exit', (code)=>{
                                state.processExitCode = code;
                                state.processExited = true;
                                this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                                state.CheckComplete();
                            });
                            cp.on('close', (code)=>{
                                state.processExitCode = code;
                                state.processExited = true;
                                state.processClosed = true;
                                this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                                state.CheckComplete();
                            });
                            state.on('done', (error, exitCode)=>{
                                if (stdbuffer.length > 0) this.emit('stdline', stdbuffer);
                                if (errbuffer.length > 0) this.emit('errline', errbuffer);
                                cp.removeAllListeners();
                                if (error) reject(error);
                                else resolve(exitCode);
                            });
                            if (this.options.input) {
                                if (!cp.stdin) throw new Error('child process missing stdin');
                                cp.stdin.end(this.options.input);
                            }
                        }));
                });
            }
        }
        exports1.ToolRunner = ToolRunner;
        function argStringToArray(argString) {
            const args = [];
            let inQuotes = false;
            let escaped = false;
            let arg = '';
            function append(c) {
                if (escaped && '"' !== c) arg += '\\';
                arg += c;
                escaped = false;
            }
            for(let i = 0; i < argString.length; i++){
                const c = argString.charAt(i);
                if ('"' === c) {
                    if (escaped) append(c);
                    else inQuotes = !inQuotes;
                    continue;
                }
                if ('\\' === c && escaped) {
                    append(c);
                    continue;
                }
                if ('\\' === c && inQuotes) {
                    escaped = true;
                    continue;
                }
                if (' ' === c && !inQuotes) {
                    if (arg.length > 0) {
                        args.push(arg);
                        arg = '';
                    }
                    continue;
                }
                append(c);
            }
            if (arg.length > 0) args.push(arg.trim());
            return args;
        }
        exports1.argStringToArray = argStringToArray;
        class ExecState extends events.EventEmitter {
            constructor(options, toolPath){
                super();
                this.processClosed = false;
                this.processError = '';
                this.processExitCode = 0;
                this.processExited = false;
                this.processStderr = false;
                this.delay = 10000;
                this.done = false;
                this.timeout = null;
                if (!toolPath) throw new Error('toolPath must not be empty');
                this.options = options;
                this.toolPath = toolPath;
                if (options.delay) this.delay = options.delay;
            }
            CheckComplete() {
                if (this.done) return;
                if (this.processClosed) this._setResult();
                else if (this.processExited) this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
            }
            _debug(message) {
                this.emit('debug', message);
            }
            _setResult() {
                let error;
                if (this.processExited) if (this.processError) error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
                else if (0 === this.processExitCode || this.options.ignoreReturnCode) {
                    if (this.processStderr && this.options.failOnStdErr) error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
                } else error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
                this.done = true;
                this.emit('done', error, this.processExitCode);
            }
            static HandleTimeout(state) {
                if (state.done) return;
                if (!state.processClosed && state.processExited) {
                    const message = `The STDIO streams did not close within ${state.delay / 1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
                    state._debug(message);
                }
                state._setResult();
            }
        }
    },
    "@actions/io": function(module) {
        module.exports = require("@actions/io");
    },
    "@actions/io/lib/io-util": function(module) {
        module.exports = require("@actions/io/lib/io-util");
    },
    child_process: function(module) {
        module.exports = require("child_process");
    },
    events: function(module) {
        module.exports = require("events");
    },
    os: function(module) {
        module.exports = require("os");
    },
    path: function(module) {
        module.exports = require("path");
    },
    string_decoder: function(module) {
        module.exports = require("string_decoder");
    },
    timers: function(module) {
        module.exports = require("timers");
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
}
var __webpack_exports__ = {};
(()=>{
    const core_namespaceObject = require("@actions/core");
    const github_namespaceObject = require("@actions/github");
    var exec = __webpack_require__("./node_modules/@actions/exec/lib/exec.js");
    async function get_output(command, args) {
        core_namespaceObject.debug(`get_output: ${command} ${args.join(' ')}`);
        const output = await exec.getExecOutput(command, args);
        if (!output.stdout.endsWith('\n')) process.stdout.write('\n');
        return output.stdout.toString();
    }
    async function show_stats() {
        const disable_annotations = core_namespaceObject.getBooleanInput('disable_annotations');
        if (disable_annotations) return void core_namespaceObject.debug('annotations generation disabled');
        core_namespaceObject.debug('start sccache show starts');
        const human_stats = await core_namespaceObject.group('Get human-readable stats', async ()=>get_output(`${process.env.SCCACHE_PATH}`, [
                '--show-stats'
            ]));
        const json_stats = await core_namespaceObject.group('Get JSON stats', async ()=>get_output(`${process.env.SCCACHE_PATH}`, [
                '--show-stats',
                '--stats-format=json'
            ]));
        const stats = JSON.parse(json_stats);
        const formatted_stats = format_json_stats(stats);
        core_namespaceObject.notice(formatted_stats.notice, {
            title: `sccache stats - ${github_namespaceObject.context.job}`
        });
        core_namespaceObject.info('\nFull human-readable stats:');
        core_namespaceObject.info(human_stats);
        core_namespaceObject.summary.addHeading('sccache stats', 2);
        core_namespaceObject.summary.addTable(formatted_stats.table);
        core_namespaceObject.summary.addDetails('Full human-readable stats', '\n\n```\n' + human_stats + '\n```\n\n');
        core_namespaceObject.summary.addDetails('Full JSON Stats', '\n\n```json\n' + JSON.stringify(stats, null, 2) + '\n```\n\n');
        await core_namespaceObject.summary.write();
    }
    show_stats().catch((err)=>{
        core_namespaceObject.error(err);
        core_namespaceObject.setFailed(err.message);
    });
    function sum_stats(stats) {
        return Object.values(stats.counts).reduce((acc, val)=>acc + val, 0);
    }
    function format_duration(duration) {
        const ms = duration.nanos / 1e6;
        return `${duration.secs}s ${ms}ms`;
    }
    function format_json_stats(stats) {
        const cache_error_count = sum_stats(stats.stats.cache_errors);
        const cache_hit_count = sum_stats(stats.stats.cache_hits);
        const cache_miss_count = sum_stats(stats.stats.cache_misses);
        const total_hits = cache_hit_count + cache_miss_count + cache_error_count;
        const ratio = percentage(cache_hit_count, total_hits);
        const write_duration = format_duration(stats.stats.cache_write_duration);
        const read_duration = format_duration(stats.stats.cache_read_hit_duration);
        const compiler_duration = format_duration(stats.stats.compiler_write_duration);
        const notice_hit = plural(cache_hit_count, 'hit');
        const notice_miss = plural(cache_miss_count, 'miss', 'misses');
        const notice_error = plural(cache_error_count, 'error');
        const notice = `${ratio}% - ${notice_hit}, ${notice_miss}, ${notice_error}`;
        const table = [
            [
                {
                    data: 'Cache hit %',
                    header: true
                },
                {
                    data: `${ratio}%`
                }
            ],
            [
                {
                    data: 'Cache hits',
                    header: true
                },
                {
                    data: cache_hit_count.toString()
                }
            ],
            [
                {
                    data: 'Cache misses',
                    header: true
                },
                {
                    data: cache_miss_count.toString()
                }
            ],
            [
                {
                    data: 'Cache errors',
                    header: true
                },
                {
                    data: cache_error_count.toString()
                }
            ],
            [
                {
                    data: 'Compile requests',
                    header: true
                },
                {
                    data: stats.stats.compile_requests.toString()
                }
            ],
            [
                {
                    data: 'Requests executed',
                    header: true
                },
                {
                    data: stats.stats.requests_executed.toString()
                }
            ],
            [
                {
                    data: 'Cache writes',
                    header: true
                },
                {
                    data: stats.stats.cache_writes.toString()
                }
            ],
            [
                {
                    data: 'Cache write errors',
                    header: true
                },
                {
                    data: stats.stats.cache_write_errors.toString()
                }
            ],
            [
                {
                    data: 'Cache write duration',
                    header: true
                },
                {
                    data: write_duration
                }
            ],
            [
                {
                    data: 'Cache read hit duration',
                    header: true
                },
                {
                    data: read_duration
                }
            ],
            [
                {
                    data: 'Compiler write duration',
                    header: true
                },
                {
                    data: compiler_duration
                }
            ]
        ];
        return {
            table,
            notice
        };
    }
    function percentage(x, y) {
        return Math.round(x / y * 100 || 0);
    }
    function plural(count, base, plural1 = base + 's') {
        return `${count} ${1 === count ? base : plural1}`;
    }
})();
for(var __webpack_i__ in __webpack_exports__)exports[__webpack_i__] = __webpack_exports__[__webpack_i__];
Object.defineProperty(exports, '__esModule', {
    value: true
});
