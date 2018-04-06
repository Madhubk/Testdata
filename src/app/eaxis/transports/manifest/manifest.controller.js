(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdminManifestController", AdminManifestController);

    AdminManifestController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "adminManifestConfig", "$timeout", "toastr", "appConfig"];

    function AdminManifestController($location, APP_CONSTANT, authService, apiService, helperService, adminManifestConfig, $timeout, toastr, appConfig) {

        var AdminManifestCtrl = this;

        function Init() {

            AdminManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": adminManifestConfig.Entities
            };

            AdminManifestCtrl.ePage.Masters.taskName = "TransportsManifest";
            AdminManifestCtrl.ePage.Masters.dataentryName = "Manifest";
            AdminManifestCtrl.ePage.Masters.TabList = [];
            AdminManifestCtrl.ePage.Masters.activeTabIndex = 0;
            AdminManifestCtrl.ePage.Masters.isNewManifestClicked = false;
            AdminManifestCtrl.ePage.Masters.IsTabClick = false;
            AdminManifestCtrl.ePage.Masters.Config = adminManifestConfig;

            //functions
            AdminManifestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AdminManifestCtrl.ePage.Masters.AddTab = AddTab;
            AdminManifestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AdminManifestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AdminManifestCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            AdminManifestCtrl.ePage.Masters.SaveandClose = SaveandClose;
            
            adminManifestConfig.ValidationFindall();
        }

        function SaveandClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            AdminManifestCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", AdminManifestCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            AdminManifestCtrl.ePage.Masters.Config.SaveAndClose = false;
            AdminManifestCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                AdminManifestCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewManifest();
            }
        }

        function AddTab(currentManifest, isNew) {
            AdminManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = AdminManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if(value.label === currentManifest.entity.ManifestNumber)
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
                AdminManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                adminManifestConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    AdminManifestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        AdminManifestCtrl.ePage.Masters.activeTabIndex = AdminManifestCtrl.ePage.Masters.TabList.length;
                        AdminManifestCtrl.ePage.Masters.CurrentActiveTab(currentManifest.entity.ManifestNumber);
                        AdminManifestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Manifest already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            }
            AdminManifestCtrl.ePage.Masters.currentManifest = currentTab;
        }

        function RemoveTab(event, index, currentManifest) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            AdminManifestCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewManifest() {
            var _isExist = AdminManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                AdminManifestCtrl.ePage.Masters.isNewManifestClicked = true;
                helperService.getFullObjectUsingGetById(AdminManifestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response
                        };
                        AdminManifestCtrl.ePage.Masters.AddTab(_obj, true);
                        AdminManifestCtrl.ePage.Masters.isNewManifestClicked = false;
                    } else {
                        console.log("Empty New Manifest response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }    
        Init();
    }
})();