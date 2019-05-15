# demo app. vscode-vue-webview-problem

This app was coded to illustrate a problem I am having using vue.js in a vscode extension webview. I want to use vue.js in the webview page.  It looks like vue.js loads correctly. The vue.js mounted method runs. But vue.js does not do its thing and render HTML on the web page.

How to use vue.js within a vscode extension webview? Is the problem because the webview runs within an iframe?

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

