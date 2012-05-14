var http = require('http');

var Configr = function(mount, year, make, model, style){
	this.mount = mount || '',
	this.year = year || 0,
	this.make = make ||'',
	this.model = model || '',
	this.style = style || ''
}

Configr.prototype = {
	getYears: function(callback){
		var options = {
			host: 'api.curtmfg.com',
			path: '/v2/GetYear?dataType=json&mount=' + encodeURIComponent(this.mount)
		};
		http.get(options, function(res){
			var str = '';
			res.on('data',function(chunk){
				str += chunk;
			});

			res.on('end',function(){
				var years = JSON.parse(str);
				callback(years);
			})
		}).on('error',function(e){
			console.log("Got error: " + e.message);
			callback('[]');
		});
	},
	getMakes: function(callback){
		var query  = '/v2/GetMake?dataType=json&mount=' + encodeURIComponent(this.mount);
			query += '&year=' + encodeURIComponent(this.year);
		var options = {
			host: 'api.curtmfg.com',
			path: query
		};
		http.get(options,function(res){
			var str = '';
			res.on('data',function(chunk){
				str += chunk;
			});

			res.on('end',function(){
				var makes = JSON.parse(str);
				callback(makes);
			});
		}).on('error',function(e){
			console.log('Got error: ', e.message);
			callback('[]');
		});
	},
	getModels: function(callback){
		var query  = '/v2/GetModel?dataType=json&mount=' + encodeURIComponent(this.mount);
			query += '&year=' + encodeURIComponent(this.year);
			query += '&make=' + encodeURIComponent(this.make);
		var options = {
			host: 'api.curtmfg.com',
			path: query
		};
		http.get(options,function(res){
			var str = '';
			res.on('data',function(chunk){
				str += chunk;
			});

			res.on('end',function(){
				var models = JSON.parse(str);
				callback(models);
			});
		}).on('error',function(e){
			console.log('Got error: ', e.message);
			callback('[]');
		});
	},
	getStyles: function(callback){
		var query  = '/v2/GetStyle?dataType=json&mount=' + encodeURIComponent(this.mount);
			query += '&year=' + encodeURIComponent(this.year);
			query += '&make=' + encodeURIComponent(this.make);
			query += '&model=' + encodeURIComponent(this.model);
		var options = {
			host: 'api.curtmfg.com',
			path: query
		};
		http.get(options,function(res){
			var str = '';
			res.on('data',function(chunk){
				str += chunk;
			});

			res.on('end',function(){
				var models = JSON.parse(str);
				callback(models);
			});
		}).on('error',function(e){
			console.log('Got error: ', e.message);
			callback('[]');
		});
	},
	getParts: function(callback){
		var query  = '/v2/GetParts?dataType=json&mount=' + encodeURIComponent(this.mount);
			query += '&year=' + encodeURIComponent(this.year);
			query += '&make=' + encodeURIComponent(this.make);
			query += '&model=' + encodeURIComponent(this.model);
			query += '&style=' + encodeURIComponent(this.style);
		var options = {
			host: 'api.curtmfg.com',
			path: query
		};
		http.get(options,function(res){
			var str = '';
			res.on('data',function(chunk){
				str += chunk;
			});

			res.on('end',function(){
				var parts = JSON.parse(str);
				callback(parts);
			});
		}).on('error',function(e){
			console.log('Got error: ', e.message);
			callback('[]');
		});
	}
};

module.exports = Configr;