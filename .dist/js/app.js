angular.module('petAdoptionApp', [])
.controller('PetController', function($scope, $http, $window) {

    $scope.checkAuth = function() {
        $scope.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!$scope.currentUser) {
            $window.location.href = 'login.html';
        }
        
        $scope.selectedPet = null;
        $scope.adoptionDetails = {};
        
        $http.get('http://localhost:3000/pets')
            .then(function(response) {
                $scope.pets = response.data;
            });
    };
    
    $scope.logout = function() {
        sessionStorage.removeItem('currentUser');
        $window.location.href = 'login.html';
    };
    
    $scope.showAdoptionForm = function(petId) {
        $scope.selectedPet = petId;
        $scope.adoptionDetails = {}; // Clear previous form data
    };
    
    $scope.cancelAdoptionForm = function() {
        $scope.selectedPet = null;
    };
    
    $scope.submitAdoptionForm = function(petId) {
        var adoptionData = {
            adopted: true,
            adoptedBy: {
                userId: $scope.currentUser.id,
                username: $scope.currentUser.username,
                name: $scope.adoptionDetails.name,
                email: $scope.adoptionDetails.email,
                phone: $scope.adoptionDetails.phone,
                address: $scope.adoptionDetails.address,
                adoptionDate: new Date().toISOString()
            }
        };
        
        $http.patch('http://localhost:3000/pets/' + petId, adoptionData)
            .then(function() {
                var adoptionRecord = {
                    petId: petId,
                    userId: $scope.currentUser.id,
                    adoptionDetails: $scope.adoptionDetails,
                    adoptionDate: new Date().toISOString()
                };
                
                return $http.post('http://localhost:3000/adoptions', adoptionRecord);
            })
            .then(function() {
                alert('Adoption submitted successfully!');
                $scope.selectedPet = null;
                $http.get('http://localhost:3000/pets')
                    .then(function(response) {
                        $scope.pets = response.data;
                    });
            })
            .catch(function(error) {
                console.error('Error:', error);
                alert('Error submitting adoption. Please try again.');
            });
    };
});