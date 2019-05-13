(function ()
{
	const but1_elem = document.getElementById('but1');
	but1_elem.addEventListener('click', ok_click);
}());

// click a button.  show some text in the webview.
async function ok_click()
{
	const elem = document.getElementById('panel1');
    let text = elem.innerText;
    text += 'more text' ;
    elem.innerText = text ;
	text = elem.innerText;
}
