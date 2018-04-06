(function () {
    "use strict";
    angular
        .module("Application")
        .controller("LocationDashboardController", LocationDashboardController);

    LocationDashboardController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "locationConfig", "helperService", "$uibModal", "$http", "$filter", "appConfig", "authService", "$location"];

    function LocationDashboardController($scope, $timeout, APP_CONSTANT, apiService, locationConfig, helperService, $uibModal, $http, $filter, appConfig, authService, $location) {

        var LocationDashboardCtrl = this;

        function Init() {
            LocationDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Location_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": locationConfig.Entities,
            };

            LocationDashboardCtrl.ePage.Masters.GetRowFindAlldetails = GetRowFindAlldetails;
            LocationDashboardCtrl.ePage.Masters.setWidth = setWidth;
            LocationDashboardCtrl.ePage.Masters.setBoxWidth = setBoxWidth;
            LocationDashboardCtrl.ePage.Masters.setContentWidth = setContentWidth;
            LocationDashboardCtrl.ePage.Masters.getHeight = getHeight;
            LocationDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            LocationDashboardCtrl.ePage.Masters.ViewLocationPage = ViewLocationPage;
            LocationDashboardCtrl.ePage.Masters.Location = [];

            LocationDashboardCtrl.ePage.Masters.IsLoadMoreActive = false;
            LocationDashboardCtrl.ePage.Meta.NoRecord = false;

            GetWarehouseValues();
            
        }

        function ViewLocationPage(item) {
            var obj = {
                WarehouseCode: item.WarehouseCode
            };
            var _queryString = helperService.encryptData(obj);
            $location.path("MD/WMS/location").hash(_queryString);
        }

        function getHeight(event) {
            var x = event.clientX;
            var y = event.clientY;

            if (x > 1030 && y > 540) {
                LocationDashboardCtrl.ePage.Masters.placement = 'top-right';
            } else if (x > 1135 && y > 540) {
                LocationDashboardCtrl.ePage.Masters.placement = 'top-right';
            } else if (x > 1270 && y > 280) {
                LocationDashboardCtrl.ePage.Masters.placement = 'top-right';
            } else if (x > 1035 && y > 110) {
                LocationDashboardCtrl.ePage.Masters.placement = 'bottom-right';
            } else if (x < 213 && y < 297) {
                LocationDashboardCtrl.ePage.Masters.placement = 'bottom-left';
            } else if (x > 140 && y < 297) {
                LocationDashboardCtrl.ePage.Masters.placement = 'bottom';
            } else if (x > 140 && y > 297) {
                LocationDashboardCtrl.ePage.Masters.placement = 'top-left';
            } else if (x < 170 && y > 430) {
                LocationDashboardCtrl.ePage.Masters.placement = 'top-left';
            } else {
                LocationDashboardCtrl.ePage.Masters.placement = 'top';
            }
        }

        function setContentWidth(x) {
            if (x < 26) {
                return { "width": 1250 + 'px' }
            } else {
                return { "width": (x * 50) + 'px' };
            }
        }

        function setWidth(x) {
            if (x < 26) {
                return { "width": (1250 / x) + 'px' };
            } else {
                return { "width": 50 + 'px' }
            }
        }

        function setBoxWidth(x) {
            if (x < 26) {
                return { "width": (1250 / x) - 15 + 'px' };
            } else {
                return { "width": 35 + 'px' }
            }
        }

        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": LocationDashboardCtrl.ePage.Entities.Header.API.Warehouse.FilterID,
                "SearchInput": []
            };
            apiService.post("eAxisAPI", LocationDashboardCtrl.ePage.Entities.Header.API.Warehouse.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LocationDashboardCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    LocationDashboardCtrl.ePage.Masters.userselected = LocationDashboardCtrl.ePage.Masters.WarehouseDetails[0];
                    GetRowFindAlldetails(LocationDashboardCtrl.ePage.Masters.WarehouseDetails[0]);
                }
            });

        }

        function GetRowFindAlldetails(item) {
            LocationDashboardCtrl.ePage.Meta.IsLoading = true;
            var _filter = {
                "WarehouseCode": item.WarehouseCode,
                "SortColumn": "WRO_PickPathSequence",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": LocationDashboardCtrl.ePage.Entities.Header.API.RowFindAll.FilterID,
            };

            apiService.post("eAxisAPI", LocationDashboardCtrl.ePage.Entities.Header.API.RowFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    LocationDashboardCtrl.ePage.Masters.RowDetails = response.data.Response;
                    if (LocationDashboardCtrl.ePage.Masters.RowDetails.length == 0) {
                        LocationDashboardCtrl.ePage.Meta.IsLoading = false;
                        LocationDashboardCtrl.ePage.Meta.NoRecord = true;
                    }
                    LocationDashboardCtrl.ePage.Masters.LocationDetails = [];
                    LocationDashboardCtrl.ePage.Masters.CurrentValue = 0;
                    LocationDashboardCtrl.ePage.Masters.LoadRowDetails = [];
                    angular.forEach(LocationDashboardCtrl.ePage.Masters.RowDetails, function (value, key) {
                        if (LocationDashboardCtrl.ePage.Masters.CurrentValue < 10) {
                            LocationDashboardCtrl.ePage.Masters.LoadRowDetails.push(value);
                            value.LocationDetails = [];
                            var _filter = {
                                "WRO_FK": value.PK
                            };
                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": LocationDashboardCtrl.ePage.Entities.Header.API.WmsLocationWithAllocation.FilterID,
                            };
                            apiService.post("eAxisAPI", LocationDashboardCtrl.ePage.Entities.Header.API.WmsLocationWithAllocation.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    angular.forEach(response.data.Response, function (value1, key) {
                                        if (value1.AllocatedUnits == null)
                                            value1.AllocatedUnits = 0;
                                        LocationDashboardCtrl.ePage.Masters.LocationDetails.push(value1);
                                        value.LocationDetails.push(value1);
                                        LocationDashboardCtrl.ePage.Meta.IsLoading = false;
                                    });
                                }
                            });
                            LocationDashboardCtrl.ePage.Masters.CurrentValue++;
                        }
                    });
                }
            });

        }

        var LoopCountTotal = 1;
        function LoadMore() {
            if (LocationDashboardCtrl.ePage.Masters.IsLoadMoreActive !== true) {
                LoopCountTotal += 1;
                LocationDashboardCtrl.ePage.Masters.IsLoadMoreActive = true;
                var LoadEndValue = LocationDashboardCtrl.ePage.Masters.CurrentValue + 10;
                var LoopCount = 1;
                for (LocationDashboardCtrl.ePage.Masters.CurrentValue; LocationDashboardCtrl.ePage.Masters.CurrentValue <= LoadEndValue && LocationDashboardCtrl.ePage.Masters.CurrentValue < LocationDashboardCtrl.ePage.Masters.RowDetails.length; LocationDashboardCtrl.ePage.Masters.CurrentValue++) {
                    var value = LocationDashboardCtrl.ePage.Masters.RowDetails[LocationDashboardCtrl.ePage.Masters.CurrentValue];

                    value.LocationDetails = [];
                    var _filter = {
                        "WRO_FK": value.PK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": LocationDashboardCtrl.ePage.Entities.Header.API.WmsLocationWithAllocation.FilterID,
                    };

                    apiService.post("eAxisAPI", LocationDashboardCtrl.ePage.Entities.Header.API.WmsLocationWithAllocation.Url, _input).then(function (response) {
                        if (((LoopCount + (LoopCountTotal * 10)) - 10) == (LoopCountTotal * 10) || ((LoopCount + (LoopCountTotal * 10)) - 10) == LocationDashboardCtrl.ePage.Masters.RowDetails.length - 1)
                        { LocationDashboardCtrl.ePage.Masters.IsLoadMoreActive = false; }
                        LocationDashboardCtrl.ePage.Masters.LoadRowDetails.push(LocationDashboardCtrl.ePage.Masters.RowDetails[((LoopCount + (LoopCountTotal * 10)) - 10)]);
                        LoopCount++;
                        if (response.data.Response) {
                            angular.forEach(response.data.Response, function (value1, key) {
                                value1.AllocatedUnits = value1.AllocatedUnits == null ? 0 : value1.AllocatedUnits;
                                LocationDashboardCtrl.ePage.Masters.LocationDetails.push(value1);
                                value.LocationDetails.push(value1);
                            });
                        }
                    });
                };
                LocationDashboardCtrl.ePage.Masters.CurrentValue--;
            }
            else
                console.log("Already Active  " + LocationDashboardCtrl.ePage.Masters.CurrentValue);
        }

        Init();
    }

})();