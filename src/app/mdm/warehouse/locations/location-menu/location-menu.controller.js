(function () {
    "use strict";
    angular
        .module("Application")
        .controller("LocationMenuController", LocationMenuController);

    LocationMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "locationConfig", "helperService", "toastr", "appConfig", "$state"];

    function LocationMenuController($scope, $timeout, APP_CONSTANT, apiService, locationConfig, helperService, toastr, appConfig, $state) {
        var LocationMenuCtrl = this;

        function Init() {

            var currentLocation = LocationMenuCtrl.currentLocation[LocationMenuCtrl.currentLocation.label].ePage.Entities;

            LocationMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "WarehouseMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentLocation
            };
           

            // function
            LocationMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            LocationMenuCtrl.ePage.Masters.SaveandcloseButtonText = "Save & Close";
            LocationMenuCtrl.ePage.Masters.IsDisableSave = false;
            LocationMenuCtrl.ePage.Masters.Validation = Validation;

            LocationMenuCtrl.ePage.Masters.LocationMenu = {};
            LocationMenuCtrl.ePage.Masters.LocationMenu.ListSource = LocationMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            LocationMenuCtrl.ePage.Masters.Config = locationConfig;

        }

        

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            LocationMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (LocationMenuCtrl.ePage.Entities.Header.Validations) {
                LocationMenuCtrl.ePage.Masters.Config.RemoveApiErrors(LocationMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                LocationMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(LocationMenuCtrl.currentLocation);
            }
        }
        function Save($item) {
            if(LocationMenuCtrl.ePage.Masters.SaveAndClose){
                LocationMenuCtrl.ePage.Masters.SaveandcloseButtonText = "Please Wait...";    
            }
            if(!LocationMenuCtrl.ePage.Masters.SaveAndClose){
                LocationMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";    
            }
            
            
            LocationMenuCtrl.ePage.Masters.IsDisableSave = true;
            LocationMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            if ($item.isNew) {
                _input.WmsRow.PK = _input.PK;
                _input.WmsRow.CreatedDateTime = new Date();

                //Converting into Upper Case
                _input.WmsRow.Name = _input.WmsRow.Name.toUpperCase();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Location').then(function (response) {
                LocationMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                
                if (response.Status === "success") {

                    locationConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = LocationMenuCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                                value[LocationMenuCtrl.ePage.Entities.Header.Data.WmsRow.Name] = value.New;
                                delete value.New;
                                value.code = LocationMenuCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                            }
                        }
                    });

                    var _index = locationConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(LocationMenuCtrl.currentLocation[LocationMenuCtrl.currentLocation.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        //Changing Label name when row name changes
                        if(LocationMenuCtrl.ePage.Entities.Header.Data.WmsRow.Name != locationConfig.TabList[_index].label){
                            locationConfig.TabList[_index].label = LocationMenuCtrl.ePage.Entities.Header.Data.WmsRow.Name;
                            locationConfig.TabList[_index][locationConfig.TabList[_index].label] = locationConfig.TabList[_index][locationConfig.TabList[_index].code];
                            delete locationConfig.TabList[_index][locationConfig.TabList[_index].code];
                            locationConfig.TabList[_index].code = LocationMenuCtrl.ePage.Entities.Header.Data.WmsRow.Name
                        }

                        locationConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/location") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    toastr.success("Saved Successfully...!");
                    if(LocationMenuCtrl.ePage.Masters.SaveAndClose){
                        LocationMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        LocationMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    LocationMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        LocationMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, LocationMenuCtrl.currentLocation.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (LocationMenuCtrl.ePage.Entities.Header.Validations != null) {
                        LocationMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(LocationMenuCtrl.currentLocation);
                    }
                }
                LocationMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                LocationMenuCtrl.ePage.Masters.SaveandcloseButtonText = "Save & Close"
                LocationMenuCtrl.ePage.Masters.IsDisableSave = false;
            });
            
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

        Init();
    }
})();
