(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupController", PickupController);

    PickupController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "pickupConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function PickupController($location, APP_CONSTANT, authService, apiService, helperService, pickupConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {

        var PickupCtrl = this,
            location = $location;

        function Init() {
            PickupCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": pickupConfig.Entities
            };

            PickupCtrl.ePage.Masters.dataentryName = "PickupRequest";
            PickupCtrl.ePage.Masters.taskName = "PickupRequest";
            PickupCtrl.ePage.Masters.TabList = [];
            pickupConfig.TabList = [];
            PickupCtrl.ePage.Masters.activeTabIndex = 0;
            PickupCtrl.ePage.Masters.isNewClicked = false;
            PickupCtrl.ePage.Masters.IsTabClick = false;
            PickupCtrl.ePage.Masters.Config = pickupConfig;

            pickupConfig.ValidationFindall();

            //functions
            PickupCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            PickupCtrl.ePage.Masters.AddTab = AddTab;
            PickupCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            PickupCtrl.ePage.Masters.RemoveTab = RemoveTab;
            PickupCtrl.ePage.Masters.CreateNewPickup = CreateNewPickup;
            PickupCtrl.ePage.Masters.SaveandClose = SaveandClose;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                PickupCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewPickup();
            }
        }

        function AddTab(currentPickup, isNew) {
            PickupCtrl.ePage.Masters.currentPickup = undefined;

            var _isExist = PickupCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentPickup.entity.WorkOrderID)
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
                PickupCtrl.ePage.Masters.IsTabClick = true;
                var _currentPickup = undefined;
                if (!isNew) {
                    _currentPickup = currentPickup.entity;
                } else {
                    _currentPickup = currentPickup;
                }

                pickupConfig.GetTabDetails(_currentPickup, isNew).then(function (response) {
                    PickupCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        PickupCtrl.ePage.Masters.activeTabIndex = PickupCtrl.ePage.Masters.TabList.length;
                        PickupCtrl.ePage.Masters.CurrentActiveTab(currentPickup.entity.WorkOrderID);
                        PickupCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Pickup already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            PickupCtrl.ePage.Masters.currentPickup = currentTab;
        }


        function RemoveTab(event, index, currentPickup) {
            event.preventDefault();
            event.stopPropagation();
            var currentPickup = currentPickup[currentPickup.label].ePage.Entities;
            PickupCtrl.ePage.Masters.TabList.splice(index, 1);

            // apiService.get("eAxisAPI", PickupCtrl.ePage.Entities.Header.API.SessionClose.Url + currentPickup.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
        }

        function CreateNewPickup() {
            var _isExist = PickupCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                PickupCtrl.ePage.Entities.Header.Message = false;
                PickupCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(PickupCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsPickup,
                            data: response.data.Response.Response,
                            Validations: response.data.Response.Validations
                        };
                        PickupCtrl.ePage.Masters.AddTab(_obj, true);
                        PickupCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Pickup response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }



        function SaveandClose(index, currentPickup) {
            var currentPickup = currentPickup[currentPickup.label].ePage.Entities;
            PickupCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            PickupCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", PickupCtrl.ePage.Entities.Header.API.SessionClose.Url + currentPickup.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            PickupCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }

})();
