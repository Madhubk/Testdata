(function(){
    "use strict";

    angular
         .module("Application")
         .controller("ManifestTransactionController",ManifestTransactionController);

    ManifestTransactionController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "manifestTransConfig", "$timeout", "toastr", "appConfig"];

    function ManifestTransactionController($location, APP_CONSTANT, authService, apiService, helperService, manifestTransConfig, $timeout, toastr, appConfig){

        var ManifestTransCtrl = this;

        function Init() {
            
            ManifestTransCtrl.ePage = {
                "Title": "",
                "Prefix": "ManifestTrans",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": manifestTransConfig.Entities
            };

            ManifestTransCtrl.ePage.Masters.dataentryName = "TransportsManifest";
            ManifestTransCtrl.ePage.Masters.taskName = "TransportsManifest";
            ManifestTransCtrl.ePage.Masters.TabList = [];
            manifestTransConfig.TabList = [];
            ManifestTransCtrl.ePage.Masters.activeTabIndex = 0;
            ManifestTransCtrl.ePage.Masters.isNewClicked = false;
            ManifestTransCtrl.ePage.Masters.IsTabClick = false;

            //functions
            ManifestTransCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ManifestTransCtrl.ePage.Masters.AddTab = AddTab;
            ManifestTransCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ManifestTransCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ManifestTransCtrl.ePage.Masters.CreateNewManifestTrans = CreateNewManifestTrans;
            ManifestTransCtrl.ePage.Masters.Config = manifestTransConfig;
            

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                ManifestTransCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewManifestTrans();
            }
        }
            
        function AddTab(currentManifestTrans, isNew) {
            ManifestTransCtrl.ePage.Masters.currentManifestTrans = undefined;

            var _isExist = ManifestTransCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentManifestTrans.entity.ManifestNumber)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });
            
            if (!_isExist) {
                ManifestTransCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifestTrans = undefined;
                if (!isNew) {
                    _currentManifestTrans = currentManifestTrans.entity;
                } else {
                    _currentManifestTrans = currentManifestTrans;
                }

                manifestTransConfig.GetTabDetails(_currentManifestTrans, isNew).then(function (response) {
                    ManifestTransCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ManifestTransCtrl.ePage.Masters.activeTabIndex = ManifestTransCtrl.ePage.Masters.TabList.length;
                        ManifestTransCtrl.ePage.Masters.CurrentActiveTab(currentManifestTrans.entity.ManifestNumber);
                        ManifestTransCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('ManifestTrans already opened ');
            }
        }
            
        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            ManifestTransCtrl.ePage.Masters.currentManifestTrans = currentTab;
        }

            
        function RemoveTab(event, index, currentManifestTrans) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifestTrans = currentManifestTrans[currentManifestTrans.label].ePage.Entities;
            ManifestTransCtrl.ePage.Masters.TabList.splice(index, 1);
        }
            
            
        function CreateNewManifestTrans() {
            var _isExist = ManifestTransCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                ManifestTransCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(ManifestTransCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response,
                            Validations:response.data.Validations
                        };
                        ManifestTransCtrl.ePage.Masters.AddTab(_obj, true);
                        ManifestTransCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New ManifestTrans response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }
        

        Init();

    }
})();