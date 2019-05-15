import * as path from 'path';
import * as vscode from 'vscode';

let global_webViewPanel: vscode.WebviewPanel;
let global_disposables: vscode.Disposable[] = [];
const global_viewType = 'vueWebview';

export function activate(context: vscode.ExtensionContext)
{
	const disposable = vscode.commands.registerCommand('vue.webview', () =>
	{
		createPanel(context.extensionPath);
	});
	context.subscriptions.push( disposable ) ;
}

function getNonce()
{
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// ------------------------ scriptUri_builder ---------------------------
function scriptUri_builder( 
					extPath : string, mediaPath : string, scriptFile : string ) : vscode.Uri
{
	// Local path to main script run in the webview
	const scriptPathOnDisk = vscode.Uri.file(
		path.join(extPath, mediaPath, scriptFile)
	);

	// And the uri we use to load this script in the webview
	const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

	return scriptUri ;
}

function getWebviewContent(extPath: string)
{
	const main_uri = scriptUri_builder( extPath, 'media', 'main.js') ;
	const app_uri = scriptUri_builder( extPath, 'media', 'app.js') ;
	const vue_uri = scriptUri_builder( extPath, 'media', 'vue.min.js') ;

	// Use a nonce to whitelist which scripts can be run
	const nonce = getNonce();

	return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="Content-Security-Policy" 
			content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>vue webview</title>
		</head>
		<body>

			<button id="but1">0</button>
			<div id="panel1"></div>
			<br>
			<span>vue should render a button and message below.</span>

			<div id="app">
			{{message}}
			<button @click="ok_click()">ok</button>
			</div>

			<script nonce="${nonce}" src="${vue_uri}"></script>
			<script nonce="${nonce}" src="${main_uri}"></script>
			<script nonce="${nonce}" src="${app_uri}"></script>

		</body>
		</html>`;
}

function global_constructor(extensionPath: string)
{
}

function dispose()
{
	// Clean up our resources
	global_webViewPanel.dispose();

	while (global_disposables.length)
	{
		const x = global_disposables.pop();
		if (x) {
			x.dispose();
		}
	}
}

function createPanel(extensionPath: string)
{
	// create a new panel.
	const panel = vscode.window.createWebviewPanel( global_viewType, 'vue webview',
		vscode.ViewColumn.One,
		{
			// Enable javascript in the webview
			enableScripts: true,

			// And restrict the webview to only loading content from our extension's `media` directory.
			localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
		}
	);

	global_webViewPanel = panel;

	// Set the webview's initial html content
	const htmlText = getWebviewContent(extensionPath);
	global_webViewPanel.title = 'Testing vue in webview';
	global_webViewPanel.webview.html = htmlText;

	// Listen for when the panel is disposed
	// This happens when the user closes the panel or when the panel is closed programatically
	global_webViewPanel.onDidDispose(() => dispose(), null, global_disposables);
}
