(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LocationDashboardModalController", LocationDashboardModalController);

    LocationDashboardModalController.$inject = ["$rootScope", "$scope", "$uibModalInstance", "APP_CONSTANT", "helperService", "param", "apiService", "appConfig", "$timeout", "dynamicLookupConfig"];

    function LocationDashboardModalController($rootScope, $scope, $uibModalInstance, APP_CONSTANT, helperService, param, apiService, appConfig, $timeout, dynamicLookupConfig) {
        /* jshint validthis: true */
        var LocationDashboardModalCtrl = this;

        function Init() {
            LocationDashboardModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Location_Dashboard_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            LocationDashboardModalCtrl.ePage.Masters.selectedItem = {};
            LocationDashboardModalCtrl.ePage.Meta.NoRecord = false;
            LocationDashboardModalCtrl.ePage.Masters.defaultFilter = dynamicLookupConfig.Entities[LocationDashboardModalCtrl.prefixData].LookupConfig[param.fieldName].defaults;

            GetRowFindAlldetails(LocationDashboardModalCtrl.filter);

            LocationDashboardModalCtrl.ePage.Masters.setWidth = setWidth;
            LocationDashboardModalCtrl.ePage.Masters.setBoxWidth = setBoxWidth;
            LocationDashboardModalCtrl.ePage.Masters.setContentWidth = setContentWidth;
            LocationDashboardModalCtrl.ePage.Masters.Clear = Clear;
            LocationDashboardModalCtrl.ePage.Masters.Filter = Filter;
            LocationDashboardModalCtrl.ePage.Masters.GetFilterList = GetFilterList;
            LocationDashboardModalCtrl.ePage.Masters.CloseFilterList = CloseFilterList;

            LocationDashboardModalCtrl.ePage.Masters.Cancel = Cancel;
            LocationDashboardModalCtrl.ePage.Masters.SelectedLocation = SelectedLocation;

            getConfigDetails();
        }
        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseLocation").removeClass('open');
        }
        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseLocation").toggleClass('open');
            });
        }
        function getConfigDetails() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "WarehouseLocation"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    LocationDashboardModalCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    LocationDashboardModalCtrl.ePage.Masters.DynamicControl.Entities.map(function (value1, key1) {
                        if (LocationDashboardModalCtrl.ePage.Masters.defaultFilter !== undefined) {
                            value1.Data = LocationDashboardModalCtrl.ePage.Masters.defaultFilter;
                        }
                        value1.CSS = {};
                        value1.ConfigData.map(function (value2, key2) {
                            value1.CSS["Is" + value2.PropertyName + "Visible"] = true;
                            value1.CSS["Is" + value2.PropertyName + "Disable"] = false;

                            if (dynamicLookupConfig.Entities[LocationDashboardModalCtrl.ePage.Masters.DynamicControl.DataEntryName].LookupConfig[LocationDashboardModalCtrl.fieldName].CSS) {
                                var _isEmpty = angular.equals({}, dynamicLookupConfig.Entities[LocationDashboardModalCtrl.ePage.Masters.DynamicControl.DataEntryName].LookupConfig[LocationDashboardModalCtrl.fieldName].CSS);

                                if (!_isEmpty) {
                                    value1.CSS["Is" + value2.PropertyName + "Visible"] = dynamicLookupConfig.Entities[LocationDashboardModalCtrl.ePage.Masters.DynamicControl.DataEntryName].LookupConfig[LocationDashboardModalCtrl.fieldName].CSS["Is" + value2.PropertyName + "Visible"];
                                    value1.CSS["Is" + value2.PropertyName + "Disable"] = dynamicLookupConfig.Entities[LocationDashboardModalCtrl.ePage.Masters.DynamicControl.DataEntryName].LookupConfig[LocationDashboardModalCtrl.fieldName].CSS["Is" + value2.PropertyName + "Disable"];
                                }
                            }
                        });
                    });

                    LocationDashboardModalCtrl.ePage.Masters.IsLoading = false;
                    LocationDashboardModalCtrl.ePage.Masters.ViewType = 1;
                }
            });
        }

        function Filter() {
            $(".filter-sidebar-wrapper").toggleClass("open");

            LocationDashboardModalCtrl.ePage.Masters.DynamicControl.Entities[0].ConfigData.map(function (value, key) {
                if (!value.Include) {
                    delete (LocationDashboardModalCtrl.ePage.Masters.DynamicControl.Entities[0].Data[value.PropertyName])
                }
            });
            $timeout(function () {
                DynamicControlFilter();
            }, 500);
        }

        function DynamicControlFilter(objData) {
            LocationDashboardModalCtrl.ePage.Masters.IsResetGrid = false;
            LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster = undefined;
            $timeout(function () {
                LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster = LocationDashboardModalCtrl.ePage.Masters.DynamicControl;

                if (objData != undefined) {
                    if (objData.API != '' && objData.FilterID != '') {
                        LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.FilterAPI = objData.API;
                        LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.FilterID = objData.FilterID;
                        LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.RequestMethod = objData.ExcuteRequestMethod;
                    }
                    LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Filter = objData.ExcuteInput;
                } else {
                    var tempArray = [];
                    tempArray.push(helperService.createToArrayOfObject({
                        'FilterType': "WarehouseLocation"
                    })[0]);

                    LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Entities.map(function (value, key) {
                        var x = helperService.createToArrayOfObject(value.Data);
                        x.map(function (v, k) {
                            tempArray.push(v);
                        });
                        LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Filter = tempArray;
                    });
                }

                if (!LocationDashboardModalCtrl.ePage.Masters.TempFilter) {
                    LocationDashboardModalCtrl.ePage.Masters.TempFilter = angular.copy(LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Filter);
                }

                if (LocationDashboardModalCtrl.ePage.Masters.IsResetClicked) {
                    LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Filter = LocationDashboardModalCtrl.ePage.Masters.TempFilter;
                    LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Entities.map(function (value, key) {
                        value.Data = {};
                    });
                }

                LocationDashboardModalCtrl.ePage.Masters.IsResetClicked = false;
                GetRowFindAlldetails(LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Filter);
                // LocationDashboardModalCtrl.ePage.Masters.gridConfig = APP_CONSTANT.DynamicGridConfig[LocationDashboardModalCtrl.gridConfigType].GridConfig;
            });
        }

        function Clear() {
            var clear = LocationDashboardModalCtrl.ePage.Masters.DataEntryMaster.Entities;
            clear.map(function (value, key) {
                value.Data = '';
            });
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

        function setContentWidth(x) {
            if (x < 26) {
                return { "width": 1250 + 'px' }
            } else {
                return { "width": (x * 50) + 'px' };
            }
        }

        function GetRowFindAlldetails(item) {
            LocationDashboardModalCtrl.ePage.Meta.IsLoading = true;
            var TempItem = item;
            var OrgItem = item;
            var searchInput = [];
            if (item[0].FieldName) {
                if (OrgItem.length == 1) {
                    var obj = {
                        FieldName: "WarehouseCode",
                        value: LocationDashboardModalCtrl.ePage.Masters.RowDetails[0].WarehouseCode
                    }
                    searchInput.push(obj);
                } else {
                    searchInput = OrgItem;
                    var count = 0;
                    angular.forEach(OrgItem, function (value, key) {
                        if (value.FieldName == "Location") {
                            var val = value.value.split('-');
                            var obj = {
                                FieldName: "Name",
                                value: val[0]
                            }
                            searchInput.push(obj);
                        }
                        if (value.FieldName == "WAR_WarehouseCode") {
                            return count = 1;
                        }
                    });
                    console.log(count)
                    if (count == 0) {
                        var obj = {
                            FieldName: "WarehouseCode",
                            value: LocationDashboardModalCtrl.ePage.Masters.RowDetails[0].WarehouseCode
                        }
                        searchInput.push(obj);
                    }
                }
            } else {
                var _filter = {
                    "WarehouseCode": item,
                    "SortColumn": "WRO_PickPathSequence",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 100
                };
                searchInput = helperService.createToArrayOfObject(_filter);
            }
            var _input = {
                "searchInput": searchInput,
                "FilterID": "WMSROW",
            };

            apiService.post("eAxisAPI", "WmsRow/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    LocationDashboardModalCtrl.ePage.Masters.RowDetails = response.data.Response;
                    if (LocationDashboardModalCtrl.ePage.Masters.RowDetails.length == 0) {
                        LocationDashboardModalCtrl.ePage.Meta.IsLoading = false;
                        LocationDashboardModalCtrl.ePage.Meta.NoRecord = true;
                    }
                    LocationDashboardModalCtrl.ePage.Masters.LocationDetails = [];

                    angular.forEach(LocationDashboardModalCtrl.ePage.Masters.RowDetails, function (value, key) {
                        LocationDashboardModalCtrl.ePage.Masters.LocationDetails.push(value);
                        value.LocationDetails = [];
                        var searchInput1 = [];

                        if (item[0].FieldName) {
                            var count;
                            angular.forEach(TempItem, function (value1, key1) {
                                if (value1.FieldName == "Location" || value1.FieldName == "LocationType") {
                                    searchInput1.push(value1);
                                } else {
                                    count = 0;
                                }
                            });
                            if (count == 0) {
                                var obj = {
                                    FieldName: "WRO_FK",
                                    value: value.PK
                                }
                                searchInput1.push(obj);
                            }
                        } else {
                            var _filter1 = {
                                "WRO_FK": value.PK
                            };
                            searchInput1 = helperService.createToArrayOfObject(_filter1);
                        }
                        var _input1 = {
                            "searchInput": searchInput1,
                            "FilterID": "WMSLOWAL",
                        };
                        apiService.post("eAxisAPI", "WmsLocationWithAllocation/FindAll", _input1).then(function (response) {
                            if (response.data.Response) {
                                angular.forEach(response.data.Response, function (value1, key) {
                                    if (value1.AllocatedUnits == null)
                                        value1.AllocatedUnits = 0;
                                    value.LocationDetails.push(value1);
                                    LocationDashboardModalCtrl.ePage.Meta.IsLoading = false;
                                });
                            }
                        });
                    });
                }
            });

        }

        function Ok() {
            $uibModalInstance.close(LocationDashboardModalCtrl.ePage.Masters.selectedItem);
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function SelectedLocation(item) {
            LocationDashboardModalCtrl.ePage.Masters.selectedItem = item;
            Ok();
        }


        Init();
    }
})();