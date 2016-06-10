module.exports = function(app) {
var cloudantDB = app.dataSources.cloudant;

cloudantDB.automigrate('Client', function(err) {
   if (err) throw (err);
   var Client = app.models.Client;

   Client.create([
    {username: 'client', email: 'client@gmail.com', password: '1234'}
  ], function(err, users) {
    // if (err) return debug(err);
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    //create the client role
    Role.create({
      name: 'client'
    }, function(err, role) {
      // if (err) return debug(err);
       //make admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw (err);
      });
    });

  });
});

cloudantDB.automigrate('Contractor', function(err) {
   if (err) throw (err);
   var Contractor = app.models.Contractor;

   Contractor.create([
    {username: 'contractor', email: 'contractor@gmail.com', password: '1234'}
  ], function(err, users) {
    // if (err) return debug(err);
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    //create the contractor role
    Role.create({
      name: 'contractor'
    }, function(err, role) {
      // if (err) return debug(err);
       //make admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      }, function(err, principal) {
        if (err) throw (err);
      });
    });

  });
});

};