(function() {
    "use strict";
    angular
        .module("Application")
        .controller("LocationDashboardControllerV2", LocationDashboardControllerV2);

    LocationDashboardControllerV2.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "locationConfig", "helperService", "$uibModal", "$http", "$filter", "appConfig", "authService", "$location"];

    function LocationDashboardControllerV2($scope, $timeout, APP_CONSTANT, apiService, locationConfig, helperService, $uibModal, $http, $filter, appConfig, authService, $location) {

        var LocationDashboardCtrlV2 = this;

        function Init() {
            LocationDashboardCtrlV2.ePage = {
                "Title": "",
                "Prefix": "Location_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": locationConfig.Entities,
            };

            LocationDashboardCtrlV2.ePage.Masters.GetRowFindAlldetails = GetRowFindAlldetails;
            LocationDashboardCtrlV2.ePage.Masters.setWidth = setWidth;            
            LocationDashboardCtrlV2.ePage.Masters.getHeight = getHeight;
            LocationDashboardCtrlV2.ePage.Masters.LoadMore = LoadMore;
            LocationDashboardCtrlV2.ePage.Masters.ViewLocationPage = ViewLocationPage;
            LocationDashboardCtrlV2.ePage.Masters.Location = [];

            LocationDashboardCtrlV2.ePage.Masters.IsLoadMoreActive = false;


            GetWarehouseValues();

        }

        function ViewLocationPage(item) {
            var obj = {
                WarehouseCode: item.WarehouseCode
            };
            var _queryString = helperService.encryptData(obj);
            $location.path("EA/location").hash(_queryString);
        }

        function getHeight(event) {
            var x = event.clientX;
            var y = event.clientY;
            
            if (x > 1030 && y > 540) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'top-right';
            } else if (x > 1135 && y > 540) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'top-right';
            } else if (x > 1270 && y > 280) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'top-right';
            } else if (x > 1035 && y > 110) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'bottom-right';
            } else if (x < 213 && y < 297) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'bottom-left';
            } else if (x > 140 && y < 297) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'bottom';
            } else if (x > 140 && y > 297) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'top-left';
            } else if (x < 170 && y > 430) {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'top-left';
            } else {
                LocationDashboardCtrlV2.ePage.Masters.placement = 'top';
            }
        }

        
        function setWidth(x) {
            return { "width": (x * 50) + 'px' };
        }


        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": LocationDashboardCtrlV2.ePage.Entities.Header.API.Warehouse.FilterID,
                "SearchInput": []
            };
            apiService.post("eAxisAPI", LocationDashboardCtrlV2.ePage.Entities.Header.API.Warehouse.Url, _input).then(function(response) {
                if (response.data.Response) {
                    LocationDashboardCtrlV2.ePage.Masters.WarehouseDetails = response.data.Response;
                    LocationDashboardCtrlV2.ePage.Masters.userselected = LocationDashboardCtrlV2.ePage.Masters.WarehouseDetails[0];
                    GetRowFindAlldetails(LocationDashboardCtrlV2.ePage.Masters.WarehouseDetails[0]);
                }
            });

        }

        function GetRowFindAlldetails(item) {
            var _filter = {
                "WarehouseCode": item.WarehouseCode,
                "SortColumn": "WRO_PickPathSequence",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": LocationDashboardCtrlV2.ePage.Entities.Header.API.RowFindAll.FilterID,
            };

            apiService.post("eAxisAPI", LocationDashboardCtrlV2.ePage.Entities.Header.API.RowFindAll.Url, _input).then(function(response) {
                if (response.data.Response) {
                    LocationDashboardCtrlV2.ePage.Masters.RowDetails = response.data.Response;
                    LocationDashboardCtrlV2.ePage.Masters.LocationDetails = [];
                    LocationDashboardCtrlV2.ePage.Masters.CurrentValue = 0;
                    LocationDashboardCtrlV2.ePage.Masters.LoadRowDetails = [];
                    angular.forEach(LocationDashboardCtrlV2.ePage.Masters.RowDetails, function(value, key) {
                        if (LocationDashboardCtrlV2.ePage.Masters.CurrentValue < 10) {
                            LocationDashboardCtrlV2.ePage.Masters.LoadRowDetails.push(value);
                            value.LocationDetails = [];
                            var _filter = {
                                "WRO_FK": value.PK
                            };
                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": LocationDashboardCtrlV2.ePage.Entities.Header.API.WmsLocationWithAllocation.FilterID,
                            };
                            apiService.post("eAxisAPI", LocationDashboardCtrlV2.ePage.Entities.Header.API.WmsLocationWithAllocation.Url, _input).then(function(response) {
                                if (response.data.Response) {                                   
                                    angular.forEach(response.data.Response, function (value1, key) {
                                        if (value1.AllocatedUnits == null)
                                            value1.AllocatedUnits = 0;
                                        LocationDashboardCtrlV2.ePage.Masters.LocationDetails.push(value1);
                                        value.LocationDetails.push(value1);
                                    });
                                }
                            });
                            LocationDashboardCtrlV2.ePage.Masters.CurrentValue++;
                        }
                    });
                }
            });

        }





        var LoopCountTotal = 1;
        function LoadMore() {
            if (LocationDashboardCtrlV2.ePage.Masters.IsLoadMoreActive !== true) {
                LoopCountTotal += 1;
                LocationDashboardCtrlV2.ePage.Masters.IsLoadMoreActive = true;
                var LoadEndValue = LocationDashboardCtrlV2.ePage.Masters.CurrentValue + 10;
                var LoopCount = 1;
                for (LocationDashboardCtrlV2.ePage.Masters.CurrentValue; LocationDashboardCtrlV2.ePage.Masters.CurrentValue <= LoadEndValue && LocationDashboardCtrlV2.ePage.Masters.CurrentValue < LocationDashboardCtrlV2.ePage.Masters.RowDetails.length; LocationDashboardCtrlV2.ePage.Masters.CurrentValue++) {
                    var value = LocationDashboardCtrlV2.ePage.Masters.RowDetails[LocationDashboardCtrlV2.ePage.Masters.CurrentValue];

                    value.LocationDetails = [];
                    var _filter = {
                        "WRO_FK": value.PK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": LocationDashboardCtrlV2.ePage.Entities.Header.API.WmsLocationWithAllocation.FilterID,
                    };

                    apiService.post("eAxisAPI", LocationDashboardCtrlV2.ePage.Entities.Header.API.WmsLocationWithAllocation.Url, _input).then(function(response) {
                        if (((LoopCount + (LoopCountTotal * 10)) - 10) == (LoopCountTotal * 10) || ((LoopCount + (LoopCountTotal * 10)) - 10) == LocationDashboardCtrlV2.ePage.Masters.RowDetails.length - 1)
                        { LocationDashboardCtrlV2.ePage.Masters.IsLoadMoreActive = false; }
                        LocationDashboardCtrlV2.ePage.Masters.LoadRowDetails.push(LocationDashboardCtrlV2.ePage.Masters.RowDetails[((LoopCount + (LoopCountTotal * 10)) - 10)]);
                        LoopCount++;
                        if (response.data.Response) {
                            angular.forEach(response.data.Response, function (value, key) {
                                value.AllocatedUnits = value.AllocatedUnits == null ? 0 : value.AllocatedUnits;
                                LocationDashboardCtrlV2.ePage.Masters.LocationDetails.push(value);
                                value.LocationDetails.push(value1);
                            });
                        }
                    });
                };
                LocationDashboardCtrlV2.ePage.Masters.CurrentValue--;
            }
            else
                console.log("Already Active  " + LocationDashboardCtrlV2.ePage.Masters.CurrentValue);
        }

        Init();
    }

})();