var Category 	= require('Category').Category,
	async 		= require('async'),
	Configr		= require('../models/Configr');

exports.index = function(req, res){
	Category.getParents(function(catList){
		res.render('index', { title: 'Index', locals: {categories: catList} });
	});
};

exports.category = function(req, res){
	var catList = new Array(),
		id = req.params.id,
		cat = new Object();
	async.parallel([
		function(callback){
			Category.getParents(function(cats){
				catList = cats;
				callback()
			});
		},
		function(callback){
			Category.get(id,function(resp){
				cat = resp;
				if(cat.sub_categories != undefined && cat.sub_categories.length > 0){
					
					var index = 0;
					var subs = cat.sub_categories;
					cat.sub_categories = new Array();
					subs.forEach(function(sub){
						Category.get(sub.catID,function(last){
							index++;
							last.sub_categories.sort(function(a, b){
								var titleA = a.catTitle.toLowerCase(),
									titleB = b.catTitle.toLowerCase();
								if(titleA < titleB){
									return -1;
								}
								if(titleA > titleB){
									return 1;
								}
								return 0;
							});
							cat.sub_categories.push(last);
							cat.sub_categories.sort(function(a, b){
								var titleA = a.catTitle.toLowerCase(),
									titleB = b.catTitle.toLowerCase();
								if(titleA < titleB){
									return -1;
								}
								if(titleA > titleB){
									return 1;
								}
								return 0;
							});
							
							if(index === subs.length){
								callback();
							}
						});
					});

				}else{
					res.redirect('/category/'+cat.catID+'/parts');
				}
			});	
		},
	],function(err, callback){
		res.render('category', { title: cat.catTitle, locals: {categories: catList, cat: cat, selected_cat: id } });
	});
};

exports.category_parts = function(req, res){
	var id = req.params.id,
		page = req.params.page,
		count = req.params.count,
		show_next = false;
		parts = new Array(),
		selected_cat = 0,
		category = new Category(),
		categories = new Array();

	if(page == undefined){ 
		page = 1; 
	}else{
		page = parseInt(page);
	}
	if(count == undefined){ 
		count = 10; 
	}else{
		count = parseInt(count);
	}
	async.parallel([
		function(callback){
			Category.getParts(id, page, count,function(response_parts){
				category.parts = parts = response_parts;
				callback();
			});
		},
		function(callback){
			Category.getParts(id, page + 1, count, function(next_parts){
				if(next_parts != undefined && next_parts.length > 0){
					show_next = true;
					callback();
				}else{
					callback();
				}
			});
		},
		function(callback){
			Category.getParents(function(catList){
				categories = catList;
				Category.getBreadcrumbs(id, function(crumbs){
					var parent;
					crumbs.forEach(function(crumb){
						if(crumb != undefined && crumb.parentID == 0){
							parent = crumb;

							Category.get(parent.catID,function(cat){
								category = cat;
								if(category.sub_categories != undefined && category.sub_categories.length > 0){
									
									var index = 0;
									
									var subs = category.sub_categories;
									category.sub_categories.forEach(function(sub){
										sub.sub_categories = new Array();
										Category.get(sub.catID,function(last){
											last.sub_categories.sort(function(a, b){
												var titleA = a.catTitle.toLowerCase(),
													titleB = b.catTitle.toLowerCase();
												if(titleA < titleB){
													return -1;
												}
												if(titleA > titleB){
													return 1;
												}
												return 0;
											});

											
											category.sub_categories[index] = last;	
											index++;
											if(index === subs.length){
												category.sub_categories.sort(function(a, b){
													var titleA = a.catTitle.toLowerCase(),
														titleB = b.catTitle.toLowerCase();
													if(titleA < titleB){
														return -1;
													}
													if(titleA > titleB){
														return 1;
													}
													return 0;
												});
												category.parts = parts;
												callback();
											}
										});
									});

								}else{
									category.parts = parts;
									callback();
								}
							});	
						}
					})

						
				})
			})
		},
	],function(err,callback){
		res.render('category-parts', { title: category.catTitle, locals: {categories: categories, category: category, parts: parts, show_next: show_next, page: page, count: count, selected_cat: id} });
	});
};

