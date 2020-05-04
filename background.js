setInterval(updateStock, 5000);

function addStock(stockID){
	if(stockID){
		chrome.storage.local.get(stockID, function(data) {
			if (typeof data[stockID] == 'undefined'){
				var defaultValue = {name : stockID, currentPrice : "0.0", change : "0.0"};
				data[stockID] = defaultValue;
				chrome.storage.local.set(data);
			}
			else{
				alert(stockID + " already exists! ");		
			}
		});
	}
}

function removeStock(stockID){
	chrome.storage.local.remove(stockID);
}

function updateStock(){
	chrome.storage.local.get(null, function(stockList){
		let queryUrl = "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=";
		for (stockID in stockList) { queryUrl += "tse_" + stockID + ".tw|" }
		$.ajax({ 
            type: 'GET',
            url:queryUrl, 
            success: function (data) {
				let stockArray = JSON.parse(data);
				let stockData = {};
				$.each(stockArray.msgArray, function(index, stock) { 
					if(stock.z != '-'){
						let changePercent = (stock.z == stock.y ) ? 0.0 : (stock.z - stock.y) / stock.y * 100;
						let updateValue = {name : stock.n, currentPrice : stock.z, change : String(changePercent.toFixed(2))};
						stockData[stock.c] = updateValue;
					}
				});
				chrome.storage.local.set(stockData);
				//callback();
            }
        });
	});
}

function clearLocalStorage(){
	chrome.storage.local.clear(function() {
	  	var error = chrome.runtime.lastError;
		if (error) {
		  alert(error);
		}
	});
}