var Category;
Category.prototype = {

	getParents: function(callback){
		var catList = JSON.parse('http://api.curtmfg.com/v2/GetParentCategories?dataType=JSON');
		callback(catList);
	}


}

module.exports.Category = Category;