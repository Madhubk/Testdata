(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseConfigController", WarehouseConfigController);

    WarehouseConfigController.$inject = ["apiService", "warehousesConfig", "helperService", "warehouseConfig"];

    function WarehouseConfigController(apiService, warehousesConfig, helperService, warehouseConfig) {
        var WarehouseConfigCtrl = this;

        function Init() {
            var currentWarehouse = WarehouseConfigCtrl.currentWarehouse[WarehouseConfigCtrl.currentWarehouse.label].ePage.Entities;

            WarehouseConfigCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Configuration",
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
            if (WarehouseConfigCtrl.ePage.Masters.IsEnableGatepass) {
                var obj = {
                    "IsJson": false,
                    "IsModified": false,
                    "Key": "IsEnableGatepass",
                    "SourceEntityRefKey": WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                    "EntitySource": "Warehouse",
                    "PK": "",
                    "TypeCode": "WarehouseSettings",
                    "Value": "",
                    "AppCode": "WMS",
                    "ModuleCode": "WMS"
                };
                var IsEnableGatepass = WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.some(function (value, key) {
                    if (value.Key == "IsEnableGatepass") {
                        value.Value = WarehouseConfigCtrl.ePage.Masters.IsEnableGatepass;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (!IsEnableGatepass) {
                    var data = angular.copy(obj);
                    data.Value = WarehouseConfigCtrl.ePage.Masters.IsEnableGatepass;
                    WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.push(data);
                }
            } else {
                WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.map(function (v, k) {
                    if (v.Key == "IsEnableGatepass") {
                        if (v.PK) {
                            apiService.get("eAxisAPI", warehouseConfig.Entities.WmsSettings.API.Delete.Url + v.PK).then(function (response) {
                                WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.splice(k, 1);
                            });
                        } else {
                            WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.splice(k, 1);
                        }
                    }
                });
            }
        }

        function OnChangeMandatory() {
            if (WarehouseConfigCtrl.ePage.Masters.IsGatepassMandatory) {
                var obj = {
                    "IsJson": false,
                    "IsModified": false,
                    "Key": "IsGatepassMandatory",
                    "SourceEntityRefKey": WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                    "EntitySource": "Warehouse",
                    "PK": "",
                    "TypeCode": "WarehouseSettings",
                    "Value": "",
                    "AppCode": "WMS",
                    "ModuleCode": "WMS"
                };
                var IsGatepassMandatory = WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.some(function (value, key) {
                    if (value.Key == "IsGatepassMandatory") {
                        value.Value = WarehouseConfigCtrl.ePage.Masters.IsGatepassMandatory;
                        return true;
                    } else {
                        return false;
                    }
                });

                if (!IsGatepassMandatory) {
                    var data = angular.copy(obj);
                    data.Value = WarehouseConfigCtrl.ePage.Masters.IsGatepassMandatory;
                    WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.push(data);
                }
            } else {
                WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.map(function (v, k) {
                    if (v.Key == "IsGatepassMandatory") {
                        if (v.PK) {
                            apiService.get("eAxisAPI", warehouseConfig.Entities.WmsSettings.API.Delete.Url + v.PK).then(function (response) {
                                WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.splice(k, 1);
                            });
                        } else {
                            WarehouseConfigCtrl.ePage.Entities.Header.Data.WmsSettings.splice(k, 1);
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
                        if (value.Key == "IsEnableGatepass")
                            WarehouseConfigCtrl.ePage.Masters.IsEnableGatepass = value.Value;

                        if (value.Key == "IsGatepassMandatory")
                            WarehouseConfigCtrl.ePage.Masters.IsGatepassMandatory = value.Value;
                    });
                }
            });
        }
        // #endregion

        Init();
    }
})();