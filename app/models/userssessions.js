module.exports = function (orm, db, models) {

	models.userssessions = db.define("users_sessions", { 
			id:				{ type: 'serial', key: true}, 
			token:		 	{ type: 'text', required: true },
			last_access: 	{ type: 'date', required: true, time: true },
		},
		{
			methods: {
			},
			validations: {
				
			}
		}
	);	
};
