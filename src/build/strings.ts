/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { sortKeys } from '../common/objUtils';

const strings = {
  'attach.node.process': 'Attach to Node Process (js-debug)',
  'extension.description': 'Node.js debugging support (versions < 8.0)',
  'start.with.stop.on.entry': 'Start Debugging and Stop on Entry',
  'toggle.skipping.this.file': 'Toggle Skipping this File',
  'add.browser.breakpoint': 'Add Browser Breakpoint',
  'remove.browser.breakpoint': 'Remove Browser Breakpoint',
  'remove.browser.breakpoint.all': 'Remove All Browser Breakpoints',
  'trace.description': 'Configures what diagnostic output is produced.',
  'trace.boolean.description': "Trace may be set to 'true' to write diagnostic logs to the disk.",
  'trace.tags.description': 'Configures what types of logs are recorded.',
  'trace.logFile.description': 'Configures where on disk logs are written.',
  'trace.level.description': 'Configures the level of logs recorded.',
  'trace.console.description': 'Configures whether logs are also returned to the debug console.',

  'extensionHost.label': 'VS Code Extension Development (js-debug)',
  'extensionHost.launch.config.name': 'Launch Extension',
  'extensionHost.launch.env.description': 'Environment variables passed to the extension host.',
  'extensionHost.launch.runtimeExecutable.description': 'Absolute path to VS Code.',
  'extensionHost.launch.stopOnEntry.description':
    'Automatically stop the extension host after launch.',
  'extensionHost.snippet.launch.description': 'Launch a VS Code extension in debug mode',
  'extensionHost.snippet.launch.label': 'VS Code Extension Development',

  'chrome.address.description': 'TCP/IP address of debug port',
  'chrome.baseUrl.description':
    'Base URL to resolve paths baseUrl. baseURL is trimmed when mapping URLs to the files on disk. Defaults to the launch URL domain.',
  'chrome.cwd.description': 'Optional working directory for the runtime executable.',
  'chrome.disableNetworkCache.description':
    'Controls whether to skip the network cache for each request',
  'chrome.env.description': 'Optional dictionary of environment key/value pairs for the browser.',
  'chrome.file.description': 'A local html file to open in the browser',
  'chrome.pathMapping.description':
    'A mapping of URLs/paths to local folders, to resolve scripts in Chrome to scripts on disk',
  'chrome.port.description': 'Port to use for Chrome remote debugging.',
  'chrome.runtimeExecutable.description':
    "Either 'canary', 'stable', 'custom' or path to the browser executable. Custom means a custom wrapper, custom build or CHROME_PATH environment variable.",
  'chrome.showAsyncStacks.description': 'Show the async calls that led to the current call stack',
  'chrome.skipFiles.description':
    'An array of file or folder names, or path globs, to skip when debugging.',
  'chrome.smartStep.description':
    'Automatically step through unmapped lines in sourcemapped files. For example, code that TypeScript produces automatically when downcompiling async/await or other features.',
  'chrome.sourceMapPathOverrides.description':
    'A set of mappings for rewriting the locations of source files from what the sourcemap says, to their locations on disk. See README for details.',
  'chrome.sourceMaps.description': 'Use JavaScript source maps (if they exist).',
  'chrome.timeout.description':
    'Retry for this number of milliseconds to connect to Chrome. Default is 10000 ms.',
  'chrome.url.description': 'Will search for a tab with this exact url and attach to it, if found',
  'chrome.urlFilter.description':
    'Will search for a page with this url and attach to it, if found. Can have * wildcards.',
  'chrome.webRoot.description':
    'This specifies the workspace absolute path to the webserver root. Used to resolve paths like `/app.js` to files on disk. Shorthand for a pathMapping for "/"',
  'node.launch.args.description': 'Command line arguments passed to the program.',
  'chrome.runtimeArgs.description': 'Optional arguments passed to the runtime executable.',
  'chrome.server.description':
    "Configures a web server to start up. Takes the same configuration as the 'node' launch task.",
  'chrome.userDataDir.description':
    'By default, Chrome is launched with a separate user profile in a temp folder. Use this option to override it. Set to false to launch with your default user profile.',
  'chrome.label': 'Chrome (js-debug)',
  'chrome.launch.label': 'Chrome: Launch',
  'chrome.launch.description': 'Launch Chrome to debug a URL',
  'chrome.attach.label': 'Chrome: Attach',
  'chrome.attach.description': 'Attach to an instance of Chrome already in debug mode',

  'debug.npm.script': 'Debug NPM Script',
  'debug.npm.noWorkspaceFolder': 'You need to open a workspace folder to debug npm scripts.',
  'debug.npm.noScripts': 'No npm scripts found in your package.json',
  'debug.npm.parseError': 'Could not read {0}: {1}',
  'debug.npm.edit': 'Edit package.json',
  'debug.terminal.label': 'Create JavaScript Debug Terminal',
  'debug.terminal.program.description':
    'Command to run in the launched terminal. If not provided, the terminal will open without launching a program.',
  'debug.terminal.snippet.label': 'Run "npm start" in a debug terminal',

  'node.pauseForSourceMap.description':
    'Whether to wait for source maps to load for each incoming script. This has a performance overhead, and might be safely disabled when running off of disk, so long as `rootPath` is not disabled.',
  'node.address.description': "TCP/IP address of process to be debugged. Default is 'localhost'.",
  'node.attach.config.name': 'Attach',
  'node.attach.processId.description': 'ID of process to attach to.',
  'node.attach.attachSpawnedProcesses.description':
    'Whether to set environment variables in the attached process to track spawned children.',
  'node.attach.attachExistingChildren.description':
    'Whether to attempt to attach to already-spawned child processes.',
  'node.console.title': 'Node Debug Console',
  'node.disableOptimisticBPs.description':
    "Don't set breakpoints in any file until a sourcemap has been loaded for that file.",
  'node.label': 'Node.js (js-debug)',
  'node.launch.autoAttachChildProcesses.description':
    'Attach debugger to new child processes automatically.',
  'node.launch.config.name': 'Launch',
  'node.launch.console.description': 'Where to launch the debug target.',
  'node.launch.console.externalTerminal.description':
    'External terminal that can be configured via user settings',
  'node.launch.console.integratedTerminal.description': "VS Code's integrated terminal",
  'node.launch.console.internalConsole.description':
    "VS Code Debug Console (which doesn't support to read input from a program)",
  'node.launch.cwd.description':
    'Absolute path to the working directory of the program being debugged.',
  'node.launch.env.description':
    'Environment variables passed to the program. The value `null` removes the variable from the environment.',
  'node.launch.envFile.description':
    'Absolute path to a file containing environment variable definitions.',
  'node.launch.logging.cdp': 'Path to the log file for Chrome DevTools Protocol messages',
  'node.launch.logging.dap': 'Path to the log file for Debug Adapter Protocol messages',
  'node.launch.logging': 'Logging configuration',
  'node.launch.outputCapture.description':
    'From where to capture output messages: The debug API, or stdout/stderr streams.',
  'node.launch.program.description':
    'Absolute path to the program. Generated value is guessed by looking at package.json and opened files. Edit this attribute.',
  'node.launch.runtimeArgs.description': 'Optional arguments passed to the runtime executable.',
  'node.launch.runtimeExecutable.description':
    'Runtime to use. Either an absolute path or the name of a runtime available on the PATH. If omitted `node` is assumed.',
  'node.launch.runtimeVersion.description': 'Version of `node` runtime to use. Requires `nvm`.',
  'node.launch.useWSL.deprecation':
    "'useWSL' is deprecated and support for it will be dropped. Use the 'Remote - WSL' extension instead.",
  'node.launch.useWSL.description': 'Use Windows Subsystem for Linux.',
  'node.localRoot.description': 'Path to the local directory containing the program.',
  'node.port.description': 'Debug port to attach to. Default is 5858.',
  'node.resolveSourceMapLocations.description':
    'A list of minimatch patterns for locations (folders and URLs) in which source maps can be used to resolve local files. This can be used to avoid incorrectly breaking in external source mapped code. Patterns can be prefixed with "!" to exclude them. May be set to an empty array or null to avoid restriction.',
  'node.processattach.config.name': 'Attach to Process',
  'node.remoteRoot.description': 'Absolute path to the remote directory containing the program.',
  'node.restart.description': 'Restart session after Node.js has terminated.',
  'node.showAsyncStacks.description': 'Show the async calls that led to the current call stack.',
  'node.snippet.attach.description': 'Attach to a running node program',
  'node.snippet.attach.label': 'Node.js: Attach',
  'node.snippet.attachProcess.description':
    'Open process picker to select node process to attach to',
  'node.snippet.attachProcess.label': 'Node.js: Attach to Process',
  'node.snippet.electron.description': 'Debug the Electron main process',
  'node.snippet.electron.label': 'Node.js: Electron Main',
  'node.snippet.gulp.description':
    'Debug gulp task (make sure to have a local gulp installed in your project)',
  'node.snippet.gulp.label': 'Node.js: Gulp task',
  'node.snippet.launch.description': 'Launch a node program in debug mode',
  'node.snippet.launch.label': 'Node.js: Launch Program',
  'node.snippet.mocha.description': 'Debug mocha tests',
  'node.snippet.mocha.label': 'Node.js: Mocha Tests',
  'node.snippet.nodemon.description': 'Use nodemon to relaunch a debug session on source changes',
  'node.snippet.nodemon.label': 'Node.js: Nodemon Setup',
  'node.snippet.npm.description': 'Launch a node program through an npm `debug` script',
  'node.snippet.npm.label': 'Node.js: Launch via NPM',
  'node.snippet.remoteattach.description': 'Attach to the debug port of a remote node program',
  'node.snippet.remoteattach.label': 'Node.js: Attach to Remote Program',
  'node.snippet.yo.description':
    'Debug yeoman generator (install by running `npm link` in project folder)',
  'node.snippet.yo.label': 'Node.js: Yeoman generator',
  'node.sourceMapPathOverrides.description':
    'A set of mappings for rewriting the locations of source files from what the sourcemap says, to their locations on disk.',
  'node.sourceMaps.description': 'Use JavaScript source maps (if they exist).',
  'node.stopOnEntry.description': 'Automatically stop program after launch.',
  'node.timeout.description':
    'Retry for this number of milliseconds to connect to Node.js. Default is 10000 ms.',

  'configuration.warnOnLongPrediction':
    'Whether a loading prompt should be shown if breakpoint prediction takes a while.',
  'longPredictionWarning.message':
    "It's taking a while to configure your breakpoints. You can speed this up by updating the 'outFiles' in your launch.json.",
  'longPredictionWarning.open': 'Open launch.json',
  'longPredictionWarning.disable': "Don't show again",
  'longPredictionWarning.noFolder': 'No workspace folder open.',
  'open.loaded.script': 'Open Loaded Script',
  'outFiles.description':
    'If source maps are enabled, these glob patterns specify the generated JavaScript files. If a pattern starts with `!` the files are excluded. If not specified, the generated code is expected in the same directory as its source.',
  'pretty.print.script': 'Pretty print for debugging',
  'skipFiles.description':
    'An array of glob patterns for files to skip when debugging. The pattern `<node_internals>/**` matches all internal Node.js modules.',
  'smartStep.description':
    'Automatically step through generated code that cannot be mapped back to the original source.',

  'errors.timeout': '{0}: timeout after {1}ms',
};

export default strings;

if (require.main === module) {
  process.stdout.write(JSON.stringify(sortKeys(strings)));
}