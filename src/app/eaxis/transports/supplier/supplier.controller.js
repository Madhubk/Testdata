(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SupplierController", SupplierController);

    SupplierController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "supplierConfig", "$timeout", "toastr", "appConfig"];

    function SupplierController($location, APP_CONSTANT, authService, apiService, helperService, supplierConfig, $timeout, toastr, appConfig) {

        var SupplierCtrl = this;

        function Init() {

            SupplierCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": supplierConfig.Entities
            };

            SupplierCtrl.ePage.Masters.dataentryName = "TransportsConsignment";
            SupplierCtrl.ePage.Masters.TabList = [];
            SupplierCtrl.ePage.Masters.activeTabIndex = 0;
            SupplierCtrl.ePage.Masters.isNewSupplierClicked = false;
            SupplierCtrl.ePage.Masters.IsTabClick = false;
            SupplierCtrl.ePage.Masters.Config = supplierConfig;

            // Remove all Tabs while load shipment
            supplierConfig.TabList = [];

            //functions
            SupplierCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            SupplierCtrl.ePage.Masters.AddTab = AddTab;
            SupplierCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            SupplierCtrl.ePage.Masters.RemoveTab = RemoveTab;
            SupplierCtrl.ePage.Masters.CreateNewSupplier = CreateNewSupplier;
            SupplierCtrl.ePage.Masters.SaveandClose = SaveandClose;

            supplierConfig.ValidationFindall();
        }

        function SaveandClose(index, currentSupplier) {
            var currentSupplier = currentSupplier[currentSupplier.label].ePage.Entities;
            SupplierCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", SupplierCtrl.ePage.Entities.Header.API.SessionClose.Url + currentSupplier.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            SupplierCtrl.ePage.Masters.Config.SaveAndClose = false;
            SupplierCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                SupplierCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewSupplier();
            }
        }

        function AddTab(currentSupplier, isNew) {
            SupplierCtrl.ePage.Masters.currentSupplier = undefined;

            var _isExist = SupplierCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentSupplier.entity.SupplierNumber)
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
                SupplierCtrl.ePage.Masters.IsTabClick = true;
                var _currentSupplier = undefined;
                if (!isNew) {
                    _currentSupplier = currentSupplier.entity;
                } else {
                    _currentSupplier = currentSupplier;
                }

                supplierConfig.GetTabDetails(_currentSupplier, isNew).then(function (response) {
                    SupplierCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        SupplierCtrl.ePage.Masters.activeTabIndex = SupplierCtrl.ePage.Masters.TabList.length;
                        SupplierCtrl.ePage.Masters.CurrentActiveTab(currentSupplier.entity.SupplierNumber);
                        SupplierCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Supplier already opened ');
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
            SupplierCtrl.ePage.Masters.currentSupplier = currentTab;
        }

        function RemoveTab(event, index, currentSupplier) {
            event.preventDefault();
            event.stopPropagation();
            var currentSupplier = currentSupplier[currentSupplier.label].ePage.Entities;
            SupplierCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewSupplier() {
            var _isExist = SupplierCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                SupplierCtrl.ePage.Masters.isNewSupplierClicked = true;
                helperService.getFullObjectUsingGetById(SupplierCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsConsignmentHeader,
                            data: response.data.Response
                        };
                        SupplierCtrl.ePage.Masters.AddTab(_obj, true);
                        SupplierCtrl.ePage.Masters.isNewSupplierClicked = false;
                    } else {
                        console.log("Empty New Supplier response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }
        Init();
    }
})();