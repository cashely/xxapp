angular.module('starter.controllers', [])
    .controller('homeController', function ($scope, $http, $rootScope, $state,$ionicNavBarDelegate) {
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
                url: 'http://192.168.1.108:8888/json/hotPost.json',
                method: 'POST'
            }).success(function (data) {
                $scope.hotPost = $scope.hotPost.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).error(function(data,state){
                     alert(data+','+state);
                     });
        };
        $scope.$on('stateChangeSuccess', function () {
            console.log(1);
            $scope.loadMoreHotPost();

        });
        $scope.cancelMoreLoad = function () {
            return $scope.hotPost.length > 10 ? false : true;
        };
        $scope.indexState = function (title) {
            $state.go('index.home-xx', {
                title: title
            });
        };
        $scope.classifyState = function (title) {
            $state.go('index.home-xx', {
                title: title
            });
        }
    })
    //手机验证
    .controller('regCodeController', function ($scope, $ionicPopup, $state, $timeout, $http) {
        $scope.phoneNumber = '+86';
        $scope.phoneSendCode = '发送验证码';
        var b = false;
        var setPhoneSendCode = function (text) {
            $scope.phoneSendCode = text
        };
        $scope.checkPhoneNumber = function (num) {
            if (num.length < 11) {
                var alertPopup = $ionicPopup.alert({
                    title: '温性提示！',
                    template: '手机号码格式不正确！',
                    okText: '确定'
                });
                b = false;
            } else {
                (function () {
                    $('#sendCode').attr('disable', true).addClass('button-stable').removeClass('button-positive');
                    var i = 6;
                    $scope.$apply(setPhoneSendCode(i + 's后可重发'));
                    var t = setInterval(function () {
                        if (i != 0) {
                            i--;
                            $scope.$apply(setPhoneSendCode(i + 's后可重发'));

                        } else {
                            $scope.$apply(setPhoneSendCode('发送验证码'));
                            $('#sendCode').attr('disable', false).removeClass('button-stable').addClass('button-positive')
                            clearInterval(t);
                        }
                    }, 1000);
                    b = true;
                })();
                //                远程请求发送手机发送验证码
                $http({
                    //                    url:''
                });
            }
        };
        $scope.checkPhone = function () {
            if (!!b) {
                $state.go('reg.form');
            }
        }
    })
    .controller('zcjdController', function ($scope) {
        $scope.share = function (msg) {
            //            alert(1);
            window.plugins.socialsharing.share(msg);
        }
    })
    .controller('jgdhController', function ($scope, $rootScope, $cordovaGeolocation, $http, $ionicLoading, $ionicModal) {
        $scope.province = '广州市';
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner>正在获取位置'
        });
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                $rootScope.locationAddress = {
                    long: position.coords.latitude,
                    lat: position.coords.longitude
                };
                $http({
                    url: 'http://api.map.baidu.com/geocoder/v2/?ak=f4fgkNjsGDjU2BNT5tMPGTGn&location=' + lat + ',' + long + '&output=json&pois=1'
                }).success(function (info) {
                    $scope.province = info.result.addressComponent.province;
                    $ionicLoading.hide();
                    $rootScope.JGposition = {
                        longitude: long,
                        latitude: lat
                    };
                });

            }, function (err) {
                // error
                $ionicLoading.hide();
            });

    })
    .controller('classifyController', function ($scope, $http, $state) {
        $scope.classifyState = function (title) {
            $state.go('index.member-sub-xx', {
                title: title
            });
        }
        $http({
            url: 'json/classify.json',
        }).success(function (data) {
            $scope.classify = data;
            $scope.classify.hotClassify = (function () {
                var _d = $scope.classify.hotClassify,
                    _l = $scope.classify.hotClassify.length,
                    arr = [];
                for (var i = 0, key = 0; i < _l; i++) {
                    if (i % 2 == 0) {
                        i == 0 ? key = 0 : key++;
                        arr[key] = [];
                    }
                    arr[key].push(_d[i]);
                }
                return arr;
            })();
        })
    })
    .controller('indexsubController', function ($scope, $http, $state) {
    console.log($state.params);
        $scope.classifyState = function (title) {
            $state.go('index.home-sub-xx', {
                title: title
            });
        }
        $http({
            url: 'json/classify.json',
        }).success(function (data) {
            $scope.classify = data;
            $scope.classify.hotClassify = (function () {
                var _d = $scope.classify.hotClassify,
                    _l = $scope.classify.hotClassify.length,
                    arr = [];
                for (var i = 0, key = 0; i < _l; i++) {
                    if (i % 2 == 0) {
                        i == 0 ? key = 0 : key++;
                        arr[key] = [];
                    }
                    arr[key].push(_d[i]);
                }
                return arr;
            })();
        })
    })
    .controller('indexcollectController', function ($scope, $http, $state) {
        $scope.classifyState = function (title) {
            $state.go('index.home-collect-xx', {
                title: title
            });
        }
        $http({
            url: 'json/classify.json',
        }).success(function (data) {
            $scope.classify = data;
            $scope.classify.hotClassify = (function () {
                var _d = $scope.classify.hotClassify,
                    _l = $scope.classify.hotClassify.length,
                    arr = [];
                for (var i = 0, key = 0; i < _l; i++) {
                    if (i % 2 == 0) {
                        i == 0 ? key = 0 : key++;
                        arr[key] = [];
                    }
                    arr[key].push(_d[i]);
                }
                return arr;
            })();
        })
    })
    .controller('searchController', function ($scope) {
        $scope.searchAction = function () {
            console.log($('#search').val());
        }
    })
    .controller('xxController', function ($scope, $stateParams, $http) {
        $scope.type = $stateParams.type;
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $http({
            url: 'json/xx.json'
        }).success(function (data) {
            $scope.xxlist = data;
        })
    })
    .controller('loginController', function ($scope, $rootScope, $http, $state, $ionicPopup, $timeout, $cookies) {
        console.log(httpAddress);
        $scope.username = JSON.parse(localStorage.getItem('autoLogin')).userName;
        $scope.password = JSON.parse(localStorage.getItem('autoLogin')).passWord;
        $scope.validAcccount = function () {
            var userName = $('.userName').val();
            var passWord = $('.passWord').val();
            //            console.log(JSON.parse($cookies.get('userInfo')));
            $http({
                url: 'json/validAccount.json',
                //                url: 'http://192.168.1.106:8080/AppServer/login',
                params: {
                    username: userName,
                    password: passWord
                },
                method: "POST"

            }).success(function (data) {
                if (data.code == 1) {
                    //                    console.log(JSON.stringify(data.info));
                    $rootScope.userInfo = JSON.stringify(data.info);
                    $cookies.put('userInfo', JSON.stringify(data.info));
                    localStorage.setItem('userInfo', '{"userName":"' + userName + '","passWord":"' + passWord + '"}');
                    localStorage.setItem('autoLogin', 1);
                    $state.go('index.home'); //跳转首页
                } else if (data.code == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: '温馨提示',
                        template: data.message
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 3000);
                }

            })
        }
    })
    .controller('memberController', function ($scope, $cookies, $state) {
        $scope.loginOut = function () {
            $cookies.remove('userInfo');
            localStorage.setItem('autoLogin', 0);
            $state.go('login');
        }
    })
