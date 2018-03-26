
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		//return the unique id for the user
		return done(null, user.username);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function(username, done) {
		//return the user object
		return done(null, users[username]);

	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			console.log("inside login p-int");
			if(!users[username]){
				console.log('User Not Found with username '+ username);
				return done('User not found', false);
			}

			//check if valid password
			if(!isValidPassword(users[username], password)){
				
				console.log('Invalid password '+username);
				return done(null, false);
			}
			//sucessfully authenticated
			console.log("sucessfully authenticated");

			return done('Login successful', users[username]);
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {

			User.findOne({ username : username}, function(err, user){
				if(err){
					return done(err,false);
				}
				if(user){
					return done('username taken', false);
				}

				var user = new User();
				user.username = username;
				user.password = createHash(password);

				user.save(function(err, user){
					if(err){
						return done(err,false);
					}
					console.log('Successfully returned a user '+username);
					return done(null, user);
				});
			});
	
		
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};


