import * as path from 'path';
import * as vscode from 'vscode';

let global_webViewPanel: vscode.WebviewPanel;
let global_disposables: vscode.Disposable[] = [];
const global_viewType = 'wrkobjWebview';

const cats = {
	'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
	'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
	'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
};

export function activate(context: vscode.ExtensionContext)
{
	const disposable = vscode.commands.registerCommand('rock.webview', () =>
	{
		global_createPanel(context.extensionPath);
	});
	context.subscriptions.push( disposable ) ;
}

function global_getNonce()
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

function global_getWebviewContent(catGif: string, extPath: string)
{
	const main_uri = scriptUri_builder( extPath, 'media', 'main.js') ;
	const common_uri = scriptUri_builder( extPath, 'media', 'common.js') ;
	const app_uri = scriptUri_builder( extPath, 'media', 'app.js') ;
	const vue_uri = scriptUri_builder( extPath, 'media', 'vue.min.js') ;

	// Use a nonce to whitelist which scripts can be run
	const nonce = global_getNonce();

//	<script  nonce="${nonce}" src = "https://code.jquery.com/jquery-3.3.1.min.js" > </script>
	// <script nonce="${nonce} src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.21/vue.min.js">
	// </script>


	return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="Content-Security-Policy" 
			content="default-src 'none'; connect-src http://173.54.20.170:10080/;  img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>wrkobj webview</title>
		</head>
		<body>
			<img src="${catGif}" width="300" />
			<h1 id="lines-of-code-counter">0</h1>

			<button id="but1">button</button>

			<div id="app">
			{{message}}
			<button @click="getObjectList_click()">get objects</button>
			</div>

			<script nonce="${nonce}" src="${vue_uri}"></script>
			<script nonce="${nonce}" src="${common_uri}"></script>
			<script nonce="${nonce}" src="${main_uri}"></script>
			<script nonce="${nonce}" src="${app_uri}"></script>

		</body>
		</html>`;
}

function global_constructor(extensionPath: string)
{
}

function global_dispose()
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

function global_createPanel(extensionPath: string) {
	console.log('in createPanel. version 9b.');

	// create a new panel.
	const panel = vscode.window.createWebviewPanel(
		global_viewType, 'wrkobj webview',
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
	const catName = 'Testing Cat';
	const catGif = cats[catName];
	const htmlText = global_getWebviewContent(catGif, extensionPath);
	global_webViewPanel.title = catName;
	global_webViewPanel.webview.html = htmlText;

	// Listen for when the panel is disposed
	// This happens when the user closes the panel or when the panel is closed programatically
	global_webViewPanel.onDidDispose(() => global_dispose(), null, global_disposables);

	// extension receives messages that the webview has sent using postMessage
	global_webViewPanel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
				case 'alert':
					vscode.window.showErrorMessage(message.text);
					return;
			}
		},
		null, global_disposables
	);
}
