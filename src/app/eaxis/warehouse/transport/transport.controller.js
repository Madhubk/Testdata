(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportController", TransportController);

    TransportController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "transportConfig", "$timeout", "toastr", "appConfig"];

    function TransportController($location, APP_CONSTANT, authService, apiService, helperService, transportConfig, $timeout, toastr, appConfig) {


        var TransportCtrl = this;

        function Init() {

            TransportCtrl.ePage = {
                "Title": "",
                "Prefix": "Transport",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": transportConfig.Entities
            };
            TransportCtrl.ePage.Masters.taskName = "WarehouseTransport";
            TransportCtrl.ePage.Masters.dataentryName = "WarehouseTransport";

            TransportCtrl.ePage.Masters.Config=transportConfig;

            TransportCtrl.ePage.Masters.TabList = [];
            TransportCtrl.ePage.Masters.activeTabIndex = 0;
            TransportCtrl.ePage.Masters.SaveButtonText = "Save";
            TransportCtrl.ePage.Masters.IsDisableSave = false;
            TransportCtrl.ePage.Masters.IsNewClicked = false;
            TransportCtrl.ePage.Masters.IsTabClick = false;



            TransportCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TransportCtrl.ePage.Masters.AddTab = AddTab;
            TransportCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TransportCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TransportCtrl.ePage.Masters.SaveandClose = SaveandClose;

            TransportCtrl.ePage.Masters.CreateNewTransport = CreateNewTransport;

        }
        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                TransportCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentTransport, isNew) {
            TransportCtrl.ePage.Masters.currentTransport = undefined;

            var _isExist = TransportCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentTransport.entity.TransportRefNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                TransportCtrl.ePage.Masters.IsTabClick = true;
                var _currentTransport = undefined;
                if (!isNew) {
                    _currentTransport = currentTransport.entity;
                } else {
                    _currentTransport = currentTransport;
                }

                transportConfig.GetTabDetails(_currentTransport, isNew).then(function (response) {
                    TransportCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        TransportCtrl.ePage.Masters.activeTabIndex = TransportCtrl.ePage.Masters.TabList.length;
                        TransportCtrl.ePage.Masters.CurrentActiveTab(currentTransport.entity.TransportRefNo);
                        TransportCtrl.ePage.Masters.IsTabClick = false;

                    });
                });
            } else {
                toastr.info('Transport already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            console.log(currentTab)
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            TransportCtrl.ePage.Masters.currentTransport = currentTab;
        }

        function RemoveTab(event, index, currentTransport) {
            event.preventDefault();
            event.stopPropagation();
            var currentTransport = currentTransport[currentTransport.label].ePage.Entities;
            TransportCtrl.ePage.Masters.TabList.splice(index, 1);
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

        function CreateNewTransport() {

            TransportCtrl.ePage.Masters.IsNewClicked = true;
            helperService.getFullObjectUsingGetById(TransportCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {

                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIWmsTransportHeader,
                        data: response.data.Response.Response
                    };
                    TransportCtrl.ePage.Masters.AddTab(_obj, true);
                    TransportCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Transport response");
                }
            });
        }
     

        function SaveandClose(index, currentTransport){
            var currentTransport = currentTransport[currentTransport.label].ePage.Entities;
            TransportCtrl.ePage.Masters.TabList.splice(index-1, 1);
            TransportCtrl.ePage.Masters.Config.SaveAndClose = false;
            TransportCtrl.ePage.Masters.activeTabIndex = 0;
        }
        
        Init();
    }

})();	