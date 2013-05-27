var url = require('url');
var util = require('util');
var sc = require('../routes/session_controller');

exports.time_mw=function(){
	return function(req,res,next){
		if (req.session.user){	
			var date = new Date();
			if ((date.getTime()-req.session.user.time)<=60000){
				console.log(req.session.user.time);
				req.session.user.time=date.getTime();
				console.log(req.session.user.time);
				next();
			} else{
				console.log("Tiempo excedido");
				delete req.session.user;
				console.log('Se ha cerrado la sesion');
				next();
			}
		}else{
			next();
		}
	}
}