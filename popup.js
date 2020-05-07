var bg = chrome.extension.getBackgroundPage();

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
		let stockData = "";
		let color = "black";
		for (key in items)
		{
			if (items[key].change < 0)
				color = "green"
			if (items[key].change > 0)
				color = "red"
			stockData  += `<tr align='center'><td>${items[key].name}</td><td>${items[key].currentPrice}</td><td><font color="${color}">${items[key].change}</td><td><button class="btn btn-outline-danger btn-sm" id='remove' value="${key}">Remove</button></td></tr>`;
		}
		document.getElementById("table_body").innerHTML = stockData;
	});
 }

 chrome.storage.onChanged.addListener(function(changes,areaName) {
	updateStockTable();
});
