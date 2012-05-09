var Category = require('Category').Category;

/*
 * GET home page.
 */

exports.index = function(req, res){
	Category.getParents(function(catList){
		res.render('index', { title: 'Index', locals: {catList: catList} });
	});
};

exports.category = function(req, res){
	Category.getParents(function(catList){
		var id = req.params.id;
		Category.get(id,function(cat){

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
							res.render('category', { title: cat.catTitle, locals: {catList: catList, cat: cat, selected_cat: id } });		
						}
					});
				});

			}else{
				res.redirect('/category/'+cat.catID+'/parts');
			}
		});	
	});

};

exports.category_parts = function(req, res){
	var id = req.params.id,
		page = req.params.page,
		count = req.params.count,
		show_next = false;
		parts = new Array();

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
	Category.getParts(id, page, count,function(response_parts){
		parts = response_parts;
		Category.getParts(id, page + 1, count, function(next_parts){
			if(next_parts != undefined && next_parts.length > 0){
				show_next = true;
			}
			Category.getParents(function(catList){
				Category.getBreadcrumbs(id, function(crumbs){
					var parent;
					crumbs.forEach(function(crumb){
						if(crumb != undefined && crumb.parentID == 0){
							parent = crumb;

							Category.get(parent.catID,function(cat){
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
												cat.parts = parts;
												res.render('category-parts', { title: cat.catTitle, locals: {catList: catList, cat: cat, parts: parts, show_next: show_next, page: page, count: count, selected_cat: id} });
											}
										});
									});

								}else{
									cat.parts = parts;
									res.render('category-parts', { title: cat.catTitle, locals: {catList: catList, cat: cat, parts: parts, show_next: show_next, page: page, count: count, selected_cat: id } });		
								}
							});	
						}
					})

						
				})
			})
		});
	})
};