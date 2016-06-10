'use strict';

angular.module('plumberfinderApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the info-client page
            .state('app.infoClient', {
                url:'client-info',
                views: {
                    'content@': {
                        templateUrl : 'views/info-client.html',
                        controller  : 'infoClientController'                  
                    }
                }
            })
        
            // route for the info-contractor page
            .state('app.infoContractor', {
                url:'contractor-info',
                views: {
                    'content@': {
                        templateUrl : 'views/info-contractor.html',
                        controller  : 'infoContractorController'                  
                    }
                }
            })
        
            // route for the register-client page
            .state('app.registerClient', {
                url:'client-register',
                views: {
                    'content@': {
                        templateUrl : 'views/register-client.html',
                        controller  : 'RegisterClientController'                  
                    }
                }
            })
        
            // route for the register-contractor page
            .state('app.registerContractor', {
                url:'contractor-register',
                views: {
                    'content@': {
                        templateUrl : 'views/register-contractor.html',
                        controller  : 'RegisterContractorController'                  
                    }
                }
            })
        
            // route for the user type page
            .state('app.userTypePage', {
                url:'user-type-page',
                views: {
                    'content@': {
                        templateUrl : 'views/user-type-page.html',
                        controller  : 'UserTypePageController'                  
                    }
                }
            })
        
            // route for the user type page
            .state('app.userTypeLogin', {
                url:'user-type-login',
                views: {
                    'content@': {
                        templateUrl : 'views/user-type-login.html',
                        controller  : 'UserTypeLoginController'                  
                    }
                }
            })
        
            // route for the client login
            .state('app.loginClient', {
                url:'client-login',
                views: {
                    'content@': {
                        templateUrl : 'views/login-client.html',
                        controller  : 'LoginClientController'                  
                    }
                }
            })
        
            // route for the contractor login
            .state('app.loginContractor', {
                url:'contractor-login',
                views: {
                    'content@': {
                        templateUrl : 'views/login-contractor.html',
                        controller  : 'LoginContractorController'                  
                    }
                }
            })

            // route for the profile page
            .state('app.client', {
                url: 'clients/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/profile.html',
                        controller  : 'ClientController'
                    }
                }
            })

            // route for the profile page
            .state('app.contractor', {
                url: 'contractors/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/profile.html',
                        controller  : 'ContractorController'
                    }
                }
            })

            // route for the jobs page
            .state('app.myJobs', {
                url: 'jobs',
                views: {
                    'content@': {
                        templateUrl : 'views/jobs.html',
                        controller  : 'MyJobsController'
                    }
                }
            })

            // route for the find jobs page
            .state('app.findJob', {
                url: 'find-job',
                views: {
                    'content@': {
                        templateUrl : 'views/job-find.html',
                        controller  : 'FindJobController'
                    }
                }
            })
    
        $urlRouterProvider.otherwise('/');
    })
;
