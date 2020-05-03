var bg = chrome.extension.getBackgroundPage();

// setInterval( function() {
// 	updateStockTable(function(){
// 		location.reload();
// 	});
// }, 5000);

$(document).ready(function(){
	updateStockTable();
})

document.addEventListener('click',function(e){
    if(e.target.id == 'remove'){
		bg.removeStock(e.target.value);
		location.reload();
	 }
	 if(e.target.id == 'add'){
		var stockID = document.getElementById("stockID").value;
		bg.addStock(stockID);
	 }
 });

 function updateStockTable(){
	chrome.storage.local.get(null, function(items){
		var stockData = "";
		for (key in items)
		{
			stockData  += `<tr><td>${items[key].name}</td><td>${items[key].currentPrice}</td><td>${String(items[key].change).slice(0,3)}</td><td><button class="btn btn-outline-danger btn-sm" id='remove' value="${key}">Remove</button></td></tr>`;
		}
		document.getElementById("table_body").innerHTML = stockData;
	});
 }

 chrome.storage.onChanged.addListener(function(changes,areaName) {
	updateStockTable();
});
