angular.module('starter.router', ['ionic', 'starter.controllers'])
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $stateProvider
            .state('index', {
                abstract: true,
                url: '/index',
                templateUrl: 'views/index.html'
            })
            .state('index.home', {
                url: '/home',
                views: {
                    'index-home': {
                        templateUrl: 'views/index-home.html',
                        controller: 'home'
                    }
                }
            })
            //            首页zcjd
            .state('index.home-zcjd', {
                url: '/home/zcjd',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-zcjd.html',
                        controller: function ($scope) {

                        }
                    }
                }
            })
            //        首页jgdh
            .state('index.home-jgdh', {
                url: '/home/jgdh',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-jgdh.html'
                    }
                }
            })
            //        分类信息页面
            .state('index.classify', {
                url: '/classify',
                views: {
                    'index-classify': {
                        templateUrl: 'views/index-classify.html',
                        controller: function ($scope) {
                            console.log('classify');
                        }
                    }
                }
            })
            //        分类zcjd
            .state('index.classify-zcjd', {
                url: '/classify/zcjd',
                views: {
                    'index-classify': {
                        templateUrl: 'views/classify-zcjd.html',
                        controller: function ($scope) {

                        }
                    }
                }
            })
            .state('index.member', {
                url: '/member',
                views: {
                    'index-member': {
                        templateUrl: 'views/index-member.html'
                    }
                }
            })
            //        登录页面
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html'
            })
            //    注册页面
            .state('reg', {
                url: '/reg',
                abstract: true,
                templateUrl: 'views/reg.html'
            })
            .state('reg.code', {
                url: '/code',
                views: {
                    'reg': {
                        templateUrl: 'views/reg-code.html'
                    }
                }

            })
            .state('reg.form', {
                url: '/form',
                views: {
                    'reg': {
                        templateUrl: 'views/reg-form.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/index/home');
    })
