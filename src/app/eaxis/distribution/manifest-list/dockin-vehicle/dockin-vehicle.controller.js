(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockinVehicleController", DockinVehicleController);

    DockinVehicleController.$inject = ["apiService", "distributionConfig", "dmsManifestConfig", "helperService", "$filter"];

    function DockinVehicleController(apiService, distributionConfig, dmsManifestConfig, helperService, $filter) {

        var DockinVehicleCtrl = this;

        function Init() {

            var currentManifest = DockinVehicleCtrl.currentManifest[DockinVehicleCtrl.currentManifest.label].ePage.Entities;

            DockinVehicleCtrl.ePage = {
                "Title": "",
                "Prefix": "Dockin_Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            DockinVehicleCtrl.ePage.Entities.Header.Data.GatepassList = $filter('filter')(DockinVehicleCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DockinVehicleCtrl.jobfk })

            if (DockinVehicleCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DockinVehicleCtrl.ePage.Masters.MenuList = DockinVehicleCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                DockinVehicleCtrl.ePage.Masters.MenuList = DockinVehicleCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            DockinVehicleCtrl.ePage.Masters.Empty = "-";
            DockinVehicleCtrl.ePage.Masters.Config = dmsManifestConfig;

            getDockNoList();
        }

        function getDockNoList() {
            var _purpose;
            if (DockinVehicleCtrl.ePage.Entities.Header.Data.GatepassList[0].Purpose == "INW")
                _purpose = "ULD";
            else if (DockinVehicleCtrl.ePage.Entities.Header.Data.GatepassList[0].Purpose == "ORD")
                _purpose = "LOD";

            var _filter = {
                "WAR_FK": DockinVehicleCtrl.ePage.Entities.Header.Data.GatepassList[0].WAR_PK,
                "Purpose": _purpose
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": distributionConfig.Entities.WmsDockConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", distributionConfig.Entities.WmsDockConfig.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DockinVehicleCtrl.ePage.Masters.DockNoList = response.data.Response;
                }
            });
        }

        Init();
    }

})();