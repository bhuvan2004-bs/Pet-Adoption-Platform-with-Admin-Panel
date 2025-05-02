angular.module('adminApp', [])
.controller('AdminController', function($scope, $http, $window) {
    $scope.checkAuth = function() {
        $scope.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!$scope.currentUser || $scope.currentUser.role !== 'admin') {
            $window.location.href = 'login.html';
        }
        
        $http.get('http://localhost:3000/adoptions')
            .then(function(response) {
                $scope.adoptions = response.data;
            });
    };
    
    $scope.logout = function() {
        sessionStorage.removeItem('currentUser');
        $window.location.href = 'login.html';
    };
    
    $scope.newPet = {};
    
    $http.get('http://localhost:3000/pets')
        .then(function(response) {
            $scope.pets = response.data;
        });
    
    $scope.getPetName = function(petId) {
        var pet = $scope.pets.find(function(p) {
            return p.id === petId;
        });
        return pet ? pet.name : 'Unknown';
    };
    
    $scope.viewDetails = function(record) {
        alert(
            'Adoption Details:\n\n' +
            'Pet: ' + $scope.getPetName(record.petId) + '\n' +
            'User: ' + record.adoptionDetails.name + '\n' +
            'Email: ' + record.adoptionDetails.email + '\n' +
            'Phone: ' + record.adoptionDetails.phone + '\n' +
            'Address: ' + record.adoptionDetails.address + '\n' +
            'Date: ' + new Date(record.adoptionDate).toLocaleDateString()
        );
    };
    
  
    $scope.addPet = function() {
        $http.post('http://localhost:3000/pets', $scope.newPet)
            .then(function() {
                alert('Pet added successfully!');
                $scope.newPet = {};
               
                $http.get('http://localhost:3000/pets')
                    .then(function(response) {
                        $scope.pets = response.data;
                    });
            });
    };
    

    $scope.deletePet = function(petId) {
        if (confirm('Are you sure you want to delete this pet?')) {
            $http.delete('http://localhost:3000/pets/' + petId)
                .then(function() {
                    $scope.pets = $scope.pets.filter(function(pet) {
                        return pet.id !== petId;
                    });
                    alert('Pet deleted successfully!');
                });
        }
    };
});