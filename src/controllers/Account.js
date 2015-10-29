var models = require('../models');
//var Rdio = require("../rdio.js");
//var rdio = new Rdio(["so4lpco75bcuzk2khjo7equ7h4", "j5j_nctXrf4SSI3PyhynGg"]);

var Account = models.Account;

var loginPage = function(req, res){
	res.render('login', { csrfToken: req.csrfToken() });
};

var signupPage = function(req, res){
	res.render('signup', { csrfToken: req.csrfToken() });
};

var logout = function(req, res){
	req.session.destroy();
	res.redirect('/');
};

var login = function(req, res){
	if(!req.body.username || !req.body.pass){
		return res.status(400).json({error: "RAWR! ALL FIELDS ARE REQUIRED!"});
	}
	
	Account.AccountModel.authenticate(req.body.username, req.body.pass, function(err, account){
		if(err || !account){
			return res.status(401).json({error: "Wrong username or password"});
		}
		
		req.session.account = account.toAPI();
        
		//var stuff = rdio.call('getPlaybackToken', {'keys': 'a254895,a104386'});
        
		res.json({redirect:'/maker'});
	});
};

var signup = function(req, res) {
	if(!req.body.username || !req.body.pass || !req.body.pass2){
		return res.status(400).json({error: "RAWR! ALL FIELDS ARE REQUIRED!"});
	}
	
	if(req.body.pass !== req.body.pass2) {
		return res.status(400).json({error: "RAWR! PASSWORDS DO NOT MATCH!"});
	}
	
	Account.AccountModel.generateHash(req.body.pass, function(salt, hash) {
		var accountData = {
			username: req.body.username,
			salt: salt,
			password: hash
		};
		
		var newAccount = new Account.AccountModel(accountData);
		
		newAccount.save(function(err) {
			if(err){
				console.log(err);
				return res.status(400).json({ error: "AN ERROR HAS HAPPENED"});
			}
			
			req.session.account = newAccount.toAPI();
			
			res.json({redirect: '/maker'});
		});
	});
};

var musicpage = function(req, res) {
    res.render('musicpage', { csrfToken: req.csrfToken() });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.musicpage = musicpage;