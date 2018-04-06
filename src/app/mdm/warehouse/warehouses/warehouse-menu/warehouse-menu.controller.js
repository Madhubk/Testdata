(function () {
    "use strict";
    angular
        .module("Application")
        .controller("WarehouseMenuController", WarehouseMenuController);

    WarehouseMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "warehousesConfig", "helperService", "appConfig", "$state"];

    function WarehouseMenuController($scope, $timeout, APP_CONSTANT, apiService, warehousesConfig, helperService, appConfig, $state) {
        var WarehouseMenuCtrl = this;

        function Init() {
            var currentWarehouse = WarehouseMenuCtrl.currentWarehouse[WarehouseMenuCtrl.currentWarehouse.label].ePage.Entities;
            WarehouseMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "WarehouseMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            // Standard Menu Configuration and Data
            WarehouseMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.Warehouse;
            WarehouseMenuCtrl.ePage.Masters.StandardMenuInput.obj = WarehouseMenuCtrl.currentWarehouse;

            // function
            WarehouseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            WarehouseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;


            WarehouseMenuCtrl.ePage.Masters.WarehouseMenu = {};
            // Menu list from configuration
            WarehouseMenuCtrl.ePage.Masters.WarehouseMenu.ListSource = WarehouseMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            WarehouseMenuCtrl.ePage.Masters.Validation = Validation;
            WarehouseMenuCtrl.ePage.Masters.Config = warehousesConfig;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            WarehouseMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (WarehouseMenuCtrl.ePage.Entities.Header.Validations) {
                WarehouseMenuCtrl.ePage.Masters.Config.RemoveApiErrors(WarehouseMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
            }
        }

        function Save($item) {
            WarehouseMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            WarehouseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            _input.WmsWarehouse.IsActive = true;

            if ($item.isNew) {
                _input.PK = _input.WmsWarehouse.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            helperService.SaveEntity($item, 'Warehouse').then(function (response) {
                WarehouseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                WarehouseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (response.Status === "success") {

                    warehousesConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                                value[WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = warehousesConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(WarehouseMenuCtrl.currentWarehouse[WarehouseMenuCtrl.currentWarehouse.label].ePage.Entities.Header.Data.PK);


                    if (_index !== -1) {
                        if (response.Data.Response) {
                            warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        warehousesConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/warehouses") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if(WarehouseMenuCtrl.ePage.Masters.SaveAndClose){
                        WarehouseMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        WarehouseMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    WarehouseMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (WarehouseMenuCtrl.ePage.Entities.Header.Validations != null) {
                        WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                    }
                }
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
