var app = angular.module('ChirpApp', []);

app.controller("mainController", function($scope){
    var $scope.posts = [];
    var $scope.newPost ={created_by : "",
                         text : "",
                         created_at : ""};
    
});