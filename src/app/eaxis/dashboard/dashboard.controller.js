(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EAxisDashboardController", EAxisDashboardController);

    EAxisDashboardController.$inject = ["$window", "authService", "apiService", "helperService", "appConfig"];

    function EAxisDashboardController($window, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var EAxisDashboardCtrl = this;

        function Init() {
            EAxisDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            EAxisDashboardCtrl.ePage.Masters.ShipmentNoList = [{
                "PK": "2ee386be-f1f9-47fa-907d-e1a4c4c23d65",
                "Code": "S00301716"
            }, {
                "PK": "b4286ade-116a-4b5e-8780-0001ffbaac37",
                "Code": "S00220357"
            }];
            EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList = [];
            EAxisDashboardCtrl.ePage.Masters.TestSingleRecordView = TestSingleRecordView;
            EAxisDashboardCtrl.ePage.Masters.GetSingleRecordDetail = GetSingleRecordDetail;
            EAxisDashboardCtrl.ePage.Masters.FavList = false;

            GetReadOnlyList();
            // GetSaveSettingAndBasicFilterList("SHIPMENTSEARCH_TOP");
        }

        function GetSaveSettingAndBasicFilterList(typeCode) {
            apiService.get("eAxisAPI", appConfig.Entities.AppSettings.API.StaredFindAll.Url + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.Value = JSON.parse(value.Value);

                        EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList.push(value);
                    });
                }
                GetFavouriteList();
            });
        }

        function GetFavouriteList() {
            var _filter = {
                "EntitySource": "SHIPMENTSEARCH_FAVORITES,ORDERHEADER_FAVORITES",
                "AppCode": authService.getUserInfo().AppCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        value.Value = JSON.parse(value.Value);
                        if (value.Value.ShowInDashboard === true) {
                            EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList.push(value);
                        }
                    });
                }
                EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList.map(function (value, key) {
                    if (value.EntitySource == "USER") {
                        value.SourceEntityRefKey = value.Value.Label;
                    }
                    GetFavouriteAndBasicFilterCount(value, key);
                });
            });
        }

        function GetFavouriteAndBasicFilterCount(obj, key) {
            if (obj != undefined) {
                var objData = obj.Value;
                if (objData.ShowCount) {
                    EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key].ShowCount = objData.ShowCount;
                    EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key].IsExcute = objData.IsExcute;
                }
                if (objData.CountInput != undefined) {
                    objData.CountInput.map(function (value, key) {
                        var x = value.value;
                        var y = x.charAt(0);
                        if (y == '@') {
                            var date = helperService.DateFilter(x);
                            value.value = date;
                        } else {
                            value.value = value.value;
                        }
                    });
                } else {
                    console.log("test");
                }
                var urlInput = objData.CountAPI;
                var StringUrl = '';
                urlInput.split('/').map(function (ele) {
                    var el = ele.charAt(0);
                    if (el == '@') {
                        var urlFilter = helperService.DateFilter(ele);
                        StringUrl += '/' + urlFilter;
                    } else {
                        StringUrl += '/' + ele;
                    }
                })
                var filterId = objData.CountFilterID;
                var _input = {
                    "searchInput": objData.CountInput,
                    "FilterID": filterId
                };
                if (objData.CountRequestMethod == 'get') {
                    apiService.get("eAxisAPI", StringUrl.substr(1)).then(function (response) {
                        EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key]['Count'] = response.data.Response;
                    });
                } else {
                    apiService.post("eAxisAPI", StringUrl.substr(1), _input).then(function (response) {
                        EAxisDashboardCtrl.ePage.Masters.FavouriteAndBasicFilterList[key]['Count'] = response.data.Response;
                    });
                }
            }
        }

        function GetReadOnlyList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "OperationType": "NOCTRL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecOperation.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecOperation.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    helperService.ComponentBasedAccess = response.data.Response;
                }
            });
        }

        function GetSingleRecordDetail() {
            var _queryString = {
                "Orgin": 'INMAA',
                "TransportMode": 'AIR'
            }
            var value = _queryString;
            $window.open("#/EA/shipment?a=" + helperService.encryptData(value));
        }

        function TestSingleRecordView(curEntity) {
            var _queryString = {
                "PK": curEntity.PK,
                "Code": curEntity.Code
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }

        Init();
    }

})();
