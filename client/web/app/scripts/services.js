'use strict';

angular.module('plumberfinderApp')
.constant("baseURL", "http://plumberfinder.eu-gb.mybluemix.net/api/")
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('clientFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "clients/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('contractorFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "contractors/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('jobFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "jobs/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('reviewFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "reviews", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', '$location', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog, $location){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var userId = '';
    var userType = '';
    var authToken = undefined;
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    userId = credentials.id;
    userType = credentials.type;

    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    userId = '';
    userType = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData, type) {
        
        $resource(baseURL + type + "/login?include=user")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.id, id: response.user.id, type: response.user.type});
              $rootScope.$broadcast('login:Successful');
              console.log('/' + type.toLowerCase() + '/' + response.user.id);
              $location.path('/' + type.toLowerCase() + '/' + response.user.id);
           },
           function(response){
              isAuthenticated = false;
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.error.message + '</p><p>' +
                    response.data.error.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData, type) {
        registerData.email = registerData.username;

        $resource(baseURL + registerData.type)
        .save(registerData,
           function(response) {

            authFac.login({username:registerData.username, password:registerData.password}, type);
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.error.message + 
                  '</p><p>' + response.data.error.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };
    
    authFac.getUserId = function() {
        return userId;  
    };
    
    authFac.getUserType = function() {
        return userType;  
    };

    loadUserCredentials();
    
    return authFac;
    
}])
;