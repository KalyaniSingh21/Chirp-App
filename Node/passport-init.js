
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
		console.log('serializing user:',user._id);
		//return the unique id for the user
		return done(null, user._id);
	});

	//Desieralize user will call with the unique id provided by serializeuser
	passport.deserializeUser(function(id, done) {
		User.findById(id,function(err, user){
			if(err){
				return done(err, false);
			}
			if(!user){
				return('user not found',false);
			}

			return done(null, user);

		});

	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			
			User.findOne({username : username}, function(err, user){
				if(err){
					return done(err, false);
				}

				if(!user){
					return done('User :'+username+' not found', false);
				}
				
				if(!isValidPassword(user, password)){
					return done('Incorrect Password', false);
				}

				return done(null, user);

			});
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


