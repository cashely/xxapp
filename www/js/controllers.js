angular.module('starter.controllers', [])
    .controller('homeController', function ($scope, $http, $rootScope, $state,$ionicNavBarDelegate,$ionicSlideBoxDelegate) {
        $scope.hotPost = [];
        var page = 1,ps = 5,total = 100;
        $scope.loadMoreHotPost = function () {
            if($scope.hotPost.length >= total){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return false;
            }
            isload = true;
            $http({
                url: httpAddress + 'app/bid/hotArticles.do',
                method: 'POST',
                params:{
                    pageNo: page ,
                    pageSize: ps,
                    APPCLIENTID: $rootScope.APPCLIENTID
                }
            }).success(function (data) {
                total = data.data.total;
                page++;
                var content = (data.data.rows).slice(1);
                for(v in content){
                    $scope.hotPost.push(content[v]);
                }
                // console.log((data.data.rows).length);
                isload = false;

                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).error(function(data,state){
                    ajaxError('没有更多了')
            });
        };
        $scope.cancelMoreLoad = function(){
            return $scope.hotPost.length < total;
        }
        $scope.indexState = function (title) {
            $state.go('index.home-xx', {
                title: title
            });
        };
        $scope.classifyState = function (title) {
            $state.go('index.home-xx', {
                title: title
            });
        };

        // 获取首页banner
        $http({
            url:httpAddress+'app/bid/carousels.do',
            method:'POST'
        }).success(function(res){
            if(res.success){
                $scope.hotImg = (res.data).slice(1);
                $ionicSlideBoxDelegate.update();
            };
        })
    })
    //手机验证
    .controller('regCodeController', function ($scope,$rootScope, $ionicPopup, $state, $timeout, $http) {
        $scope.phoneSendCode = '发送验证码';
        var b = false;
        $scope.buttonDisable = true;
        $scope.checkPhoneNumber = function (num) {
            if (num.length && num.length < 11) {
                var alertPopup = $ionicPopup.alert({
                    title: '温性提示！',
                    template: '手机号码格式不正确！',
                    okText: '确定'
                });
                b = false;
            } else {
                var i = 6;
                $scope.buttonDisable = false;
                $scope.phoneSendCode = i+'s后可重发';
                t = setInterval(function(){
                    if(i>1){
                        i--;
                        $scope.phoneSendCode = i+'s后可重发';
                        $scope.$apply()
                    }else{
                        $scope.phoneSendCode = '发送验证码';
                        $scope.buttonDisable = true;
                        clearInterval(t);
                        $scope.$apply()
                    }  
                },1000);
                //                远程请求发送手机发送验证码
                $http({
                   url:httpAddress + 'app/sys/sendVCode.do',
                   params:{
                    mobile:num,
                    busCode:'R'
                   }
                }).success(function(res){
                    if(res.success){
                        // ajaxError('验证码发送成功：' + res.code);
                    }
                }).error(function(res){
                    ajaxFail();
                });
            }
        };
        $scope.checkPhone = function (phoneNum,code) {
            $http({
                url:httpAddress + 'app/sys/checkVCode.do',
                method:"POST",
                params:{
                    vcode:code,
                    APPCLIENTID:phoneNum
                }
            }).success(function(res){
                $rootScope.regPhone = phoneNum;//记录全局手机变量
                if(res.success){
                   $state.go('reg.form',{phone:phoneNum,code:code});  
               }else{
                 ajaxError(res.code);
            }
            }).error(function(res){
                ajaxFail();
            });
        }
    })
    .controller('regFormController', function ($scope,$rootScope,$state,$http){
        $scope.regAction = function(name,mail,psw){
            console.log(name+','+mail+','+psw);
            $http({
                url:httpAddress + 'app/sys/regist.do',
                params:{
                    nickname:name,
                    email:mail,
                    tel:$rootScope.regPhone,
                    password:psw,
                    APPCLIENTID:$rootScope.regPhone
                },
                method:'POST'
            }).success(function(res){
                if(res.success){
                    $rootScope.regPhone = res.data;
                    localStorage.setItem('userInfo', '{"userName":"' + res.data + '","passWord":""}');
                    $state.go('login');
                }
            });
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
            url: httpAddress + 'app/bid/childrenTypes.do',
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
    .controller('typeController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.type;
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $http({
            url: httpAddress + 'app/bid/childrenTypes.do',
            method:'POST',
            params:{
                root_type:$state.params.title,
                APPCLIENTID:$rootScope.APPCLIENTID
            }
        }).success(function (res) {
            if(res.success){

                $scope.xxlist = res.data.rows.slice(1);
            }
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
    .controller('collectController', function ($scope,$rootScope, $http, $state) {
        console.log($state.current.name);
        $scope.classifyState = function (id,title) {
            $state.go($state.current.name+'-xx', {
                title: title,
                id: id
            });
        }
        $http({
            url: httpAddress + 'app/bid/collectTypeGroup.do',
            method:'POST',
            params:{
                APPCLIENTID:$rootScope.APPCLIENTID,
            }
        }).success(function (res) {
            if(res.success){
                $scope.collectGroup = res.data.slice(1);
            }
        })
    })
    .controller('searchController', function ($scope) {
        $scope.searchAction = function () {
            console.log($('#search').val());
        }
    })
    .controller('xxController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.title;
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $http({
            url: httpAddress + 'app/bid/getCollections.do',
            method:'POST',
            params:{
                "params[type_id]":$state.params.id,
                APPCLIENTID:$rootScope.APPCLIENTID
            }
        }).success(function (res) {
            if(res.success){

                $scope.xxlist = res.data.rows.slice(1);
            }
        })
    })
    .controller('loginController', function ($scope, $rootScope, $http, $state, $ionicPopup, $timeout, $cookies) {
        if(localStorage.getItem('userInfo')){
            $rootScope.APPCLIENTID = JSON.parse(localStorage.getItem('userInfo')).userName;
            $scope.username = JSON.parse(localStorage.getItem('userInfo')).userName;
            $scope.password = JSON.parse(localStorage.getItem('userInfo')).passWord;
        }
        // $scope.token = localStorage.getItem('token');
        // console.log($scope.username);
        var loginFn = function(id,psw){
            var userName = id;
            var passWord = psw;
            console.log(httpAddress);
            $http({
                url:httpAddress + 'app/sys/login.do',
                params: {
                    mobile: userName,
                    password: passWord
                },
                method: "POST",
                timeout: 10 * 1000

            }).success(function (data) {
                if (data.success) {
                    //                    console.log(JSON.stringify(data.info));
                    $rootScope.userInfo = JSON.stringify(data.info);
                    $cookies.put('userInfo', JSON.stringify(data.info));

                    localStorage.setItem('userInfo', '{"userName":"' + userName + '","passWord":"' + passWord + '"}');
                    localStorage.setItem('autoLogin', 1);
                    localStorage.setItem('token',data.data);
                    $rootScope.APPCLIENTID = userName;
                    $state.go('index.home'); //跳转首页
                }
                if (data.code) {
                    ajaxError(data.msg);
                }
            }).error(function(){
                ajaxFail();
            });
        };
        if(localStorage.getItem('token') && localStorage.getItem('autoLogin') == 1){
            $http({
                url:httpAddress + 'app/sys/ autoLogin.do',
                method:'POST',
                params:{
                    token:localStorage.getItem('token')
                }
            }).success(function(res){
                if(res.success){
                    $state.go('index.home');
                }else{
                    ajaxError(res.code);
                }
            }).error(function(){
                ajaxFail();
            });
        }
        $scope.validAcccount = function (id,psw) {
            loginFn(id,psw);
            
        }
    })
    .controller('memberController', function ($scope, $cookies, $state) {
        $scope.loginOut = function () {
            $cookies.remove('userInfo');
            localStorage.setItem('autoLogin', 0);
            $state.go('login');
        }
    })
    // 省份列表控制器
    .controller('provinceController',function ($scope,$http){
        $http({
            url:httpAddress+'app/res/provinces.do',
            method:'POST'
        }).success(function(res){
            if(res.success){
                $scope.provinces = res.data.slice(1);
            } 
        });
    })
