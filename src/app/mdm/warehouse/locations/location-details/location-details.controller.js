(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LocationDetailsController", LocationDetailsController);

    LocationDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "locationConfig", "helperService", "$filter", "$uibModal", "toastr", "appConfig"];

    function LocationDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, locationConfig, helperService, $filter, $uibModal, toastr, appConfig) {
        / jshint validthis: true /
        var LocationDetailsCtrl = this;
        function Init() {


            var currentLocation = LocationDetailsCtrl.currentLocation[LocationDetailsCtrl.currentLocation.label].ePage.Entities;

            LocationDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Location_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentLocation
            };
            LocationDetailsCtrl.ePage.Masters.Config = locationConfig;
            // function call from html
            LocationDetailsCtrl.ePage.Masters.active = 0;
            LocationDetailsCtrl.ePage.Masters.select = select;
            LocationDetailsCtrl.ePage.Masters.SelectedAll = SelectedAll;
            LocationDetailsCtrl.ePage.Masters.update = update;
            LocationDetailsCtrl.ePage.Masters.SelectedLookupDataWarCode = SelectedLookupDataWarCode;
            LocationDetailsCtrl.ePage.Masters.SelectedLookupDataAreaCode = SelectedLookupDataAreaCode;
            LocationDetailsCtrl.ePage.Masters.GetLocations = GetLocations;
            LocationDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            LocationDetailsCtrl.ePage.Masters.StatusDesc = StatusDesc;
            LocationDetailsCtrl.ePage.Masters.checkSequence = checkSequence;


            // variable declaration
            LocationDetailsCtrl.ePage.Masters.Count = 0;
            LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Trays = 1;
            LocationDetailsCtrl.ePage.Masters.GenerateLocationDetails = false;
            LocationDetailsCtrl.ePage.Masters.GenerateButtonText = "Show";
            LocationDetailsCtrl.ePage.Masters.DropDownMasterList = {};
            LocationDetailsCtrl.ePage.Masters.SelectAll = false;
            LocationDetailsCtrl.ePage.Masters.LocationDetails = false;
            LocationDetailsCtrl.ePage.Masters.IsLoadingToSave = false;

            generalOperations();
            GetDropDownList();
            //GetLocations(LocationDetailsCtrl.currentLocation);
            LocationDetailsCtrl.ePage.Masters.emptyText = '-';

        };
        function StatusDesc(x) {
            angular.forEach(LocationDetailsCtrl.ePage.Masters.DropDownMasterList.LocStatus.ListSource, function (value, key) {
                if (value.Key == x) {
                    LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationStatusDescription = value.Value;
                }
            });
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(LocationDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                LocationDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, LocationDetailsCtrl.currentLocation.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                LocationDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, LocationDetailsCtrl.currentLocation.label);
            }
        }


        function generalOperations() {
            if (LocationDetailsCtrl.currentLocation.isNew == true) {
                LocationDetailsCtrl.ePage.Masters.IsDisabledWarehouse = true;
            } else {
                LocationDetailsCtrl.ePage.Masters.IsDisabledWarehouse = false;
            }
            // general operations
            if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName == null)
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName = "";
            if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode == null)
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode = "";
            LocationDetailsCtrl.ePage.Masters.WarehouseName = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode + "-" + LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName;
            if (LocationDetailsCtrl.ePage.Masters.WarehouseName == '-')
                LocationDetailsCtrl.ePage.Masters.WarehouseName = "";
        }
        // lookup for warehouse
        function SelectedLookupDataWarCode(item) {
            if (item.entity) {
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK = item.entity.PK;
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName = item.entity.WarehouseName;
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode = item.entity.WarehouseCode;
                LocationDetailsCtrl.ePage.Masters.WarehouseName = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode + "-" + LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName;
            }
            else {
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK = item.PK;
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseName = item.WarehouseName;
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode = item.WarehouseCode;
                LocationDetailsCtrl.ePage.Masters.WarehouseName = item.WarehouseCode + "-" + item.WarehouseName;
            }
            OnChangeValues(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WarehouseCode, 'E6001');
            if (LocationDetailsCtrl.currentLocation.isNew == true) {
                DefaultPickPathUpdate();
            }
        }

        function DefaultPickPathUpdate() {
            var _filter = {
                "WAR_FK": LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": locationConfig.Entities.Header.API.RowFindAll.FilterID,
            };
            apiService.post("eAxisAPI", LocationDetailsCtrl.ePage.Entities.Header.API.RowFindAll.Url, _input).then(function (response) {                
                LocationDetailsCtrl.ePage.Masters.max = 0;
                LocationDetailsCtrl.ePage.Masters.OtherWarehouseDetails = response.data.Response;
                angular.forEach(response.data.Response, function (value, key) {
                    if (value.PickPathSequence > LocationDetailsCtrl.ePage.Masters.max) {
                        LocationDetailsCtrl.ePage.Masters.max = value.PickPathSequence;
                    }
                });
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.PickPathSequence = LocationDetailsCtrl.ePage.Masters.max + 1;
            });
        }

        function checkSequence(item){
            if(item){
                var myData = LocationDetailsCtrl.ePage.Masters.OtherWarehouseDetails.some(function(value,key){
                    if(parseInt(value.PickPathSequence)==parseInt(item) && value.WAR_FK==LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.WAR_FK)
                    return true;
                })
                if(myData){
                        toastr.error("RowPath Sequence is Already Used in Another Row");
                        LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.PickPathSequence = "";
                    }
            }
        }
        // lookup for area
        function SelectedLookupDataAreaCode(item) {
            if (item.entity) {
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_Name = item.entity.Name;
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_FK = item.entity.PK;
            }
            else {
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_Name = item.Name;
                LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_FK = item.PK;
            }
        }
        // select common checkbox
        function SelectedAll(details) {
            if (LocationDetailsCtrl.ePage.Masters.SelectAll == true) {
                LocationDetailsCtrl.ePage.Masters.enable = true;
                angular.forEach(details, function (value, key) {
                    value.singleselect = true;
                });
            }
            else {
                LocationDetailsCtrl.ePage.Masters.enable = false;
                angular.forEach(details, function (value, key) {
                    value.singleselect = false;
                });
            }
        }
        // select single checkbox
        function select(details, index) {
            if (details[index].singleselect == false) {
                LocationDetailsCtrl.ePage.Masters.SelectAll = false;
                LocationDetailsCtrl.ePage.Masters.Count--;
            }
            else {
                LocationDetailsCtrl.ePage.Masters.Count++;
                var count = 0;
                for (var i in details) {
                    if (details[i].singleselect == true) {
                        count++;
                        if (details.length <= count) {
                            LocationDetailsCtrl.ePage.Masters.SelectAll = true;
                        }
                        else {
                            LocationDetailsCtrl.ePage.Masters.SelectAll = false;
                        }
                    }
                }
            }
            if (LocationDetailsCtrl.ePage.Masters.Count == 0) {
                LocationDetailsCtrl.ePage.Masters.enable = false;
            }
            else {
                LocationDetailsCtrl.ePage.Masters.enable = true;
            }
        }
        // update location details
        function update(details) {

            if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeight) {
                if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeightUnit) {
                    OnChangeValues(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeightUnit, 'E6012');
                }
                else {
                    OnChangeValues(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeightUnit, 'E6012');
                }
            }
            if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubic) {
                if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubicUnit) {
                    OnChangeValues(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubicUnit, 'E6013');
                }
                else {
                    OnChangeValues(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubicUnit, 'E6013');
                }
            }
            if (LocationDetailsCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.length == 0) {

                for (var i in details) {
                    if (details[i].singleselect == true) {
                        details[i].IsModified = true;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeight)
                            details[i].MaxWeight = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeight;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeightUnit)
                            details[i].MaxWeightUnit = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxWeightUnit;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubic)
                            details[i].MaxCubic = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubic;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubicUnit)
                            details[i].MaxCubicUnit = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxCubicUnit;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_FK)
                            details[i].WAA_FK = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_FK;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_Name)
                            details[i].WAA_Name = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.WAA_Name;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationType)
                            details[i].LocationType = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationType;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationStatus) {
                            StatusDesc(LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationStatus);
                            details[i].LocationStatus = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationStatus;
                            details[i].LocationStatusDescription = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.LocationStatusDescription;
                        }

                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.PickMethod)
                            details[i].PickMethod = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.PickMethod;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxQuantity)
                            details[i].MaxQuantity = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.MaxQuantity;
                        if (LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.FinalisedPickCount)
                            details[i].FinalisedPickCount = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation.FinalisedPickCount;
                    }
                }
                details = filterObjectUpdate(details, "IsModified");
                apiService.post("eAxisAPI", LocationDetailsCtrl.ePage.Entities.Header.API.updateOnlyLocation.Url, details).then(function (response) {
                    if (response.data.Response) {
                        LocationDetailsCtrl.ePage.Entities.Header.Data.WmsLocation = response.data.Response;
                        LocationDetailsCtrl.ePage.Masters.SelectAll = false;
                    }
                });
            }
        }
        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        // get location details
        function GetLocations($item) {
            var _Data = $item[$item.label].ePage.Entities,
                input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            LocationDetailsCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (LocationDetailsCtrl.ePage.Entities.Header.Validations) {
                LocationDetailsCtrl.ePage.Masters.Config.RemoveApiErrors(LocationDetailsCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                LocationDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(LocationDetailsCtrl.currentLocation);
            }
        }

        function Save($item) {
            LocationDetailsCtrl.ePage.Masters.IsLoadingToSave = true;
            LocationDetailsCtrl.ePage.Masters.SelectAll = false;

            var _Data = $item[$item.label].ePage.Entities,
                input = _Data.Header.Data;
            if ($item.isNew) {
                input.WmsRow.PK = input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Location').then(function (response) {
                if (response.Status === "success") {

                    locationConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                                value[LocationDetailsCtrl.ePage.Entities.Header.Data.WmsRow.Name] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = locationConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(LocationDetailsCtrl.currentLocation[LocationDetailsCtrl.currentLocation.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        locationConfig.TabList[_index].isNew = false;
                        LocationDetailsCtrl.ePage.Masters.LocationDetails = true;
                        if ($state.current.url == "/location") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    LocationDetailsCtrl.ePage.Masters.IsLoadingToSave = false;
                    LocationDetailsCtrl.ePage.Masters.active = 1;

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    LocationDetailsCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        LocationDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, LocationDetailsCtrl.currentLocation.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (LocationDetailsCtrl.ePage.Entities.Header.Validations != null) {
                        LocationDetailsCtrl.ePage.Masters.Config.ShowErrorWarningModal(LocationDetailsCtrl.currentLocation);
                    }
                }
            });
        }
        // typeCodeList details
        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "CubicUnit", "PickMethod", "LocStatus"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        LocationDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        LocationDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        Init();
    }
})();