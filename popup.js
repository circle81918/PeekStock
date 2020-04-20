setInterval(function(){ getStock(); }, 5000);

document.addEventListener('click',function(e){
    if(e.target.id == 'remove'){
        removeStock(e.target.value);
	 }
	 if(e.target.id == 'add'){
		addStock();
	 }
 });

$(document).ready(function(){
	getStock();
})

function addStock(){
	var inputStockID = document.getElementById("stockID").value;
	if(inputStockID){
		chrome.storage.local.get('stockList', function(data) {
			let setStockList = new Set(data.stockList);
			setStockList.add(inputStockID);
			let arrayStockList = Array.from(setStockList);
			chrome.storage.local.set({stockList:arrayStockList});
			location.reload();
		});
	}
}

function getStock(){
	chrome.storage.local.get('stockList', function(data) {
		let stockList = new Set(data.stockList);
		getStockInfo(stockList);
	});
}

function removeStock(stockID){
	chrome.storage.local.get('stockList', function(data) {
		let setStockList = new Set(data.stockList);
		setStockList.delete(stockID);
		let arrayStockList = Array.from(setStockList);
		chrome.storage.local.set({stockList:arrayStockList});
		location.reload();
	});
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

function clearLocalStorage(){
	chrome.storage.local.clear(function() {
	  var error = chrome.runtime.lastError;
		if (error) {
		  alert(error);
		}
	 })
   }