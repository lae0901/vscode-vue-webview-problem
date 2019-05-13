// webview-wrkobj/media/common.js

// --------------------- as400_srcfList -----------------------
function as400_srcfList(objName, libName)
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
		const url_query = url + '?' + query;

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
