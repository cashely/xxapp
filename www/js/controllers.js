angular.module('starter.controllers', [])
    .controller('homeController', function ($scope, $http, $rootScope, $state, $ionicNavBarDelegate, $ionicSlideBoxDelegate) {
        $scope.hotPost = [];
        var page = 1,
            ps = 5,
            total = 100;
        $scope.loadMoreHotPost = function () {
            if ($scope.hotPost.length >= total) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return false;
            }
            isload = true;
            loadHotArticle(function (data) {
                total = data.data.total;
                page++;
                var content = (data.data.rows).slice(1);
                for (v in content) {
                    $scope.hotPost.push(content[v]);
                }
                // console.log((data.data.rows).length);
                isload = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        var loadHotArticle = function (callback) {
            requestData('app/bid/hotArticles.do', {
                pageNo: page,
                pageSize: ps,
                APPCLIENTID: $rootScope.APPCLIENTID
            }, function (res) {
                callback(res);
            })
        }


        $scope.cancelMoreLoad = function () {
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
            url: httpAddress + 'app/bid/carousels.do',
            method: 'POST'
        }).success(function (res) {
            if (res.success) {
                $scope.hotImg = (res.data).slice(1);
                $ionicSlideBoxDelegate.update();
            };
        });
        // 下拉刷新数据
        $scope.doRefresh = function () {
            page = 1;
            loadHotArticle(function (data) {
                total = data.data.total;
                page++;
                $scope.hotPost = (data.data.rows).slice(1);

                $scope.$broadcast('scroll.refreshComplete')
            })
        }
    })
    //手机验证
    .controller('regCodeController', function ($scope, $rootScope, $ionicPopup, $state, $timeout, $http) {
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
                $scope.phoneSendCode = i + 's后可重发';
                t = setInterval(function () {
                    if (i > 1) {
                        i--;
                        $scope.phoneSendCode = i + 's后可重发';
                        $scope.$apply()
                    } else {
                        $scope.phoneSendCode = '发送验证码';
                        $scope.buttonDisable = true;
                        clearInterval(t);
                        $scope.$apply()
                    }
                }, 1000);
                //                远程请求发送手机发送验证码
                requestData('app/sys/sendVCode.do', {
                    mobile: num,
                    busCode: 'R'
                }, function (res) {
                    ajaxMsg('验证码发送成功');
                })
            }
        };
        $scope.checkPhone = function (phoneNum, code) {
            requestData('app/sys/checkVCode.do', {
                vcode: code,
                APPCLIENTID: phoneNum
            }, function (res) {
                $rootScope.regPhone = phoneNum; //记录全局手机变量
                if (res.success) {
                    $state.go('reg.form', {
                        phone: phoneNum,
                        code: code
                    });
                } else {
                    ajaxError(res.code);
                }
            })
        }
    })
    .controller('regFormController', function ($scope, $rootScope, $state, $http) {
        $scope.regAction = function (name, mail, psw) {
            console.log(name + ',' + mail + ',' + psw);
            $http({
                url: httpAddress + 'app/sys/regist.do',
                params: {
                    nickname: name,
                    email: mail,
                    tel: $rootScope.regPhone,
                    password: psw,
                    APPCLIENTID: $rootScope.regPhone
                },
                method: 'POST'
            }).success(function (res) {
                if (res.success) {
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
        $scope.province = '加载中';
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner>正在获取位置'
        });
        var posOptions = {
            timeout: 5000,
            enableHighAccuracy: true
        };

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var position = new BMap.Marker(r.point);
                var lat = position.point.lat;
                var long = position.point.lng;
                $rootScope.locationAddress = {
                    long: position.point.lat,
                    lat: position.point.lng
                };
                $ionicLoading.hide();
                $http.jsonp('http://api.map.baidu.com/geocoder/v2/?ak=f4fgkNjsGDjU2BNT5tMPGTGn&location=' + lat + ',' + long + '&output=json&pois=1&callback=JSON_CALLBACK').success(function (info) {
                    console.log(info);
                    $scope.province = info.result.addressComponent.province;
                    $ionicLoading.hide();
                    $rootScope.JGposition = {
                        longitude: long,
                        latitude: lat
                    };
                    getAddressList();
                });
            } else {
                alert('failed' + this.getStatus());
            }
        }, {
            enableHighAccuracy: true
        });

        // 获取省份列表数据
        var getAddressList = function (address) {
            requestData('app/res/orgNav.do', {
                provName: $scope.province.replace('省',''),
                APPCLIENTID: $scope.APPCLIENTID
            }, function (res) {
                console.log($scope.province);
                console.log(res, '获取机构导航数据');
                $scope.companyList = res.data.slice(1);
            })
        };
        

    })
    .controller('classifyController', function ($scope, $http, $state) {
        $scope.classifyState = function (title) {
            $state.go('index.member-sub-xx', {
                title: title
            });
        };
        requestData('app/cfg/catNav.do', {}, function (res) {
            $scope.classify = res.data;
            var oldArr = [];
            oldArr.push(res.data.T.slice(0, 2));
            oldArr.push(res.data.T.slice(2));
            console.log(oldArr);
            $scope.classify.T = oldArr;

        })
    })
    .controller('typeController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.type;
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $http({
            url: httpAddress + 'app/bid/childrenTypes.do',
            method: 'POST',
            params: {
                root_type: $state.params.title,
                APPCLIENTID: $rootScope.APPCLIENTID
            }
        }).success(function (res) {
            if (res.success) {

                $scope.xxlist = res.data.rows.slice(1);
            }
        })
    })
    .controller('indexsubController', function ($scope, $rootScope, $http, $state) {
        $scope.classifyState = function (id, title) {
            $state.go($state.current.name + '-xx', {
                title: title,
                id: id
            });
        }
        $http({
            url: httpAddress + 'app/bid/subArtTypesGroup.do',
            method: 'POST',
            params: {
                APPCLIENTID: $rootScope.APPCLIENTID,
                sub_state: '1'
            }
        }).success(function (res) {
            if (res.success) {
                $scope.subGroup = res.data.slice(1);
            }
        })
    })
    //回收站省份列表
    .controller('RecycleController', function ($scope, $rootScope, $http, $state) {
        $scope.classifyState = function (id, title) {
            $state.go($state.current.name + '-xx', {
                title: title,
                id: id
            });
        }
        $http({
            url: httpAddress + 'app/bid/subArtTypesGroup.do',
            method: 'POST',
            params: {
                APPCLIENTID: $rootScope.APPCLIENTID,
                sub_state: '0'
            }
        }).success(function (res) {
            if (res.success) {
                $scope.recycleGroup = res.data.slice(1);
            }
        })
    })
    .controller('collectController', function ($scope, $rootScope, $http, $state) {
        console.log($state.current.name);
        $scope.classifyState = function (id, title) {
            $state.go($state.current.name + '-xx', {
                title: title,
                id: id
            });
        }
        $http({
            url: httpAddress + 'app/bid/collectTypeGroup.do',
            method: 'POST',
            params: {
                APPCLIENTID: $rootScope.APPCLIENTID,
            }
        }).success(function (res) {
            if (res.success) {
                $scope.collectGroup = res.data.slice(1);
            }
        })
    })
    .controller('getCollectListController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.type;
        $scope.xxlist = [];
        var page = 1,
            ps = 5,
            total = 100;
        $scope.isScroll = true;
        //                            默认选择条件
        $scope.opt = {
            date: '',
            provice: null,
            type: ''
        };

        function reSet(rd, im) {
            var readVal = rd || '';
            var importVal = im || '';
            page = 1;
            $scope.xxlist = [];
            loadList(readVal, importVal);
        }
        $scope.buttonArray = {
            important: '',
            read: ''
        };
        $scope.actionAllImportant = function () {
            $scope.buttonArray.important = '5';
            reSet();
        }

        $scope.actionUngency = function () {
            $scope.buttonArray.important = '3';
            reSet();
        };
        $scope.actionImport = function () {
            $scope.buttonArray.important = '';
            reSet();
        };

        $scope.actionAllRead = function () {
            $scope.buttonArray.read = '0';
            reSet();
        };
        $scope.actionUnRead = function () {
            $scope.buttonArray.read = '1';
            reSet();
        };
        $scope.actionHasRead = function () {
            $scope.buttonArray.read = '';
            reSet();
        };
        $scope.actionAll = function () {
            reSet();
        };
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $scope.loadMoreClassifyxx = function () {
            loadList();
        };
        var loadList = function (rd, im) {
            var importVal = im || '';
            var readVal = rd || '';
            var params = {
                pageNo: page,
                "params[root_type_id]": $state.params.id,
                APPCLIENTID: $rootScope.APPCLIENTID,
                "params[date_flag]": $scope.opt.date,
                "params[info_area]": $scope.opt.provice,
                "params[type_id]": $scope.opt.type,
                "params[import_val]": importVal,
                "params[read_flag]": readVal
            };
            requestData('app/bid/getCollections.do', params, function (res) {
                if (res.success) {

                    for (var i in res.data.rows.slice(1)) {
                        $scope.xxlist.push(res.data.rows.slice(1)[i]);
                    }
                    if ($scope.xxlist.length >= res.data.total) {
                        $scope.isScroll = false;
                    }else{
                        $scope.isScroll = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                }
            });
        };
        $scope.changeOption = function () {
                reSet();
            }
            // 获取没有阅读的文章数量
        var unread = function () {
            requestData('app/bid/getUnreadSubArticles.do', {
                APPCLIENTID: $rootScope.APPCLIENTID
            }, function (res) {
                console.log(res.data, '我的未读文章数据');
                $scope.unreadTotal = res.data;

            });
        }
        unread();
        //获取按文章分类
        requestData('app/bid/collectTypeGroup.do', {
            root_type_id: $state.params.id,
            APPCLIENTID: $rootScope.APPCLIENTID
        }, function (res) {
            $scope.articleTypeList = res.data.slice(1);
        });
        //获取省份列表
        requestData('app/bid/subAreasGroup.do', {
            root_type_id: $state.params.id,
            APPCLIENTID: $scope.APPCLIENTID
        }, function (res) {
            $scope.provinces = res.data.slice(1);
        })
    })
    .controller('loginController', function ($scope, $rootScope, $http, $state, $ionicPopup, $timeout, $cookies) {
        if (localStorage.getItem('userInfo')) {
            // $rootScope.APPCLIENTID = JSON.parse(localStorage.getItem('userInfo')).userName;
            $scope.username = JSON.parse(localStorage.getItem('userInfo')).userName;
            $scope.password = JSON.parse(localStorage.getItem('userInfo')).passWord;
        }
        // $scope.token = localStorage.getItem('token');
        // console.log($scope.username);
        // 握手建立
        $http({
            url: httpAddress + 'app/sys/handshake.do',
            method: 'POST',
            params: {
                token: localStorage.getItem('token')
            }
        }).success(function (res) {
            if (res.success) {
                $rootScope.APPCLIENTID = res.data.sid;
                localStorage.setItem('sid', res.data.sid);
                if (res.data.loginStatus == 'T' && localStorage.getItem('autoLogin') == 1) {
                    $state.go('index.home');
                }
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
            }
        })
        var loginFn = function (id, psw) {
            var userName = id;
            var passWord = psw;
            console.log(httpAddress);
            $http({
                url: httpAddress + 'app/sys/login.do',
                params: {
                    mobile: userName,
                    password: passWord,
                    APPCLIENTID: $rootScope.APPCLIENTID
                },
                method: "POST",
                timeout: 10 * 1000
            }).success(function (data) {
                if (data.success) {
                    $rootScope.sid = localStorage.getItem('sid');
                    $rootScope.userInfo = JSON.stringify(data.info);
                    localStorage.setItem('userInfo', '{"userName":"' + userName + '","passWord":"' + passWord + '"}');
                    localStorage.setItem('autoLogin', 1);
                    localStorage.setItem('token', data.data);
                    $state.go('index.home'); //跳转首页
                }
                if (data.code) {
                    ajaxError(data.msg);
                }
            }).error(function () {
                ajaxFail();
            });
        };
        $scope.validAcccount = function (id, psw) {
            loginFn(id, psw);

        }
    })
    .controller('memberController', function ($scope, $cookies, $state) {
        $scope.loginOut = function () {
            $cookies.remove('userInfo');
            console.log(22);
            localStorage.setItem('autoLogin', 0);
            $state.go('login');
        }
    })
    // 省份列表控制器
    .controller('provinceController', function ($scope, $http) {
        $http({
            url: httpAddress + 'app/res/provinces.do',
            method: 'POST'
        }).success(function (res) {
            if (res.success) {
                $scope.provinces = res.data.slice(1);
            }
        });
    })
    //搜索
    .controller('searchController', function ($scope, $http, $rootScope) {
        $scope.isScroll = false;
        var page = 1,
            ps = 5;
        $scope.searchList = [];
        $scope.search = function () {
            page = 1;
            $scope.searchList = [];
            $scope.isScroll = true;
            $scope.searchLoadMore();
        }
        $scope.searchLoadMore = function () {
            $http({
                url: httpAddress + 'app/bid/solr.do',
                params: {
                    pageNo: page,
                    "params[p]": encodeURI($scope.searchStr),
                    APPCLIENTID: $rootScope.APPCLIENTID
                },
                method: 'POST'
            }).success(function (res) {
                if (res.success) {
                    page++;
                    for (var i in res.data.rows.slice(1)) {
                        $scope.searchList.push(res.data.rows.slice(1)[i]);
                    }
                    if ($scope.searchList.length >= res.data.total) {
                        $scope.isScroll = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            })
        }
    })
    .controller('setSubController', function ($scope, $ionicModal, $rootScope) {
        $scope.showTypeList = function (id) {
            $rootScope.areaId = id;
            $ionicModal.fromTemplateUrl('views/typeModal.html', {
                scope: $scope,
                animate: 'slide-in-left'
            }).then(function (modal) {

                $scope.typeModal = modal;
                $scope.typeModal.show();

                console.log(id, '省份id');
            });
        };

        function loadProvices() {
            //获取省份列表
            requestData('app/bid/areasForSub.do', {
                APPCLIENTID: $scope.APPCLIENTID
            }, function (res) {
                $scope.subProvinces = res.data.slice(1);
            });
        };
        loadProvices();
    })
    .controller('subTypeController', function ($scope) {
        requestData('app/bid/typesForSub.do', {
            APPCLIENTID: $scope.APPCLIENTID,
            area_id: $scope.areaId
        }, function (res) {
            $scope.types = res.data.slice(1);
        });
        $scope.hideTypeModal = function () {
            $scope.$broadcast('bb', 'child');
            $scope.typeModal.remove();
        };
        $scope.addType = function () {
            var subArr = [];
            $.each($('#subTypes input:checked'), function () {
                subArr.push($(this).val());
            });
            requestData('app/bid/subscribe.do', {
                APPCLIENTID: $scope.APPCLIENTID,
                area_id: $scope.areaId,
                types: subArr.join(',')
            }, function () {
                $scope.typeModal.remove();
            });
        };
    })
    .controller('getClassifyController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.type;
        $scope.xxlist = [];
        var page = 1,
            ps = 5,
            total = 100;
        $scope.isScroll = true;
        //                            默认选择条件
        $scope.opt = {
            date: '',
            provice: '',
            type: ''
        };

        function reSet(rd, im) {
            var readVal = rd || '';
            var importVal = im || '';
            page = 1;
            $scope.xxlist = [];
            loadList(readVal, importVal);
        };
        $scope.buttonArray = {
            important: '',
            read: ''
        };
        $scope.actionAllImportant = function () {
            $scope.buttonArray.important = '5';
            reSet();
        }

        $scope.actionUngency = function () {
            $scope.buttonArray.important = '3';
            reSet();
        };
        $scope.actionImport = function () {
            $scope.buttonArray.important = '';
            reSet();
        };

        $scope.actionAllRead = function () {
            $scope.buttonArray.read = '0';
            reSet();
        };
        $scope.actionUnRead = function () {
            $scope.buttonArray.read = '1';
            reSet();
        };
        $scope.actionHasRead = function () {
            $scope.buttonArray.read = '';
            reSet();
        };
        $scope.actionAll = function () {
            reSet();
        };
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $scope.loadMoreClassifyxx = function () {
            loadList();
            console.log('22');
        };
        var loadList = function (rd, im) {
            var readVal = rd || '';
            var importVal = im || '';
            var params = {
                pageNo: page,
                "params[root_type]": $state.params.id,
                APPCLIENTID: $rootScope.APPCLIENTID,
                "params[date_flag]": $scope.opt.date,
                "params[info_area]": $scope.opt.provice,
                "params[type_id]": $scope.opt.type,
                "params[read_flag]": $scope.buttonArray.read,
                "params[import_val": $scope.buttonArray.important
            };
            requestData('app/bid/getArticles.do', params, function (res) {
                if (res.success) {
                    page++;
                    for (var i in res.data.rows.slice(1)) {
                        $scope.xxlist.push(res.data.rows.slice(1)[i]);
                    }
                    if ($scope.xxlist.length >= res.data.total) {
                        $scope.isScroll = false;
                    }else{
                        $scope.isScroll = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        };
        $scope.changeOption = function () {
                reSet();
            }
            // 获取没有阅读的文章数量
        var unread = function () {
            requestData('app/bid/getUnreadSubArticles.do', {
                APPCLIENTID: $rootScope.APPCLIENTID
            }, function (res) {
                console.log(res.data, '我的未读文章数据');
                $scope.unreadTotal = res.data;

            });
        }
        unread();
        //获取按文章分类
        $http({
            url: httpAddress + 'app/bid/childrenTypes.do',
            method: 'POST',
            params: {
                root_type: $state.params.id,
                APPCLIENTID: $rootScope.APPCLIENTID
            }
        }).success(function (res) {
            if (res.success) {
                $scope.articleTypeList = res.data.slice(1);
                console.log($scope.articleTypeList);
            }
        }).error(function (res) {
            ajaxFail();
        })
    })
    //获取订阅文章分类列表
    .controller('getsubListController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.type;
        $scope.xxlist = [];
        var page = 1,
            ps = 5,
            total = 100;
        $scope.isScroll = true;
        //                            默认选择条件
        $scope.opt = {
            date: '',
            provice: null,
            type: ''
        };

        function reSet(rd, im) {
            var readVal = rd || '';
            var importVal = im || '';
            page = 1;
            $scope.xxlist = [];
            loadList(readVal, importVal);
        }
        $scope.buttonArray = {
            important: '',
            read: ''
        };
        $scope.actionAllImportant = function () {
            $scope.buttonArray.important = '5';
            reSet();
        }

        $scope.actionUngency = function () {
            $scope.buttonArray.important = '3';
            reSet();
        };
        $scope.actionImport = function () {
            $scope.buttonArray.important = '';
            reSet();
        };

        $scope.actionAllRead = function () {
            $scope.buttonArray.read = '0';
            reSet();
        };
        $scope.actionUnRead = function () {
            $scope.buttonArray.read = '1';
            reSet();
        };
        $scope.actionHasRead = function () {
            $scope.buttonArray.read = '';
            reSet();
        };
        $scope.actionAll = function () {
            reSet();
        };
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $scope.loadMoreClassifyxx = function () {
            loadList();
        };
        var loadList = function (rd, im) {
            var importVal = im || '';
            var readVal = rd || '';
            var params = {
                pageNo: page,
                "params[root_type_id]": $state.params.id,
                APPCLIENTID: $rootScope.APPCLIENTID,
                "params[date_flag]": $scope.opt.date,
                "params[info_area]": $scope.opt.provice,
                "params[type_id]": $scope.opt.type,
                "params[read_flag]": readVal,
                "params[import_val]": importVal

            };
            requestData('app/bid/getSubscriptions.do', params, function (res) {
                if (res.success) {
                    page++;
                    for (var i in res.data.rows.slice(1)) {
                        $scope.xxlist.push(res.data.rows.slice(1)[i]);
                    }
                    if ($scope.xxlist.length >= res.data.total) {
                        $scope.isScroll = false;
                    }else{
                        $scope.isScroll = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        };
        $scope.changeOption = function () {
                reSet();
            }
            // 获取没有阅读的文章数量
        var unread = function () {
            requestData('app/bid/getUnreadSubArticles.do', {
                APPCLIENTID: $rootScope.APPCLIENTID
            }, function (res) {
                console.log(res.data, '我的未读文章数据');
                $scope.unreadTotal = res.data;

            });
        }
        unread();

        $scope.getUnreadList = function () {
                page = 1;
                $scope.xxlist = [];
                $scope.isScroll = true;
                loadList('0');
            }
            //获取按文章分类
        $http({
                url: httpAddress + 'app/bid/subArtTypesGroup.do',
                method: 'POST',
                params: {
                    root_type_id: $state.params.id,
                    APPCLIENTID: $scope.APPCLIENTID
                }
            }).success(function (res) {
                if (res.success) {
                    $scope.articleTypeList = res.data.slice(1);
                    console.log($scope.articleTypeList);
                }
            }).error(function (res) {
                ajaxFail();
            })
            //获取省份列表
        requestData('app/bid/subAreasGroup.do', {
            root_type_id: $state.params.id,
            APPCLIENTID: $scope.APPCLIENTID
        }, function (res) {
            $scope.provinces = res.data.slice(1);
        })
    })
    //获取回收站分类列表
    .controller('getRecycleListController', function ($scope, $rootScope, $state, $stateParams, $http) {
        $scope.type = $state.params.type;
        $scope.xxlist = [];
        var page = 1,
            ps = 5,
            total = 100;
        $scope.isScroll = true;
        //                            默认选择条件
        $scope.opt = {
            date: '',
            provice: null,
            type: ''
        };

        function reSet(rd, im) {
            var readVal = rd || '';
            var importVal = im || '';
            page = 1;
            $scope.xxlist = [];
            loadList(readVal, importVal);
        };
        $scope.buttonArray = {
            important: '',
            read: ''
        };
        $scope.actionAllImportant = function () {
            $scope.buttonArray.important = '5';
            reSet();
        }

        $scope.actionUngency = function () {
            $scope.buttonArray.important = '3';
            reSet();
        };
        $scope.actionImport = function () {
            $scope.buttonArray.important = '';
            reSet();
        };

        $scope.actionAllRead = function () {
            $scope.buttonArray.read = '0';
            reSet();
        };
        $scope.actionUnRead = function () {
            $scope.buttonArray.read = '1';
            reSet();
        };
        $scope.actionHasRead = function () {
            $scope.buttonArray.read = '';
            reSet();
        };
        $scope.actionAll = function () {
            reSet();
        };
        $scope.share = function (msg) {
            window.plugins.socialsharing.share(msg);
        }
        $scope.loadMoreClassifyxx = function () {
            loadList();
        };
        var loadList = function (rd, im) {
            var importVal = im || '';
            var readVal = rd || '';
            var params = {
                pageNo: page,
                "params[root_type_id]": $state.params.id,
                APPCLIENTID: $rootScope.APPCLIENTID,
                "params[date_flag]": $scope.opt.date,
                "params[info_area]": $scope.opt.provice,
                "params[type_id]": $scope.opt.type,
                "params[read_flag]": readVal,
                "params[import_val]": importVal
            };
            requestData('app/bid/getRecycledSubscriptions.do', params, function (res) {
                if (res.success) {
                    page++;
                    for (var i in res.data.rows.slice(1)) {
                        $scope.xxlist.push(res.data.rows.slice(1)[i]);
                    }
                    if ($scope.xxlist.length >= res.data.total) {
                        $scope.isScroll = false;
                    }else{
                        $scope.isScroll = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        };
        $scope.changeOption = function () {
                reSet();
            }
            // 获取没有阅读的文章数量
        var unread = function () {
            requestData('app/bid/getUnreadSubArticles.do', {
                APPCLIENTID: $rootScope.APPCLIENTID
            }, function (res) {
                console.log(res.data, '我的未读文章数据');
                $scope.unreadTotal = res.data;

            });
        }
        unread();
        //获取按文章分类
        $http({
                url: httpAddress + 'app/bid/subArtTypesGroup.do',
                method: 'POST',
                params: {
                    root_type_id: $state.params.id,
                    APPCLIENTID: $scope.APPCLIENTID
                }
            }).success(function (res) {
                if (res.success) {
                    $scope.articleTypeList = res.data.slice(1);
                    console.log($scope.articleTypeList);
                }
            }).error(function (res) {
                ajaxFail();
            })
            //获取省份列表
        requestData('app/bid/subAreasGroup.do', {
            root_type_id: $state.params.id,
            APPCLIENTID: $scope.APPCLIENTID
        }, function (res) {
            $scope.provinces = res.data.slice(1);
        });
        //还原文章
        $scope.enableSub = function (num) {
            requestData('app/bid/enableSubscription.do', {
                id: num,
                APPCLIENTID: $scope.APPCLIENTID
            }, function (res) {
                reSet();
                ajaxMsg('操作成功！');
            })
        }
    })
    .controller('pageController', function ($scope, $rootScope, $timeout, $state, $http, $ionicNavBarDelegate, $ionicActionSheet, $ionicSideMenuDelegate) {
        $scope.commentList = [];
        $scope.commentInput = '';
        $scope.showHistory = function () {
            console.log(1);
            $ionicSideMenuDelegate.$getByHandle('pageSide')._instances[0].toggleLeft();
        }
        $scope.hidePageModal = function () {
            $scope.pageModal.hide();
        }
        $rootScope.getPage = function (id) {
                if ($state.$current.name == 'index.home-sub-xx') {
                    $scope.sheetShow = true;
                }
                // 获取文章内容
                $rootScope.pageId = id;
                $scope.pageId = id;
                if ($ionicSideMenuDelegate.$getByHandle('pageSide')._instances[0].isOpen()) {
                    $ionicSideMenuDelegate.$getByHandle('pageSide')._instances[0].toggleLeft();
                };
                $http({
                    url: httpAddress + 'app/bid/getArticle.do',
                    method: 'POST',
                    params: {
                        id: id,
                        APPCLIENTID: $scope.APPCLIENTID
                    },
                    cache: false
                }).success(function (res) {
                    console.log(res.data);
                    if (res.success) {
                        $rootScope.post = res.data;
                        $scope.post = res.data;
                    }
                });
                // 获取项目历史
                $http({
                    url: httpAddress + 'app/bid/refArticles.do',
                    method: 'POST',
                    params: {
                        "params[id]": id,
                        APPCLIENTID: $scope.APPCLIENTID
                    }
                }).success(function (res) {
                    $scope.postHistory = res.data.rows.slice(1);
                    console.log('项目历史', $scope.postHistory);
                }).error(function (res) {
                    ajaxFail();
                });
                // 获取评论
                $http({
                    url: httpAddress + 'app/bid/getComments.do',
                    params: {
                        "params[aid]": id,
                        APPCLIENTID: $scope.APPCLIENTID
                    },
                    method: 'POST'
                }).success(function (res) {
                    if (res.success) {
                        $scope.commentList = res.data.rows.slice(1);
                    }
                });
            }
            // 添加收藏
        $scope.addCollected = function () {
            console.log($scope.pageId);
            $http({
                url: httpAddress + 'app/bid/collect.do',
                params: {
                    infoId: $scope.pageId,
                    APPCLIENTID: $scope.APPCLIENTID
                },
                method: 'POST'
            }).success(
                // success
                function (res) {
                    if (res.success) {
                        $scope.post.collected = true;
                    }
                }).error(
                // fail
                function (res) {
                    ajaxFail();
                });
        }
        $scope.cancelCollected = function (num) {
                $http({
                    url: httpAddress + 'app/bid/removeCollection.do',
                    params: {
                        infoId: $scope.pageId,
                        APPCLIENTID: $scope.APPCLIENTID
                    },
                    method: 'POST'
                }).success(
                    // success
                    function (res) {
                        if (res.success) {
                            $scope.post.collected = false;
                        }
                    },
                    // fail
                    function (res) {
                        ajaxFail();
                    });
            }
            // 发表评论
        $scope.pushComment = function (text) {
            $http({
                url: httpAddress + 'app/bid/comment.do',
                method: 'POST',
                params: {
                    msg_id: $scope.pageId,
                    APPCLIENTID: $scope.APPCLIENTID,
                    content: text
                }
            }).success(function (res) {
                if (res.success) {
                    requestData('app/bid/getComments.do', {
                        "params[aid]": $scope.pageId,
                        APPCLIENTID: $scope.APPCLIENTID
                    }, function (res) {
                        $scope.commentList = res.data.rows.slice(1);
                    })
                }
            }).error(function (res) {
                ajaxFail();
            })
        }
        $scope.showPageSheet = function () {
            if ($state.$current.name == 'index.home-sub-xx') {
                var sheet = $ionicActionSheet.show({
                    destructiveText: '删除',
                    titleText: '更多操作',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                        console.log('cancel');
                    },
                    destructiveButtonClicked: function () {
                        requestData('app/bid/disableSubscription.do', {
                            id: $scope.pageId,
                            APPCLIENTID: $scope.APPCLIENTID
                        }, function (res) {
                            sheet();
                            $scope.pageModal.hide();
                            ajaxMsg('操作成功！');
                        })
                    }
                });
            } else {
                var sheet = $ionicActionSheet.show({
                    buttons: [
                        {
                            text: '项目历史'
                        }
                    ],
                    titleText: '更多操作',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                        console.log('cancel');
                    },
                    buttonClicked: function (index) {
                        if (index == 0) {
                            if ($scope.postHistory.length != 0) {
                                sheet();
                                $ionicSideMenuDelegate.$getByHandle('pageSide')._instances[0].toggleLeft()
                            } else {
                                sheet();
                                ajaxMsg('该项目暂无项目历史');
                            }
                        }
                    }

                });
            }
        };
        //        打开url
        $scope.openSource = function (url) {
            window.open(url, '_blank');
        }
    })
    .controller('dateController', function () {
        var dateString = ['今天', '昨天', '前天', '上周', '上月'];
        var toDay = +new Date();
    })
    //数据查询
    .controller('dataSearchController', function ($scope, $state) {

    })
    //--数据查询类型
    .controller('dataSearchTypesController', function ($scope, $rootScope, $state, $ionicModal) {
        //    ----------页面标题
        $scope.placeHolder = {
            med: '请输入药品名称',
            company: '请输入生产企业'
        };
        $scope.title = $state.params.title;
        $scope.dataSearch = {
                zxFl: '',
                sortName: '',
                ente: '',
                vCat: '',
                province: '',
                project: '',
                medName: '',
                dosage: '',
                spec: '',
                zxFl: '',
                sortName: ''
            }
            //        重置查询条件
        $scope.reSetDataSearch = function () {
            $scope.dataSearch = {
                zxFl: '',
                sortName: '',
                ente: '',
                vCat: '',
                province: '',
                project: '',
                medName: '',
                dosage: '',
                spec: '',
                zxFl: '',
                sortName: ''
            }
        }
        var requestDateSearch = function (url, cb) {
            var callback = cb || function () {};
            requestData('app/query/' + url + '.do', {
                code: $state.params.code,
                v_cat: $scope.dataSearch.vCat,
                province: $scope.dataSearch.province,
                project: $scope.dataSearch.project,
                ente: $scope.dataSearch.ente,
                med_name: $scope.dataSearch.medName,
                dosage: $scope.dataSearch.dosage,
                spec: $scope.dataSearch.spec,
                zx_fl: $scope.dataSearch.zxFl,
                sort_name: $scope.dataSearch.sortName,
                APPCLIENTID: $scope.APPCLIENTID
            }, function (res) {
                callback(res);
            })
        }

        //获取排名项
        var getSortName = function () {
            requestDateSearch('groupSortName', function (res) {
                $scope.sortNameList = res.data;
            });
        }
        if ($state.params.code == 'E1') {
            getSortName();
        }

        //--获取省份
        var getProvince = function () {
            requestDateSearch('groupProvince', function (res) {
                $scope.provinceList = res.data;
            });
        }
        if ($state.params.code == 'D1') {
            getProvince();
        }
        $scope.getProvince = function () {
                requestDateSearch('groupProvince', function (res) {
                    $scope.provinceList = res.data;
                });
            }
            //--获取版本
        var getVcat = function () {
            requestDateSearch('groupVCat', function (res) {
                $scope.vCatList = res.data;
            });
        }
        console.log($state.params.code);
        if ($state.params.code == 'A2' || $state.params.code == 'A1' || $state.params.code == 'B1' || $state.params.code == 'B2' || $state.params.code == 'B3' || $state.params.code == 'A3' || $state.params.code == 'A4') {
            getVcat();
        }
        //--获取项目
        $scope.getProject = function () {
            requestDateSearch('groupProject', function (res) {
                $scope.projectList = res.data;
            });
        }

        //--获取药品名称
        $scope.getMedName = function () {
                $scope.placeHolder.med = '数据查询中...';
                //            if($scope.dataSearch.medName.length > 4){
                requestDateSearch('groupMedName', function (res) {
                    $scope.medNameList = res.data;
                    $scope.placeHolder.med = '请输入药品名称';
                });
                //            }
            }
            //--获取剂型
        $scope.getDosage = function () {
                requestDateSearch('groupDosage', function (res) {
                    $scope.dosageList = res.data;
                });
            }
            //--获取规格
        $scope.getSpec = function () {
                requestDateSearch('groupSpec', function (res) {
                    $scope.specList = res.data;
                });
            }
            //--获取生产企业
        $scope.getEnte = function () {
                $scope.placeHolder.company = '数据查询中...';
                //            if($scope.dataSearch.ente.length > 4){
                requestDateSearch('groupEnte', function (res) {
                    $scope.placeHolder.company = '请输入生产企业';
                    $scope.enteList = res.data;
                });
                //            }
            }
            //--获取中西分类
        $scope.getZxfl = function () {
            requestDateSearch('groupZXFL', function (res) {
                $scope.zxFlList = res.data;
            });
        }



        //--------查询详细页面
        $scope.actionDataSearch = function (type) {
            var modal = $ionicModal.fromTemplateUrl('views/data-search-' + type + '-list.html', {
                scope: $scope,
                animation: 'slide-in-left'
            });
            modal.then(function (modal) {
                $scope.dataSearchmodal = modal;
                $scope.dataSearchmodal.show();
            });
        }
        $scope.hideDataSearchModal = function () {
            $scope.dataSearchmodal.remove();
        }

        $scope.actionReed = function (num) {
            $ionicModal.fromTemplateUrl('views/data-search-reed.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.reedModal = modal;
                $scope.reedModal.show();
                requestData('app/query/regestProd.do', {
                    APPCLIENTID: $scope.APPCLIENTID,
                    id: num
                }, function (res) {
                    $scope.reedList = res.data.slice(1);
                })
            });

        };
        $scope.hideReedModal = function () {
            $scope.reedModal.remove();
        }


        $scope.actionReing = function (num) {
            $ionicModal.fromTemplateUrl('views/data-search-reing.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.reingModal = modal;
                $scope.reingModal.show();
                requestData('app/query/refProd.do', {
                    APPCLIENTID: $scope.APPCLIENTID,
                    id: num
                }, function (res) {
                    $scope.reingList = res.data.slice(1);
                })
            });

        };
        $scope.hideReingModal = function () {
            $scope.reingModal.remove();
        }

        $scope.actionRefa = function (num) {
            $ionicModal.fromTemplateUrl('views/data-search-ref-a.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $rootScope.refaModal = modal;
                $scope.refaModal.show();
                requestData('app/query/refProd.do', {
                    code: $state.params.code,
                    APPCLIENTID: $scope.APPCLIENTID,
                    id: num
                }, function (res) {
                    $scope.refaList = res.data.slice(1);
                })
            });

        };
        $scope.hideRefaModal = function (id) {
            $scope.refaModal.remove();
        }

        $scope.actionRefb = function (num) {
            $ionicModal.fromTemplateUrl('views/data-search-ref-b.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function (modal) {
                $scope.refbModal = modal;
                $scope.refbModal.show();
                requestData('app/query/refProd.do', {
                    code: $state.params.code,
                    APPCLIENTID: $scope.APPCLIENTID,
                    id: num
                }, function (res) {
                    $scope.refbList = res.data.slice(1);
                })
            });

        };
        $scope.hideRefbModal = function () {
            $scope.refbModal.remove();
        }

    })
    .controller('dataSearchRegistingController', function ($scope, $state) {
        console.log($scope.dataSearch);
    })
    .controller('dataSearchRegistedController', function ($scope, $state) {
        console.log($scope.dataSearch);
    })
    .controller('dataSearchRefController', function ($scope, $state) {})
    .controller('dataSearchTypesListController', function ($scope, $state) {
        console.log($scope.dataSearch);
        requestData('app/query/queryData.do', {
            code: $state.params.code,
            v_cat: $scope.dataSearch.vCat,
            province: $scope.dataSearch.province,
            project: $scope.dataSearch.project,
            ente: $scope.dataSearch.ente,
            med_name: $scope.dataSearch.medName,
            dosage: $scope.dataSearch.dosage,
            spec: $scope.dataSearch.spec,
            zx_fl: $scope.dataSearch.zxFl,
            sort_name: $scope.dataSearch.sortName,
            APPCLIENTID: $scope.APPCLIENTID
        }, function (res) {
            $scope.dataSearchTypesList = res.data.slice(1);
        });
    })
    .controller('getTitleController', function ($scope, $state) {
        $scope.title = $state.params.title;
    })
    .controller('shareController', function ($scope) {
        console.log($scope.post);
        var shareInfo = {
                url: 'http://testnapp.rype.cn/ymbsn/front/bidInfo/view.do?id=' + $scope.pageId,
                title: $scope.post.topic + ' ' + $scope.post.createDate,
                description: $scope.post.subject,
                imageUrl: 'http://ui.utimor.com/images/xxapp-icon.png',
                appName: '招标进行时'
            }
            // 分线给QQ好友
        $scope.shareQQ = function () {
            var args = {};
            args.url = shareInfo.url;
            args.title = shareInfo.title;
            args.description = shareInfo.description;
            args.imageUrl = shareInfo.imageUrl;
            args.appName = shareInfo.appName;
            YCQQ.shareToQQ(function () {
                console.log("share success");
            }, function (failReason) {
                console.log(failReason);
            }, args);
        };
        // 分享到qq空间
        $scope.shareQQzone = function ($scope) {
            var args = {};
            args.url = shareInfo.url;
            args.title = shareInfo.title;
            args.description = shareInfo.description;
            args.imageUrl = [shareInfo.imageUrl];
            YCQQ.shareToQzone(function () {
                console.log("share success");
            }, function (failReason) {
                console.log(failReason);
            }, args);
        };
        // 分享到微信
        $scope.shareWechat = function ($scope) {
            Wechat.share({
                message: {
                    title: shareInfo.title,
                    description: shareInfo.description,
                    thumb: shareInfo.imageUrl,
                    media: {
                        type: Wechat.Type.LINK,
                        webpageUrl: shareInfo.url
                    }
                },
                scene: Wechat.Scene.SESSION
            }, function () {
                console.log('success');
            }, function (res) {
                cosole.log('failed', res);
            });
        };
        // 分享到朋友圈
        $scope.shareWechatFriends = function ($scope) {
            Wechat.share({
                message: {
                    title: shareInfo.title,
                    description: shareInfo.description,
                    thumb: shareInfo.imageUrl,
                    media: {
                        type: Wechat.Type.LINK,
                        webpageUrl: shareInfo.url
                    }
                },
                scene: Wechat.Scene.TIMELINE
            }, function () {
                console.log('success');
            }, function (res) {
                cosole.log('failed', res);
            });
        }
    })
