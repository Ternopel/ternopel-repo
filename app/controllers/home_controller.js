module.exports = {
	get_home: function(req, res, next) {
		
		console.log(req.params.category);
		
		res.render('home.html',{category:req.params.category, product:req.params.product})
	}
};
