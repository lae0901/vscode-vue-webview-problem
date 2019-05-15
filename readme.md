# demo app. vscode-vue-webview-problem

How to use vue.js within a vscode extension webview?

This extension app illustrates the problem. Why does vue.js not render in the webview iframe? Note that vue.js runs without error.  The mounted function runs the console.log statement. Only nothing is rendered in the webview page.

**To run this extension:**
* download to your PC
* open the folder in vscode
* `npm install`
* `npm run compile`
* f5 to start debugging the extension
* in the debug instance, CTRL+SHIFT+P for the command palette
* find and run command `vue webview`
* the button is in the webview just to show that the extension works.  But why does vue.js not render its output?
* in the debug instance of vscode run command `developer: open webview developer tools` to see if there are any javascript errors running the webview.

**how the extension works**

Within `extension.ts` is a method `getWebviewContent` that builds the HTML of the webview.

The .js files are included in the HTML of the webview using the `<script>` tag. The `nonce= attribute` is needed to include the script into the webview.

