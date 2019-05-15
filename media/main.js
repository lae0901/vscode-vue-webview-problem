(function ()
{
	const but1_elem = document.getElementById('but1');
	but1_elem.addEventListener('click', but1_click);
}());

// click a button.  show some text in the webview.
async function but1_click()
{
	const elem = document.getElementById('but1');
    let text = elem.innerText;
    text = Number(text) + 1 ;
    elem.innerText = text ;
}
