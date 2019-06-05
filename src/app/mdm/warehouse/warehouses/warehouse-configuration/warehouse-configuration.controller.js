(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseConfigController", WarehouseConfigController);

    WarehouseConfigController.$inject = ["$timeout", "authService", "apiService", "warehousesConfig", "helperService", "$filter", "toastr", "appConfig", "confirmation", "warehouseConfig"];

    function WarehouseConfigController($timeout, authService, apiService, warehousesConfig, helperService, $filter, toastr, appConfig, confirmation, warehouseConfig) {
        var WarehouseConfigCtrl = this;

        function Init() {
            var currentWarehouse = WarehouseConfigCtrl.currentWarehouse[WarehouseConfigCtrl.currentWarehouse.label].ePage.Entities;

            WarehouseConfigCtrl.ePage = {
                "Title": "",
                "Prefix": "Area_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            WarehouseConfigCtrl.ePage.Masters.Config = warehousesConfig;

            WarehouseConfigCtrl.ePage.Masters.OnChangeClientConfig = OnChangeClientConfig;
            WarehouseConfigCtrl.ePage.Masters.OnChangeMandatory = OnChangeMandatory;

            GetWmsSettings();
        }

        // #region - Onchange values
        function OnChangeClientConfig() {
            if (WarehouseConfigCtrl.ePage.Masters.IsClientConfig) {
                var obj = {
                    "IsJson": false,
                    "IsModified": false,
                    "Key": "IsClientConfig",
                    "SourceEntityRefKey": WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                    "EntitySource": "Warehouse",
                    "PK": "",
                    "TypeCode": "WarehouseSettings",
                    "Value": "",
                    "AppCode": "WMS",
                    "ModuleCode": "WMS"
                };
                var IsClientConfig = WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.some(function (value, key) {
                    if (value.Key == "IsClientConfig") {
                        value.Value = WarehouseConfigCtrl.ePage.Masters.IsClientConfig;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (!IsClientConfig) {
                    var data = angular.copy(obj);
                    data.Value = WarehouseConfigCtrl.ePage.Masters.IsClientConfig;
                    WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.push(data);
                }
            } else {
                WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.map(function (v, k) {
                    if (v.Key == "IsClientConfig") {
                        if (v.PK) {
                            apiService.get("eAxisAPI", warehouseConfig.Entities.WmsSettings.API.Delete.Url + v.PK).then(function (response) {
                            });
                        }
                    }
                });
            }
        }

        function OnChangeMandatory() {
            if (WarehouseConfigCtrl.ePage.Masters.IsMandatory) {
                var obj = {
                    "IsJson": false,
                    "IsModified": false,
                    "Key": "IsMandatory",
                    "SourceEntityRefKey": WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                    "EntitySource": "Warehouse",
                    "PK": "",
                    "TypeCode": "WarehouseSettings",
                    "Value": "",
                    "AppCode": "WMS",
                    "ModuleCode": "WMS"
                };
                var IsMandatory = WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.some(function (value, key) {
                    if (value.Key == "IsMandatory") {
                        value.Value = WarehouseConfigCtrl.ePage.Masters.IsMandatory;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (!IsMandatory) {
                    var data = angular.copy(obj);
                    data.Value = WarehouseConfigCtrl.ePage.Masters.IsMandatory;
                    WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.push(data);
                }
            } else {
                WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.map(function (v, k) {
                    if (v.Key == "IsMandatory") {
                        if (v.PK) {
                            apiService.get("eAxisAPI", warehouseConfig.Entities.WmsSettings.API.Delete.Url + v.PK).then(function (response) {
                            });
                        }
                    }
                });
            }
        }
        // #endregion
        // #region - Get WmsSettings list
        function GetWmsSettings() {
            var _filter = {
                SourceEntityRefKey: WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsSettings.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsSettings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings = response.data.Response;
                    angular.forEach(WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings, function (value, key) {
                        if (typeof value.Value == "string")
                            value.Value = JSON.parse(value.Value);
                        if (value.Key == "IsClientConfig")
                            WarehouseConfigCtrl.ePage.Masters.IsClientConfig = value.Value;

                        if (value.Key == "IsMandatory")
                            WarehouseConfigCtrl.ePage.Masters.IsMandatory = value.Value;
                    });
                }
            });
        }
        // #endregion

        Init();
    }
})();