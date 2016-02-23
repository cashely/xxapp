angular.module('starter.router', ['ionic', 'starter.controllers', 'ngCordova', 'ionic-native-transitions'])
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.scrolling.jsScrolling(true);
        $ionicConfigProvider.backButton.previousTitleText(false).text('').icon('ion-ios-arrow-back');
        $ionicNativeTransitionsProvider.setDefaultOptions({
            duration: 200, // in milliseconds (ms), default 400,
            slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
            iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
            androiddelay: -1, // same as above but for Android, default -1
            winphonedelay: -1, // same as above but for Windows Phone, default -1,
            fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
            fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
            triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
            backInOppositeDirection: true // Takes over default back transition and state back transition to use the opposite direction transition to go back
        });
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
                        controller: 'homeController'
                    }
                }
            })
            //首页政策解读
            .state('index.home-zcjd', {
                url: '/home/zcjd',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-zcjd.html',
                        controller: 'zcjdController'
                    }
                }
            })
            //        首页机构导航
            .state('index.home-jgdh', {
                url: '/home/jgdh',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-jgdh.html',
                        controller: 'jgdhController'
                    }
                }
            })
            //首页招标信息
            .state('index.home-xx', {
                url: '/home/xx/:type',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-xx.html?wewqe',
                        controller: 'xxController'
                    }
                }
            })
            //首页我的订阅
            .state('index.home-sub', {
                url: '/home/sub:type/:data',
                views: {
                    'index-home': {
                        templateUrl: 'views/member-sub.html',
                        controller: 'indexsubController'
                    }
                }
            })
            //首页我的收藏
            .state('index.home-collect', {
                url: '/home/collect',
                views: {
                    'index-home': {
                        templateUrl: 'views/member-collect.html',
                        controller: 'indexcollectController'
                    }
                }
            })
            .state('index.home-collect-xx', {
                url: '/home/collect/xx/:title',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-xx.html?232',
                        controller: 'xxController'
                    }
                }
            })

        //        分类信息页面
        .state('index.classify', {
                url: '/classify',
                views: {
                    'index-classify': {
                        templateUrl: 'views/index-classify.html',
                        controller: 'classifyController'
                    }
                }
            })
            //分类信息列表页
            .state('index.classify-xx', {
                url: '/classify/xx/:type',
                views: {
                    'index-classify': {
                        templateUrl: 'views/classify-xx.html',
                        controller: 'xxController'
                    }
                }
            })
            //分类机构导航
            .state('index.classify-jgdh', {
                url: '/classify/jgdh',
                views: {
                    'index-classify': {
                        templateUrl: 'views/classify-jgdh.html',
                        controller: 'jgdhController'
                    }
                }
            })
            //分类操作指引
            .state('index.classify-guide', {
                url: '/classify/guide',
                views: {
                    'index-classify': {
                        templateUrl: 'views/classify-guide.html',
                        controller: function ($scope) {}
                    }
                }
            })
            //我的
            .state('index.member', {
                url: '/member',
                views: {
                    'index-member': {
                        templateUrl: 'views/index-member.html',
                        controller: 'memberController'
                    }
                }
            })
            //        我的订阅
            .state('index.member-sub', {
                url: '/member/sub',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-sub.html',
                        controller: 'classifyController'
                    }
                }
            })
            //        我的订阅详情
            .state('index.member-sub-xx', {
                url: '/member/sub/:title',
                views: {
                    'index-member': {
                        templateUrl: 'views/classify-xx.html',
                        controller: 'xxController'
                    }
                }
            })
            //        我的收藏
            .state('index.member-collect', {
                url: '/member/collect',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-collect.html',
                        controller: 'classifyController'
                    }
                }
            })
            //        我的信息
            .state('index.member-message', {
                url: '/member/message',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-message.html'
                    }
                }
            })
            //        我的机构导航
            .state('index.member-jgdh', {
                url: '/member/jgdh',
                views: {
                    'index-member': {
                        templateUrl: 'views/classify-jgdh.html',
                        controller: 'jgdhController'
                    }
                }
            })
            //        我的回收站
            .state('index.member-recycle', {
                url: '/member/recycle',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-recycle.html'
                    }
                }
            })
            //        我的APP使用说明
            .state('index.member-intro', {
                url: '/member/intro',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-intro.html'
                    }
                }
            })
            //        我的设置
            .state('index.member-setting', {
                url: '/member/setting',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-setting.html'
                    }
                }
            })
            //        我的意见反馈
            .state('index.member-idea', {
                url: '/member/idea',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-idea.html'
                    }
                }
            })
            //        我的关于我们
            .state('index.member-about', {
                url: '/member/about',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-about.html'
                    }
                }
            })
            //登录页面
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'loginController'
            })
            //    注册页面
            .state('reg', {
                url: '/reg',
                abstract: true,
                templateUrl: 'views/reg.html'
            })
            //注册验证手机号码
            .state('reg.code', {
                url: '/code',
                views: {
                    'reg': {
                        templateUrl: 'views/reg-code.html',
                        controller: 'regCodeController'
                    }
                }

            })
            //注册填写表单
            .state('reg.form', {
                url: '/form',
                views: {
                    'reg': {
                        templateUrl: 'views/reg-form.html'
                    }
                }
            })
            //        文章详细页面
            .state('page', {
                cache:false,
                url: '/page/:id',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                templateUrl: 'views/page.html',
                controller: function ($scope, $state, $http, $ionicNavBarDelegate,$ionicActionSheet,$ionicSideMenuDelegate) {
                    $scope.goBack = function () {
                        if($ionicSideMenuDelegate.isOpenLeft()){
                            $ionicNavBarDelegate.back();    
                        }else{
                            $ionicSideMenuDelegate.toggleLeft();
                        }
                        
                    };
                    $http({
                        url: 'json/post.json?' + new Date()
                    }).success(function (data) {
                        $scope.post = data;
                    });
                    $scope.showPageSheet = function () {
                        $ionicActionSheet.show({
                            buttons: [
                                {
                                    text: '操作指引'
                    },
                                {
                                    text: '机构导航'
                    },
                                {
                                    text: '项目历史'
                    },
                                {
                                    text: '同省份其他项目'
                    }
                ],
                            destructiveText: '删除',
                            titleText: '更多操作',
                            cancelText: '取消',
                            cancel: function () {
                                // add cancel code..
                                console.log('cancel');
                            },
                            buttonClicked: function (index, e) {
                                if(index == 2){
                                    $ionicSideMenuDelegate.toggleLeft();
                                }
                                return true;
                            },
                            destructiveButtonClicked: function () {
                                console.log('删除');
                            }

                        });
                    }
                }
            });
//        $urlRouterProvider('/login');
        $urlRouterProvider.otherwise('/login');
    })
