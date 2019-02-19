(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BuyerDashboardController", BuyerDashboardController);

    BuyerDashboardController.$inject = ["$location", "$q", "$filter", "$scope", "$uibModal", "helperService", "authService", "apiService", "appConfig", "$ocLazyLoad"];

    function BuyerDashboardController($location, $q, $filter, $scope, $uibModal, helperService, authService, apiService, appConfig, $ocLazyLoad) {
        var BuyerDashboardCtrl = this;

        function Init() {
            BuyerDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Buyer_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitCustom();
            BuyerDashboardCtrl.ePage.Masters.obj = undefined;

        }

        function InitCustom() {
            CheckOrg();
        }

        function CheckOrg() {
            // get Buyer ORG based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgUserAcess.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgUserAcess.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        checkCustomDashboard(response.data.Response[0]);
                    }
                }
            });
        }

        function checkCustomDashboard(obj) {
            var Key = obj.TenantCode + '_' + obj.ORG_Code;
            var _filter = {
                "Key": Key,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BuyerDashboardCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    BuyerDashboardCtrl.ePage.Masters.MenuListSource = $filter('filter')(BuyerDashboardCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Dashboard'
                    });
                    if (BuyerDashboardCtrl.ePage.Masters.MenuListSource.length > 0) {
                        oclazyLoadJs(BuyerDashboardCtrl.ePage.Masters.MenuListSource[0]);
                    } else {
                        var obj = {
                            Code: 'DASHBOARD_DEFAULT'
                        };
                        BuyerDashboardCtrl.ePage.Masters.obj = obj;
                    }
                }
            });
        }

        function oclazyLoadJs(obj) {
            var _arr = [];
            if (obj.Config) {
                if (typeof obj.Config == "string") {
                    obj.Config = JSON.parse(obj.Config);
                }

                if (obj.Config) {
                    if (obj.Config.Directives) {
                        var _index = obj.Config.Directives.indexOf(",");
                        if (_index != -1) {
                            var _split = obj.Config.Directives.split(",");

                            if (_split.length > 0) {
                                _split.map(function (obj, key) {
                                    var _index = _arr.map(function (obj1, key1) {
                                        return obj1;
                                    }).indexOf(obj);
                                    if (_index == -1) {
                                        _arr.push(obj);
                                    }
                                });
                            }
                        } else {
                            var _index = _arr.indexOf(obj.Config.Directives);
                            if (_index == -1) {
                                _arr.push(obj.Config.Directives);
                            }
                        }
                    }
                }
            }
            if (_arr.length > 0) {
                _arr = _arr.filter(function (e) {
                    return e;
                });
                $ocLazyLoad.load(_arr).then(function () {
                    DashboardShow(obj);
                }, function (response) {
                    DashboardShow(obj);
                });
            }

        }

        function DashboardShow(Obj) {
            BuyerDashboardCtrl.ePage.Masters.obj = Obj;
        }


        Init();
    }

})();