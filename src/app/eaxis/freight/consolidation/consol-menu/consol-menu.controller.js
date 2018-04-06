(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolMenuController", ConsolMenuController);

    ConsolMenuController.$inject = ["helperService", "appConfig", "consolidationConfig"];

    function ConsolMenuController(helperService, appConfig, consolidationConfig) {
        var ConsolMenuCtrl = this;

        function Init() {
            var currentConsol = ConsolMenuCtrl.currentConsol[ConsolMenuCtrl.currentConsol.label].ePage.Entities;
            ConsolMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ConsolMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ConsolMenuCtrl.ePage.Masters.ConsolMenu = {};

            // Standard Menu Configuration and Data
            ConsolMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.ConsolHeader;
            ConsolMenuCtrl.ePage.Masters.StandardMenuInput.obj = ConsolMenuCtrl.currentConsol;


            // Menu list from configuration
            ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = ConsolMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            // Save
            ConsolMenuCtrl.ePage.Masters.Save = Save;
            ConsolMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ConsolMenuCtrl.ePage.Masters.IsDisableSave = false;
        }

        function Save($item) {
            ConsolMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ConsolMenuCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIConConsolHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Consol').then(function (response) {
                if (response.Status === "success") {
                    var _index = consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ConsolMenuCtrl.currentConsol.label);

                    if (_index !== -1) {
                        consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        consolidationConfig.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                ConsolMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ConsolMenuCtrl.ePage.Masters.IsDisableSave = false;
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
