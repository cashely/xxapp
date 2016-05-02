angular.module('starter.router', ['ionic', 'starter.controllers', 'ngCordova', 'ionic-native-transitions'])
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider, $cordovaInAppBrowserProvider) {
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
                templateUrl: 'views/index.html',
                controller: function ($state) {
                    if (localStorage.getItem('autoLogin') == 0 || !localStorage.getItem('token')) {
                        $state.go('login');
                    }
                }
            })
            .state('index.home', {
                url: '/home',
                reload: true,
                views: {
                    'index-home': {
                        templateUrl: 'views/index-home.html',
                        controller: 'homeController'
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
            //首页招标信息&&政策解读
            .state('index.home-xx', {
                url: '/home/xx/:type/:id',
                views: {
                    'index-home': {
                        templateUrl: 'views/classify-xx.html',
                        controller: 'getClassifyController'
                    }
                }
            })
            //首页我的订阅
            .state('index.home-sub', {
                url: '/home/sub',
                views: {
                    'index-home': {
                        templateUrl: 'views/index-sub.html',
                        controller: 'indexsubController'
                    }
                }
            })
            .state('index.home-sub-xx', {
                url: '/home/sub/:type/:id',
                views: {
                    'index-home': {
                        templateUrl: 'views/sub-list.html',
                        controller: 'getsubListController'
                    }
                }
            })
            //首页我的收藏
            .state('index.home-collect', {
                url: '/home/collect',
                views: {
                    'index-home': {
                        templateUrl: 'views/index-collect.html',
                        controller: 'collectController'
                    }
                }
            })
            .state('index.home-collect-xx', {
                url: '/home/collect/:type/:id',
                views: {
                    'index-home': {
                        templateUrl: 'views/collect-list.html?232',
                        controller: 'getCollectListController'
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
                url: '/classify/xx/:type/:id',
                views: {
                    'index-classify': {
                        templateUrl: 'views/classify-xx.html',
                        controller: 'getClassifyController'
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
            //数据查询
            .state('index.classify-data', {
                url: '/classify/data',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-types.html'
                    }
                }
            })
            //--数据查询分类E
            .state('index.classify-data-E', {
                url: '/classify/data/:code/:title',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-E.html'
                    }
                }
            })
            //--数据查询分类D
            .state('index.classify-data-D', {
                url: '/classify/data/:code/:title',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-D.html'
                    }
                }
            })
            //--数据查询分类C
            .state('index.classify-data-C', {
                url: '/classify/data/:code/:title',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-C.html'
                    }
                }
            })
            //--数据查询分类A
            .state('index.classify-data-A', {
                url: '/classify/data/:code/:title',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-A.html'
                    }
                }
            })
            //--数据查询分类B
            .state('index.classify-data-B', {
                url: '/classify/data/:code/:title',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-B.html'
                    }
                }
            })
            //--数据查询分类Z
            .state('index.classify-data-Z', {
                url: '/classify/data/:code/:title',
                views: {
                    'index-classify': {
                        templateUrl: 'views/data-search-Z.html'
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
            //        订阅设置
            .state('index.member-sub', {
                url: '/member/sub',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-sub.html',
                        controller: 'setSubController'
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
                        controller: 'collectController'
                    }
                }
            })
            .state('index.member-collect-xx', {
                url: '/member/collect/:type/:id',
                views: {
                    'index-member': {
                        templateUrl: 'views/collect-list.html?232',
                        controller: 'getCollectListController'
                    }
                }
            })
            //        我的信息
            .state('index.member-message', {
                url: '/member/message',
                views: {
                    'index-member': {
                        templateUrl: 'views/member-data.html',
                        controller: function ($scope, $ionicPopup, $http) {
                            // 修改密码
                            $scope.data = {};
                            // 获取个人信息
                            requestData('app/sys/userInfo.do', {
                                APPCLIENTID: $scope.APPCLIENTID
                            }, function (res) {
                                $scope.user = res.data
                            })
                            $scope.editPassword = function () {

                                var passwordPopup = $ionicPopup.show({
                                    template: '<input type="password" ng-model="data.password">',
                                    title: '请输入新密码',
                                    scope: $scope,
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<b>确定</b>',
                                            type: 'button-positive',
                                            onTap: function (e) {
                                                if (!$scope.data.password) {
                                                    //不允许用户关闭，除非他键入wifi密码
                                                    e.preventDefault();
                                                } else {
                                                    console.log($scope.data.password);
                                                }
                                            }
                                               },
                                             ]
                                });
                            };
                            // 修改昵称
                            $scope.editOthername = function () {
                                $scope.data = {};
                                var othernamePopup = $ionicPopup.show({
                                    template: '<input type="text" ng-model="data.othername">',
                                    title: '昵称修改',
                                    scope: $scope,
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<b>确定</b>',
                                            type: 'button-positive',
                                            onTap: function (e) {
                                                if (!$scope.data.othername) {
                                                    //不允许用户关闭，除非他键入wifi密码
                                                    e.preventDefault();
                                                } else {
                                                    console.log($scope.data.othername);
                                                }
                                            }
                                               },
                                             ]
                                });
                            };
                            // 修改昵称
                            $scope.editOrganization = function () {
                                $scope.data = {};
                                var organizationPopup = $ionicPopup.show({
                                    template: '<input type="text" ng-model="data.organization">',
                                    title: '机构修改',
                                    scope: $scope,
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<b>确定</b>',
                                            type: 'button-positive',
                                            onTap: function (e) {
                                                if (!$scope.data.organization) {
                                                    //不允许用户关闭，除非他键入wifi密码
                                                    e.preventDefault();
                                                } else {
                                                    console.log($scope.data.organization);
                                                }
                                            }
                                               },
                                             ]
                                });
                            };
                            // 修改昵称
                            $scope.editEmail = function () {
                                $scope.data = {};
                                var emailPopup = $ionicPopup.show({
                                    template: '<input type="text" ng-model="data.email">',
                                    title: '邮箱修改',
                                    scope: $scope,
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<b>确定</b>',
                                            type: 'button-positive',
                                            onTap: function (e) {
                                                if (!$scope.data.email) {
                                                    //不允许用户关闭，除非他键入wifi密码
                                                    e.preventDefault();
                                                } else {
                                                    console.log($scope.data.email);
                                                }
                                            }
                                               },
                                             ]
                                });
                            }
                        }
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
                        templateUrl: 'views/member-recycle.html',
                        controller: 'RecycleController'
                    }
                }
            })
            .state('index.member-recycle-xx', {
                url: '/member/recycle/:type/:id',
                views: {
                    'index-member': {
                        templateUrl: 'views/recycle-list.html',
                        controller: 'getRecycleListController'
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
                        templateUrl: 'views/member-idea.html',
                        controller: function ($scope) {
                            $scope.idea = {
                                content: '',
                                contact: ''
                            }
                            $scope.ideaAction = function () {
                                if ($scope.idea.content.length < 12) {
                                    ajaxMsg('反馈内容字数不能少于12个字符！');
                                    return;
                                }
                                if ($scope.idea.contact < 6) {
                                    ajaxMsg('请留下您的联系方式！');
                                    return;
                                }
                                requestData('app/sys/feedback.do', {
                                    content: $scope.idea.content,
                                    contact: $scope.idea.contact,
                                    APPCLIENTID: $scope.APPCLIENTID
                                }, function (res) {
                                    if (res.success) {
                                        ajaxMsg('感谢您的反馈！');
                                    }
                                })
                            }
                        }
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
                        templateUrl: 'views/reg-form.html',
                        controller: 'regFormController'
                    }
                }
            })
            //        文章详细页面
            .state('page', {
                cache: false,
                url: '/page/:id',
                nativeTransitions: {
                    "type": "flip",
                    "direction": "up"
                },
                templateUrl: 'views/page.html',
                controller: 'pageController'
            });

        $urlRouterProvider.otherwise('/login');
    })
