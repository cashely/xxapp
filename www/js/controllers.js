angular.module('starter.controllers', [])
    .controller('home', function ($scope, $http, $rootScope, $state) {
        $scope.hotPost = [];
        $http({
            url: 'json/hotPost.json',
            method: 'POST'
        }).success(function (data) {
            console.log(data);
            $scope.hotPost = data;
        });
        $scope.loadMoreHotPost = function () {
            $http({
                url: 'json/hotPost.json',
                method: 'POST'
            }).success(function (data) {
                $scope.hotPost = $scope.hotPost.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                
            });
        };
        $scope.$on('stateChangeSuccess', function () {
            console.log(1);
            $scope.loadMoreHotPost();
            
        });
        $scope.cancelMoreLoad = function () {
            return $scope.hotPost.length > 10 ? false : true;
        };
    console.log($rootScope.name);
    })
