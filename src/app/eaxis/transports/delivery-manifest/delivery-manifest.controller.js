(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryManifestController", DeliveryManifestController);

    DeliveryManifestController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "deliveryManifestConfig", "$timeout", "toastr", "appConfig"];

    function DeliveryManifestController($location, APP_CONSTANT, authService, apiService, helperService, deliveryManifestConfig, $timeout, toastr, appConfig) {

        var DeliveryManifestCtrl = this;

        function Init() {

            DeliveryManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": deliveryManifestConfig.Entities
            };

            DeliveryManifestCtrl.ePage.Masters.dataentryName = "DeliveryManifest";

            DeliveryManifestCtrl.ePage.Masters.defaultFilter = {
                "ManifestStatus": "DSP",
                "ActualDeliveryDate": "null",
                "ActualPickupDate": "NOTNULL"
            }

            DeliveryManifestCtrl.ePage.Masters.TabList = [];
            DeliveryManifestCtrl.ePage.Masters.activeTabIndex = 0;
            DeliveryManifestCtrl.ePage.Masters.isNewManifestClicked = false;
            DeliveryManifestCtrl.ePage.Masters.IsTabClick = false;
            DeliveryManifestCtrl.ePage.Masters.Config = deliveryManifestConfig;

            //functions
            DeliveryManifestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DeliveryManifestCtrl.ePage.Masters.AddTab = AddTab;
            DeliveryManifestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DeliveryManifestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DeliveryManifestCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            DeliveryManifestCtrl.ePage.Masters.SaveandClose = SaveandClose;

            // Remove all Tabs while load shipment
            deliveryManifestConfig.TabList = [];

            // deliveryManifestConfig.ValidationFindall();

        }

        function SaveandClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            DeliveryManifestCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", DeliveryManifestCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            DeliveryManifestCtrl.ePage.Masters.Config.SaveAndClose = false;
            DeliveryManifestCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DeliveryManifestCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewManifest();
            }
        }

        function AddTab(currentManifest, isNew) {
            DeliveryManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = DeliveryManifestCtrl.ePage.Masters.TabList.some(function (value) {
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
                DeliveryManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                deliveryManifestConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    DeliveryManifestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DeliveryManifestCtrl.ePage.Masters.activeTabIndex = DeliveryManifestCtrl.ePage.Masters.TabList.length;
                        DeliveryManifestCtrl.ePage.Masters.CurrentActiveTab(currentManifest.entity.ManifestNumber);
                        DeliveryManifestCtrl.ePage.Masters.IsTabClick = false;
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
            DeliveryManifestCtrl.ePage.Masters.currentManifest = currentTab;
        }

        function RemoveTab(event, index, currentManifest) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            DeliveryManifestCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewManifest() {
            var _isExist = DeliveryManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                DeliveryManifestCtrl.ePage.Masters.isNewManifestClicked = true;

                helperService.getFullObjectUsingGetById(DeliveryManifestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response
                        };
                        DeliveryManifestCtrl.ePage.Masters.AddTab(_obj, true);
                        DeliveryManifestCtrl.ePage.Masters.isNewManifestClicked = false;
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