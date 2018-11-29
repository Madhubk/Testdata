(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupManifestController", PickupManifestController);

    PickupManifestController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "pickupManifestConfig", "$timeout", "toastr", "appConfig"];

    function PickupManifestController($location, APP_CONSTANT, authService, apiService, helperService, pickupManifestConfig, $timeout, toastr, appConfig) {

        var PickupManifestCtrl = this;

        function Init() {

            PickupManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": pickupManifestConfig.Entities
            };

            PickupManifestCtrl.ePage.Masters.dataentryName = "PickupManifest";

            PickupManifestCtrl.ePage.Masters.defaultFilter = {
                "ManifestStatus": "DSP",
                "ActualPickupDate":"null"
            }

            PickupManifestCtrl.ePage.Masters.TabList = [];
            PickupManifestCtrl.ePage.Masters.activeTabIndex = 0;
            PickupManifestCtrl.ePage.Masters.isNewManifestClicked = false;
            PickupManifestCtrl.ePage.Masters.IsTabClick = false;
            PickupManifestCtrl.ePage.Masters.Config = pickupManifestConfig;

            //functions
            PickupManifestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            PickupManifestCtrl.ePage.Masters.AddTab = AddTab;
            PickupManifestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            PickupManifestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            PickupManifestCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            PickupManifestCtrl.ePage.Masters.SaveandClose = SaveandClose;

            pickupManifestConfig.ValidationFindall();

            // Remove all Tabs while load shipment
            pickupManifestConfig.TabList = [];

        }
        
        function SaveandClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            PickupManifestCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", PickupManifestCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            PickupManifestCtrl.ePage.Masters.Config.SaveAndClose = false;
            PickupManifestCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                PickupManifestCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewManifest();
            }
        }

        function AddTab(currentManifest, isNew) {
            PickupManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = PickupManifestCtrl.ePage.Masters.TabList.some(function (value) {
                // if (!isNew) {
                //     return value.label === currentManifest.entity.ManifestNumber;
                // } else {
                //     return false;
                // }
                if (!isNew) {
                    if (value.label === currentManifest.entity.ManifestNumber)
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
                PickupManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                pickupManifestConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    PickupManifestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        PickupManifestCtrl.ePage.Masters.activeTabIndex = PickupManifestCtrl.ePage.Masters.TabList.length;
                        PickupManifestCtrl.ePage.Masters.CurrentActiveTab(currentManifest.entity.ManifestNumber);
                        PickupManifestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Pickup Manifest already opened ');
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
            PickupManifestCtrl.ePage.Masters.currentManifest = currentTab;
        }

        function RemoveTab(event, index, currentManifest) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            PickupManifestCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewManifest() {
            var _isExist = PickupManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                PickupManifestCtrl.ePage.Masters.isNewManifestClicked = true;

                helperService.getFullObjectUsingGetById(PickupManifestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response
                        };
                        PickupManifestCtrl.ePage.Masters.AddTab(_obj, true);
                        PickupManifestCtrl.ePage.Masters.isNewManifestClicked = false;
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