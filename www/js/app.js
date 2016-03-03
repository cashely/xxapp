// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.router', 'starter.controllers', 'ngCookies','ngCordova'])

.run(function ($ionicPlatform, $rootScope, $ionicModal, $http, $cordovaNetwork, $ionicSideMenuDelegate, $cookies, $cordovaToast, $location, $state, $ionicPopup, $timeout) {
    httpAddress = 'http://172.19.8.160:9202/rype-app/';
    $ionicPlatform.ready(function () {
        //禁止左侧菜单拖动
        //        $ionicSideMenuDelegate.canDragContent(false);

        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            $cordovaStatusbar.overlaysWebView(true);
            $cordovaStatusbar.style(2);
        };
        //    检测网络状态
        $rootScope.netState = $cordovaNetwork.isOnline();
        if (!$rootScope.netState) {
            $cordovaToast.show('网络没有链接', 'short', 'bottom');
        }
        $rootScope.netType = $cordovaNetwork.getNetwork();
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                $cordovaToast.show('网络已链接', 'short', 'bottom').then(function () {
                    $rootScope.netState = true;
                    $rootScope.netType = networkState;
                });
            })
            // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
            $cordovaToast.show('网络失去链接', 'short', 'bottom').then(function () {
                $rootScope.netState = false;
            });
        });
    });
    //    搜索模板
    $ionicModal.fromTemplateUrl('views/search.html', {
        scope: $rootScope,
        animation: 'slide-in-left'
    }).then(function (modal) {
        $rootScope.searchModal = modal;
    });
    $rootScope.openSearchModal = function () {
        $rootScope.searchModal.show();
    };
    $rootScope.hideSearchModal = function () {
        $rootScope.searchModal.hide();
    }

    //                            显示MAP
    $ionicModal.fromTemplateUrl('views/map.html', {
        scope: $rootScope,
        animation: 'slide-in-left'
    }).then(function (modal) {
        $rootScope.mapModal = modal;
    });
    $rootScope.showMapModal = function (longg, latt) {
        $rootScope.mapModal.show();
        //        手动指定地图显示区域的大小
        var mapDiv = $('#allmap');
        mapDiv.height($(document).height() - 44);
        //异步加载百度地图
        function loadJScript() {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://api.map.baidu.com/api?v=2.0&ak=f4fgkNjsGDjU2BNT5tMPGTGn&callback=init";
            document.body.appendChild(script);
        }
        window.init = function () {
            var map = new BMap.Map("allmap"); // 创建Map实例

            //            标记地图
            //            var point = new BMap.Point(latt, longg); // 创建点坐标
            //            map.centerAndZoom(point, 9);
            //            map.enableScrollWheelZoom(); //启用滚轮放大缩小
            //            //            var new_point = new BMap.Point(116.404, 39.915);
            //            var marker = new BMap.Marker(point); // 创建标注
            //            map.addOverlay(marker); // 将标注添加到地图中
            //            marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            //            map.panTo(point);
            //            路径导航地图
            map.centerAndZoom(new BMap.Point($rootScope.locationAddress.lat, $rootScope.locationAddress.long), 9);
            var p1 = new BMap.Point($rootScope.locationAddress.lat, $rootScope.locationAddress.long);
            var p2 = new BMap.Point(latt, longg);

            var driving = new BMap.DrivingRoute(map, {
                renderOptions: {
                    map: map,
                    autoViewport: true
                }
            });
            driving.search(p1, p2);
        }
        loadJScript(); //异步加载地图
    };
    $rootScope.hideMapModal = function () {
        $rootScope.mapModal.hide();
    };
    //双击退出程序
    $ionicPlatform.registerBackButtonAction(function (e) {
        //判断处于哪个页面时双击退出
        if ($location.path() == '/index/home') {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        } else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortBottom('再按一次退出系统');
            setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        return false;
    }, 101);



    // 公共方法
    ajaxMsg = function(msg){
        var alertPopup = $ionicPopup.alert({
                            title: '温馨提示',
                            template: 'msg'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 3000);
    }
    ajaxError = function(msg){
        var alertPopup = $ionicPopup.alert({
                            title: '温馨提示',
                            template: msg
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 3000);
    }
    ajaxFail = function(){
        var alertPopup = $ionicPopup.alert({
                            title: '温馨提示',
                            template: '网络错误！'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 3000);
    }

})
