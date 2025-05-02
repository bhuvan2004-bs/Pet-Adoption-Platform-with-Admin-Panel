angular.module('registerApp', [])
.controller('RegisterController', function($scope, $http, $window) {
    $scope.user = {
        username: '',
        email: '',
        password: '',
        role: 'user' 
    };
    
    $scope.register = function() {
        $http.get('http://localhost:3000/users?username=' + $scope.user.username)
            .then(function(response) {
                if (response.data.length > 0) {
                    $scope.error = "Username already exists";
                } else {
                    $http.post('http://localhost:3000/users', $scope.user)
                        .then(function() {
                            $scope.success = "Registration successful! Redirecting to login...";
                            $scope.error = '';
                            setTimeout(function() {
                                $window.location.href = 'login.html';
                            }, 2000);
                        })
                        .catch(function() {
                            $scope.error = "Registration failed. Please try again.";
                        });
                }
            })
            .catch(function() {
                $scope.error = "Error checking username availability";
            });
    };
});