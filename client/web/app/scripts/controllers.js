'use strict';

angular.module('plumberfinderApp')

.controller('HomeController', ['$scope', function ($scope) {

}])

.controller('infoContractorControllerController', ['$scope', function ($scope) {
    
}])

.controller('infoClientControllerController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

}])

.controller('UserTypePageController', ['$scope', function ($scope) {    

}])

.controller('UserTypeLoginController', ['$scope', function ($scope) {    

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', '$location', function ($scope, $state, $rootScope, ngDialog, AuthFactory, $location) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.userId = '';
    $scope.userType = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.userId = AuthFactory.getUserId();
        $scope.userType = AuthFactory.getUserType();
    }
    
    $scope.isClientType = function() {
        if ($scope.userType.toLowerCase() == 'clients') {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.isContractorType = function() {
        if ($scope.userType.toLowerCase() == 'contractors') {
            return true;
        } else {
            return false;
        }
    };
        
    $scope.createJob = function () {
        ngDialog.open({ template: 'views/job-create.html', scope: $scope, className: 'ngdialog-theme-default', controller:"JobCreateController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.userId = '';
        $scope.userType = '';

        $location.path('/');
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.userId = AuthFactory.getUserId();
        $scope.userType = AuthFactory.getUserType();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.userId = AuthFactory.getUserId();
        $scope.userType = AuthFactory.getUserType();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };    
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('LoginClientController', ['$scope', '$localStorage', 'AuthFactory', function ($scope, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.loginData.type='Clients';
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData, $scope.loginData.type);

    };
    
}])

.controller('LoginContractorController', ['$scope', '$localStorage', 'AuthFactory', function ($scope, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.loginData.type='Contractors';
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData, $scope.loginData.type);

    };
    
}])

.controller('RegisterClientController', ['$scope', '$localStorage', 'AuthFactory', function ($scope, $localStorage, AuthFactory) {
    
    $scope.registration={};
    $scope.loginData={};
    $scope.registration.type='Clients';
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration, $scope.registration.type);

    };
}])

.controller('RegisterContractorController', ['$scope', '$localStorage', 'AuthFactory', function ($scope, $localStorage, AuthFactory) {
    
    $scope.registration={};
    $scope.loginData={};
    $scope.registration.type='Contractors';
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration, $scope.registration.type);

    };
}])

