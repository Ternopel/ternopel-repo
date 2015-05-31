module.exports = function (orm, db, models) {

	models.users = db.define("users", { 
			id:				{ type: 'serial', key: true}, 
			email_address: 	{ type: 'text', required: true },
			password: 		{ type: 'text', required: true },
			first_name:		{ type: 'text', required: false },
			last_name:		{ type: 'text', required: false },
			role_id:		{ type: 'integer', size:8, required: false },
		},
		{
			methods: {
				fullName: function() {
					return this.firstName + ' ' + this.lastName;
				}
			},
			validations: {
				
			}
		}
	);	
};