exports.select_mount = function(req, res){
	var options = [
		'Front Mount',
		'Rear Mount'
	],
	cols = new Array(),
	catList = new Array(),
	message = "Please select a mount";
	async.parallel([
		function(callback){
			parseDisplay(options,function(err, resp){
				cols = resp;
				callback();
			})
		},
		function(callback){
			Category.getParents(function(cats){
				catList = cats;
				callback();
			});
		}
	],function(err, callback){

		res.render('static_lookup', { title: 'Select Mount', locals: { categories: catList, columns: cols, message: message, next_page: '/year/' }});	
	});
	
}
exports.select_year = function(req, res){
	var options = new Array(),
		config = new Configr(req.params.mount),
		cols = new Array(),
		catList = new Array(),
		message = "Please select your vehicle's year";

	async.parallel([
		function(callback){
			config.getYears(function(years){
				parseDisplay(years,function(err, resp){
					console.log(resp);
					cols = resp;
					callback();
				})	
			})
		},
		function(callback){
			Category.getParents(function(cats){
				catList = cats;
				callback();
			});
		}
	],function(err, callback){

		res.render('static_lookup', { title: 'Select Mount', locals: { categories: catList, columns: cols, message: message, next_page: '/make/' + req.params.mount + '/' }});	
	});	
}

exports.select_make = function(req, res){
	var options = new Array(),
		config = new Configr(req.params.mount, req.params.year),
		cols = new Array(),
		catList = new Array(),
		message = "Please select your vehicle's make",
		next_page = '/model/'+ req.params.mount + '/'+ req.params.year + '/';

	async.parallel([
		function(callback){
			config.getMakes(function(makes){
				parseDisplay(makes,function(err, resp){
					cols = resp;
					callback();
				})	
			})
		},
		function(callback){
			Category.getParents(function(cats){
				catList = cats;
				callback();
			});
		}
	],function(err, callback){

		res.render('static_lookup', { title: 'Select Mount', locals: { categories: catList, columns: cols, message: message, next_page: next_page }});	
	});	
}

exports.select_model = function(req, res){
	var options = new Array(),
		config = new Configr(req.params.mount, req.params.year, req.params.make),
		cols = new Array(),
		catList = new Array(),
		message = "Please select your vehicle's model",
		next_page = '/style/'+ req.params.mount + '/'+ req.params.year + '/' + req.params.make + '/';

	async.parallel([
		function(callback){
			config.getModels(function(models){
				parseDisplay(models,function(err, resp){
					cols = resp;
					callback();
				})	
			})
		},
		function(callback){
			Category.getParents(function(cats){
				catList = cats;
				callback();
			});
		}
	],function(err, callback){

		res.render('static_lookup', { title: 'Select Moodel', locals: { categories: catList, columns: cols, message: message, next_page: next_page }});	
	});	
}

exports.select_style = function(req, res){
	var options = new Array(),
		config = new Configr(req.params.mount, req.params.year, req.params.make, req.params.model),
		cols = new Array(),
		catList = new Array(),
		message = "Please select your vehicle's style",
		next_page = '/lookup/'+ req.params.mount + '/'+ req.params.year + '/' + req.params.make + '/' + req.params.model + '/';

	async.parallel([
		function(callback){
			config.getStyles(function(styles){
				parseDisplay(styles,function(err, resp){
					cols = resp;
					callback();
				})	
			})
		},
		function(callback){
			Category.getParents(function(cats){
				catList = cats;
				callback();
			});
		}
	],function(err, callback){

		res.render('static_lookup', { title: 'Select Style', locals: { categories: catList, columns: cols, message: message, next_page: next_page }});	
	});	
}

exports.lookup = function(req, res){
	var mount = req.params.mount,
		year = req.params.year,
		make = req.params.make,
		model = req.params.model,
		style = req.params.style,
		categories = new Array(),
		parts = new Array();

	async.parallel([
		function(callback){
			var config = new Configr(mount, year, make, model, style);
			config.getParts(function(results){
				parts = results;
				callback();
			});
		},
		function(callback){
			Category.getParents(function(cats){
				categories = cats;
				callback();
			});
		},
	],function(err,callback){
		res.render('hitch-results', { title: 'Hitch Lookup', locals: { categories: categories, parts: parts }});	
	});
}

parseDisplay = function(opts,callback){
	try{
		var columnCount = 0,
			max_cols = 4,
			columns = new Array();
		columnCount = Math.ceil(opts.length / max_cols);
		var index = 0;
		for(var i = 0; i < max_cols; i++){
			var column = new Array();
			
			for(var j = 0; j < columnCount; j++){
				if(opts[index] !== undefined){
					column.push(opts[index]);
				}
				index++;
			}
			if(column !== undefined){
				columns.push(column);
			}
		}
		callback(undefined, columns);
	}catch(err){
		callback(err, new Array());
	}
}