.controller('ClientController', ['$scope', '$stateParams', 'AuthFactory', 'clientFactory', 'contractorFactory', 'reviewFactory', function ($scope, $stateParams, AuthFactory, clientFactory, contractorFactory, reviewFactory) {

    $scope.user = {};

    $scope.user = clientFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
        function (user) {
            console.log(user);

            reviewFactory.query({"filter": {"where": {"type": 'contractor2client', "clientId": $stateParams.id}}}, function (reviews) {
                user.rating = 0;

                var reviewRatingCount = reviews.length;
                var reviewRatingSumm = 0;

                angular.forEach(reviews, function (review) {
                    reviewRatingSumm += review.privateRating;

                    contractorFactory.get({ id: review.contractorId }, function (contractor) {
                    
                            if ( review.user === undefined ) {
                                review.user = {};
                            }
                            review.user = contractor;
                        
                    });
                });

                user.reviews = reviews;

                if (reviewRatingCount > 0) {
                    user.rating = parseInt((reviewRatingSumm / reviewRatingCount) * 10);

                    if (user.rating >= 80) {
                        user.ratingClass = 'green';
                    } else if (user.rating >= 50 && user.rating < 80) {
                        user.ratingClass = 'yellow';
                    } else if (user.rating > 0 && user.rating < 50) {
                        user.ratingClass = 'red';
                    }                    

                    user.rating = user.rating + ' %';
                }

                $scope.user = user;
            });
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

}])

.controller('ContractorController', ['$scope', '$stateParams', 'AuthFactory', 'clientFactory', 'contractorFactory', 'reviewFactory', function ($scope, $stateParams, AuthFactory, clientFactory, contractorFactory, reviewFactory) {

    $scope.user = {};

    $scope.user = contractorFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
        function (user) {
            console.log(user);

            reviewFactory.query({"filter": {"where": {"type": 'client2contractor', "contractorId": $stateParams.id}}}, function (reviews) {
                user.rating = 0;

                var reviewRatingCount = reviews.length;
                var reviewRatingSumm = 0;

                angular.forEach(reviews, function (review) {
                    reviewRatingSumm += review.privateRating;

                    clientFactory.get({ id: review.clientId }, function (client) {
                    
                            if ( review.user === undefined ) {
                                review.user = {};
                            }
                            review.user = client;
                        
                    });
                });

                user.reviews = reviews;

                if (reviewRatingCount > 0) {
                    user.rating = parseInt((reviewRatingSumm / reviewRatingCount) * 10);

                    if (user.rating >= 80) {
                        user.ratingClass = 'green';
                    } else if (user.rating >= 50 && user.rating < 80) {
                        user.ratingClass = 'yellow';
                    } else if (user.rating > 0 && user.rating < 50) {
                        user.ratingClass = 'red';
                    }                    

                    user.rating = user.rating + ' %';
                }

                $scope.user = user;
            });
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

}])

.controller('JobCreateController', ['$scope', 'jobFactory', 'ngDialog', '$location', function ($scope, jobFactory, ngDialog, $location) {

    $scope.job={};
    $scope.job.clientId=$scope.userId;
    
    $scope.doCreateJob = function() {
        console.log('Creating a job', $scope.job);

        jobFactory.save($scope.job);

        ngDialog.close();

        $location.path('/jobs');
    };

}])

.controller('JobContactController', ['$scope', 'jobFactory', 'ngDialog', '$location', function ($scope, jobFactory, ngDialog, $location) {

    $scope.job={};
    $scope.job.contractorId=$scope.userId;
    
    $scope.doContactJob = function() {
        console.log('Contact', $scope.job, $scope.jobId);

        jobFactory.update({id: $scope.jobId}, {contractorId: $scope.job.contractorId, message: $scope.job.message}, function() {           
            ngDialog.close();

            $location.path('/jobs');
        });                
    };

}])

.controller('MyJobsController', ['$scope', 'AuthFactory', 'jobFactory', 'clientFactory', 'contractorFactory', 'reviewFactory', 'ngDialog', function ($scope, AuthFactory, jobFactory, clientFactory, contractorFactory, reviewFactory, ngDialog) {

    var userId = AuthFactory.getUserId();
    $scope.userId = AuthFactory.getUserId();
    $scope.userType = AuthFactory.getUserType();
    $scope.userType = $scope.userType.toLowerCase();
    $scope.jobs = [];

    if ($scope.userType == 'clients') {
        jobFactory.query({"filter": {"where": {"clientId": userId}}}, function (jobs) {
            angular.forEach(jobs, function (job) {
                if (job.contractorId) {
                    contractorFactory.get({ id: job.contractorId }, function (contractor) {
                        if ( job.contractor === undefined ) {
                            job.contractor = {};
                        }
                        job.contractor = contractor;
                        // console.log(jobs);
                        reviewFactory.query({"filter": {"where": {"type": "client2contractor", "jobId": job.id, "clientId": $scope.userId}}}, function (review) {
                            console.log(review);

                            job.review = review[0];

                            $scope.jobs.push(job);

                        });
                    });
                } else {
                        // console.log(jobs);
                        $scope.jobs.push(job);                   
                }
            });
        });
    } else if ($scope.userType == 'contractors') {        
        jobFactory.query({"filter": {"where": {"contractorId": userId}}}, function (jobs) {
            angular.forEach(jobs, function (job) {
                    clientFactory.get({ id: job.clientId }, function (client) {
                        if ( job.client === undefined ) {
                            job.client = {};
                        }
                        job.client = client;
                        // console.log(jobs);
                        reviewFactory.query({"filter": {"where": {"type": "contractor2client", "jobId": job.id, "contractorId": $scope.userId}}}, function (review) {
                            console.log(review);

                            job.review = review[0];

                            $scope.jobs.push(job);
                        });
                    });
            });
        });
    }
    
    $scope.giveReview = function (fromUserId, toUserId, jobId) {
        $scope.fromUserId = fromUserId;
        $scope.toUserId = toUserId;
        $scope.jobId = jobId;
        ngDialog.open({ template: 'views/review.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ReviewController" });
    };

}])

.controller('FindJobController', ['$scope', 'jobFactory', 'clientFactory', 'ngDialog', 'AuthFactory', function ($scope, jobFactory, clientFactory, ngDialog, AuthFactory) {

    $scope.userId = AuthFactory.getUserId();
    $scope.jobs = [];

    jobFactory.query(function (jobs) {                 
        angular.forEach(jobs, function (job) {
            if (!job.contractorId) {
                clientFactory.get({ id: job.clientId }, function (client) {
                    
                        if ( job.client === undefined ) {
                            job.client = {};
                        }
                        job.client = client;
                        console.log(jobs);
                        $scope.jobs.push(job);
                    
                });
            }    
        });    
    });

    $scope.contactJob = function (jobId) {
        $scope.jobId = jobId;
        ngDialog.open({ template: 'views/job-contact.html', scope: $scope, className: 'ngdialog-theme-default', controller:"JobContactController" });
    };

}])

.controller('ReviewController', ['$scope', '$state', 'ngDialog', 'AuthFactory', 'reviewFactory', function ($scope, $state, ngDialog, AuthFactory, reviewFactory) { 
    
    $scope.review = {
        privateRating: 10,
        publicRating: 5,
        comment: "",
        jobId: $scope.jobId
    };

    $scope.userType = AuthFactory.getUserType();

    if ($scope.userType.toLowerCase() == 'clients') {
        $scope.review.type = 'client2contractor';
        $scope.review.clientId = $scope.fromUserId;
        $scope.review.contractorId = $scope.toUserId;
    } else if ($scope.userType.toLowerCase() == 'contractors') {
        $scope.review.type = 'contractor2client';
        $scope.review.clientId = $scope.toUserId;
        $scope.review.contractorId = $scope.fromUserId;
    }

    $scope.doCreateReview = function () {
        console.log($scope.review);
        reviewFactory.save($scope.review);

        ngDialog.close();

        $state.go($state.current, {}, {reload: true});
    }; 

}])
;