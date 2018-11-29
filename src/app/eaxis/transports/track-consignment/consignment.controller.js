(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentController", ConsignmentController);

    ConsignmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "consignmentConfig", "$timeout", "toastr", "appConfig"];

    function ConsignmentController($location, APP_CONSTANT, authService, apiService, helperService, consignmentConfig, $timeout, toastr, appConfig) {

        var ConsignmentCtrl = this;

        function Init() {

            ConsignmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": consignmentConfig.Entities
            };

            ConsignmentCtrl.ePage.Masters.dataentryName = "TransportsConsignment";
            ConsignmentCtrl.ePage.Masters.TabList = [];
            ConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
            ConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
            ConsignmentCtrl.ePage.Masters.IsTabClick = false;
            ConsignmentCtrl.ePage.Masters.Config = consignmentConfig;

            // Remove all Tabs while load shipment
            consignmentConfig.TabList = [];

            //functions
            ConsignmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ConsignmentCtrl.ePage.Masters.AddTab = AddTab;
            ConsignmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ConsignmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ConsignmentCtrl.ePage.Masters.CreateNewConsignment = CreateNewConsignment;
            ConsignmentCtrl.ePage.Masters.SaveandClose = SaveandClose;

            consignmentConfig.ValidationFindall();
        }

        function SaveandClose(index, currentConsignment) {
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            ConsignmentCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", ConsignmentCtrl.ePage.Entities.Header.API.SessionClose.Url + currentConsignment.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            ConsignmentCtrl.ePage.Masters.Config.SaveAndClose = false;
            ConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                ConsignmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewConsignment();
            }
        }

        function AddTab(currentConsignment, isNew) {
            ConsignmentCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = ConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentConsignment.entity.ConsignmentNumber)
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
                ConsignmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                }

                consignmentConfig.GetTabDetails(_currentConsignment, isNew).then(function (response) {
                    ConsignmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ConsignmentCtrl.ePage.Masters.activeTabIndex = ConsignmentCtrl.ePage.Masters.TabList.length;
                        ConsignmentCtrl.ePage.Masters.CurrentActiveTab(currentConsignment.entity.ConsignmentNumber);
                        ConsignmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Consignment already opened ');
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
            ConsignmentCtrl.ePage.Masters.currentConsignment = currentTab;
        }

        function RemoveTab(event, index, currentConsignment) {
            event.preventDefault();
            event.stopPropagation();
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            ConsignmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewConsignment() {
            var _isExist = ConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                ConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = true;
                helperService.getFullObjectUsingGetById(ConsignmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsConsignmentHeader,
                            data: response.data.Response
                        };
                        ConsignmentCtrl.ePage.Masters.AddTab(_obj, true);
                        ConsignmentCtrl.ePage.Masters.isNewConsignmentClicked = false;
                    } else {
                        console.log("Empty New Consignment response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }
        Init();
    }
})();