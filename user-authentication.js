var when = require("when");
var http = require('http');

module.exports = {
   type: "credentials",
   users: function(username) {
       return when.promise(function(resolve) {
           // Do whatever work is needed to check username is a valid
           // user.
           var valid = true;
           if (valid) {
               // Resolve with the user object. It must contain
               // properties 'username' and 'permissions'
               var user = { username: username, permissions: "*" };
               resolve(user);
           } else {
               // Resolve with null to indicate this user does not exist
               resolve(null);
           }
       });
   },
   authenticate: function(username,password) {
       return when.promise(function(resolve) {
          // Do whatever work is needed to validate the username/password
          // combination.
          var server_url = "localhost";//global.get('server_url');
          var login_path = "/api/api-token-auth/";//global.get('login_path');
          var url = server_url + login_path;
          var data = {
            "username": username,
            "password": password
          };
          var options = {
            hostname: server_url,
            port: 8111,
            path: login_path,
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Content-Length': Buffer.byteLength(JSON.stringify(data))
            },
          };
          var req = http.request(options, function(res) {
            console.log('Status: ' + res.statusCode);
            console.log('Headers: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (body) {
              console.log('Body: ' + body);
              // var token = JSON.parse(body)["token"];
              if(res.statusCode == 200)
              {
                var user = { username: username, permissions: "*" };
                resolve(user);
              }
              else
                resolve(null);
            });
          });
          req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
          });
          // write data to request body
          req.write(JSON.stringify(data));
          req.end();

       });
   },
   default: function() {
       return when.promise(function(resolve) {
           // Resolve with the user object for the default user.
           // If no default user exists, resolve with null.
           // resolve({anonymous: true, permissions:"read"});
           resolve(null);
       });
   }
}