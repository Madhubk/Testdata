(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportMenuController", TransportMenuController);

    TransportMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "transportConfig", "helperService", "appConfig"];

    function TransportMenuController($scope, $timeout, APP_CONSTANT, apiService, transportConfig, helperService, appConfig) {

        var TransportMenuCtrl = this;

        function Init() {

            var currentTransport = TransportMenuCtrl.currentTransport[TransportMenuCtrl.currentTransport.label].ePage.Entities;


            TransportMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Transport_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTransport

            };

            
            // function
            TransportMenuCtrl.ePage.Masters.Save = Save;
            TransportMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            TransportMenuCtrl.ePage.Masters.IsDisableSave = false;

            TransportMenuCtrl.ePage.Masters.Config = transportConfig;

            TransportMenuCtrl.ePage.Masters.TransportMenu = {};
            // Menu list from configuration

            TransportMenuCtrl.ePage.Masters.TransportMenu.ListSource = TransportMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            GetDropDownDescription();
        }
        function GetDropDownDescription() {

            var Status = TransportMenuCtrl.ePage.Entities.Header.Data.UIWmsTransportHeader.Status;


            switch (Status) {

                case "ENT":
                    TransportMenuCtrl.ePage.Masters.Status = "Entered";
                    break;

                default:
                    TransportMenuCtrl.ePage.Masters.Status = "";
                    break;
            }
        }
        function Save($item) {
            TransportMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TransportMenuCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsTransportHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Trans').then(function (response) {
                if (response.Status === "success") {
                    var _index = transportConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(TransportMenuCtrl.currentTransport.label);

                    if (_index !== -1) {
                        transportConfig.TabList[_index][transportConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        transportConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                    if(TransportMenuCtrl.ePage.Masters.SaveAndClose){
                        TransportMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        TransportMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
                TransportMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                TransportMenuCtrl.ePage.Masters.IsDisableSave = false;       
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