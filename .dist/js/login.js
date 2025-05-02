angular.module('loginApp', [])
.controller('LoginController', function($scope, $http, $window) {
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.error = '';
    
    $scope.login = function() {
        $http.get('http://localhost:3000/users?username=' + $scope.credentials.username)
            .then(function(response) {
                if (response.data.length > 0) {
                    var user = response.data[0];
                    if (user.password === $scope.credentials.password) { 
                        sessionStorage.setItem('currentUser', JSON.stringify(user));
                    
                        if (user.role === 'admin') {
                            $window.location.href = 'admin.html';
                        } else {
                            $window.location.href = 'index.html';
                        }
                    } else {
                        $scope.error = "Invalid password";
                    }
                } else {
                    $scope.error = "User not found";
                }
            })
            .catch(function() {
                $scope.error = "Login failed. Please try again.";
            });
    };
});