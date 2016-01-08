angular.module('starter', ['ionic'])
.config(function($stateProvider, $urlRouterProvider){
	
	$stateProvider
	.state('index',{
		url:'/index',
		templateUrl:'views/index.html',
	});

	$urlRouterProvider.when('','index');
})