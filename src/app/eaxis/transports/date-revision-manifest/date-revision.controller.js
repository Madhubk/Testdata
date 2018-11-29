(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DateRevisionController", DateRevisionController);

    DateRevisionController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "dateRevisionConfig", "$timeout", "toastr", "appConfig"];

    function DateRevisionController($location, APP_CONSTANT, authService, apiService, helperService, dateRevisionConfig, $timeout, toastr, appConfig) {

        var DateRevisionCtrl = this;

        function Init() {

            DateRevisionCtrl.ePage = {
                "Title": "",
                "Prefix": "Date_Revision",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": dateRevisionConfig.Entities
            };

            DateRevisionCtrl.ePage.Masters.dataentryName = "DateRevisionManifest";

            // DateRevisionCtrl.ePage.Masters.defaultFilter = {
            //     "ManifestStatus": "DSP",
            //     "ActualDeliveryDate": "null",
            //     "ActualPickupDate": "NOTNULL"
            // }

            DateRevisionCtrl.ePage.Masters.TabList = [];
            DateRevisionCtrl.ePage.Masters.activeTabIndex = 0;
            DateRevisionCtrl.ePage.Masters.isNewManifestClicked = false;
            DateRevisionCtrl.ePage.Masters.IsTabClick = false;
            DateRevisionCtrl.ePage.Masters.Config = dateRevisionConfig;

            //functions
            DateRevisionCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DateRevisionCtrl.ePage.Masters.AddTab = AddTab;
            DateRevisionCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DateRevisionCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DateRevisionCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            DateRevisionCtrl.ePage.Masters.SaveandClose = SaveandClose;

            // Remove all Tabs while load shipment
            dateRevisionConfig.TabList = [];

            // dateRevisionConfig.ValidationFindall();

        }

        function SaveandClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            DateRevisionCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", DateRevisionCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            DateRevisionCtrl.ePage.Masters.Config.SaveAndClose = false;
            DateRevisionCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DateRevisionCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewManifest();
            }
        }

        function AddTab(currentManifest, isNew) {
            DateRevisionCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = DateRevisionCtrl.ePage.Masters.TabList.some(function (value) {
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
                DateRevisionCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                dateRevisionConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    DateRevisionCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DateRevisionCtrl.ePage.Masters.activeTabIndex = DateRevisionCtrl.ePage.Masters.TabList.length;
                        DateRevisionCtrl.ePage.Masters.CurrentActiveTab(currentManifest.entity.ManifestNumber);
                        DateRevisionCtrl.ePage.Masters.IsTabClick = false;
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
            DateRevisionCtrl.ePage.Masters.currentManifest = currentTab;
        }

        function RemoveTab(event, index, currentManifest) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            DateRevisionCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewManifest() {
            var _isExist = DateRevisionCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                DateRevisionCtrl.ePage.Masters.isNewManifestClicked = true;

                helperService.getFullObjectUsingGetById(DateRevisionCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response
                        };
                        DateRevisionCtrl.ePage.Masters.AddTab(_obj, true);
                        DateRevisionCtrl.ePage.Masters.isNewManifestClicked = false;
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