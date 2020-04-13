document.addEventListener('click',function(e){
    if(e.target.id == 'remove'){
        removeStock(e.target.value);
	 }
	 if(e.target.id == 'submit'){
		addStock();
	 }
 });

$(document).ready(function(){
	chrome.storage.local.get('stockList', function(data) {
		var stockList = new Set(data.stockList);
		getStockInfo(stockList);
	});
})

function addStock(){
	var inputStockID = document.getElementById("stockID").value;
	if(inputStockID){
		chrome.storage.local.get('stockList', function(data) {
			let stockList = new Set(data.stockList);
			stockList.add(inputStockID);
			let arrayStockList = Array.from(stockList);
			chrome.storage.local.set({stockList:arrayStockList});
		});
	}
}

function removeStock(stockID){
	chrome.storage.local.get('stockList', function(data) {
		let stockList = new Set(data.stockList);
		stockList.delete(stockID);
		let arrayStockList = Array.from(stockList);
		chrome.storage.local.set({stockList:arrayStockList});
		location.reload();
	});
}

function clearLocalStorage(){
	chrome.storage.local.clear(function() {
	  var error = chrome.runtime.lastError;
		if (error) {
		  alert(error);
		}
	 })
   }

function getStockInfo(stockList){
	var queryUrl = "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch="
	stockList.forEach(stockID => {
		queryUrl += "tse_" + stockID + ".tw|"
	});
	$.ajax({ 
		type: 'GET',
		url: queryUrl,
		success: function (data) {
			var stockArray = JSON.parse(data);
			var stockValue = "";
			$.each(stockArray.msgArray, function(index, stock) { 
				var percent = (stock.z - stock.y) / stock.y * 100
				stockValue  += `<tr><td>${stock.n}</td><td>${stock.z}</td><td>${String(percent).slice(0,3)}</td><td><button class="btn btn-outline-danger btn-sm" id='remove' value="${stock.c}">Remove</button></td></tr>`;
			});
			document.getElementById("table_body").innerHTML = stockValue;
		},
	}); 
}