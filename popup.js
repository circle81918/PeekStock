//  document.addEventListener('DOMContentLoaded', function () {
//  	document.querySelector('#refresh').addEventListener('click', getRSS);
//  	getRSS();
//  });
//getRSS();

$(document).ready(function(){
	$.ajax({ 
		type: 'GET',
		url: "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw|tse_1102.tw|tse_1103.tw&json=1&delay=0&_=1552123547443", 
		success: function (data) { 
			var stockArray = JSON.parse(data);
			$.each(stockArray.msgArray, function(index, stock) { 
				var percent = (stock.z - stock.y) / stock.y * 100
				$('#table_head').append(`<tr><td>${stock.n}</td><td>${stock.z}</td><td>${String(percent).slice(0,3)}</td></tr>`);
			}); 
		} 
		}); 
})
