let global_vscode = null ;

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    global_vscode = acquireVsCodeApi();
    const vscode = global_vscode ;

    const oldState = vscode.getState();

    const counter = document.getElementById('lines-of-code-counter');
    console.log(oldState);
    let currentCount = (oldState && oldState.count) || 0;
    counter.textContent = currentCount;

    if ( 1 == 2 )
    {
    setInterval(() => {
        counter.textContent = currentCount++;

        // Update state
        vscode.setState({ count: currentCount });

        // Alert the extension when the cat introduces a bug
        if (Math.random() < Math.min(0.001 * currentCount, 0.05)) {
            // Send a message back to the extension
            vscode.postMessage({
                command: 'alert',
                text: '🐛  on line ' + currentCount
            });
        }
    }, 100);
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'refactor':
                currentCount = Math.ceil(currentCount * 0.5);
                counter.textContent = currentCount;
                break;
        }
    });

    const but1_elem = document.getElementById('but1');
    but1_elem.addEventListener('click', ok_click);

}());

async function ok_click()
{
	const elem = document.getElementById('but1');
	let text = elem.innerText;
	if (text == 'ok')
			elem.innerText = 'cancel';
	else
			elem.innerText = 'ok';
	text = elem.innerText;

	const vscode = global_vscode ;
	vscode.setState({ text });

	const objName = 'Q*';
	const libName = 'SR';
	const object_list = await as400_srcfList(objName, libName);
	text = 'number objects:' + object_list.length ;

	// Send a message back to the extension
	vscode.postMessage({
		command: 'alert',
		text: text
	});
}

// ------------------------- object_toQueryString ---------------------------------
function object_toQueryString(obj)
{
    const qs = Object.keys(obj)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
    return qs;
}

// --------------------- as400_srcfList_fetch -----------------------
function as400_srcfList_fetch(objName, libName)
{
	const promise = new Promise(async (resolve, reject) =>
	{
    const libl = 'couri7 aplusb1fcc qtemp';
    const url = 'http://173.54.20.170:10080/coder/common/json_getManyRows.php';
		const params =
		{
			libl, proc: 'utl8020_srcfList',
			parm1: objName, parm2: libName, debug: 'N'
    };
    const query = object_toQueryString(params);
    const url_query = url + '?' + query ;

		const response = await fetch(url_query,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		});

    const respText = await response.text();
    const rows = JSON.parse(respText);

    resolve(rows);
	});

	return promise;
}
