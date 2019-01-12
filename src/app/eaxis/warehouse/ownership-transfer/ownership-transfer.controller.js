(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OwnershipTransferController", OwnershipTransferController);

    OwnershipTransferController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "ownershipTransferConfig", "toastr"];

    function OwnershipTransferController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, appConfig, helperService, ownershipTransferConfig, toastr) {
        /* jshint validthis: true */
        var OwnerTransferCtrl = this;

        function Init() {
            OwnerTransferCtrl.ePage = {
                "Title": "",
                "Prefix": "Ownership_Transfer",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ownershipTransferConfig.Entities
            };

            OwnerTransferCtrl.ePage.Masters.dataentryName = "OwnershipTransfer";
            OwnerTransferCtrl.ePage.Masters.taskName = "StockTransfer";
            OwnerTransferCtrl.ePage.Masters.defaultFilter = {
                "WorkOrderSubType": "OWN"
            }
            OwnerTransferCtrl.ePage.Masters.TabList = [];
            ownershipTransferConfig.TabList = [];
            OwnerTransferCtrl.ePage.Masters.activeTabIndex = 0;
            OwnerTransferCtrl.ePage.Masters.isNewClicked = false;
            OwnerTransferCtrl.ePage.Masters.IsTabClick = false;

            ownershipTransferConfig.ValidationFindall();

            //functions
            OwnerTransferCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OwnerTransferCtrl.ePage.Masters.AddTab = AddTab;
            OwnerTransferCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OwnerTransferCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OwnerTransferCtrl.ePage.Masters.CreateNewcurrentOwnerTransfer = CreateNewcurrentOwnerTransfer;
            OwnerTransferCtrl.ePage.Masters.Config = ownershipTransferConfig;
            OwnerTransferCtrl.ePage.Masters.SaveandClose = SaveandClose;

        }


        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OwnerTransferCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewcurrentOwnerTransfer();
            }
        }

        function AddTab(currentOwnerTransfer, isNew) {
            OwnerTransferCtrl.ePage.Masters.currentOwnerTransfer = undefined;

            var _isExist = OwnerTransferCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentOwnerTransfer.entity.WorkOrderID)
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
                OwnerTransferCtrl.ePage.Masters.IsTabClick = true;
                var _currentOwnerTransfer = undefined;
                if (!isNew) {
                    _currentOwnerTransfer = currentOwnerTransfer.entity;
                } else {
                    _currentOwnerTransfer = currentOwnerTransfer;
                }

                ownershipTransferConfig.GetTabDetails(_currentOwnerTransfer, isNew).then(function (response) {
                    OwnerTransferCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        OwnerTransferCtrl.ePage.Masters.activeTabIndex = OwnerTransferCtrl.ePage.Masters.TabList.length;
                        OwnerTransferCtrl.ePage.Masters.CurrentActiveTab(currentOwnerTransfer.entity.WorkOrderID);
                        OwnerTransferCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Id already opened');
            }
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            OwnerTransferCtrl.ePage.Masters.currentOwnerTransfer = currentTab;
        }


        function RemoveTab(event, index, currentOwnerTransfer) {
            event.preventDefault();
            event.stopPropagation();
            var currentOwnerTransfer = currentOwnerTransfer[currentOwnerTransfer.label].ePage.Entities;
            OwnerTransferCtrl.ePage.Masters.TabList.splice(index, 1);
            apiService.get("eAxisAPI", OwnerTransferCtrl.ePage.Entities.Header.API.SessionClose.Url + currentOwnerTransfer.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewcurrentOwnerTransfer() {
            var _isExist = OwnerTransferCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                OwnerTransferCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(OwnerTransferCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIWmsStockTransferHeader.PK = response.data.Response.Response.PK
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsStockTransferHeader,
                            data: response.data.Response.Response
                        };

                        OwnerTransferCtrl.ePage.Masters.AddTab(_obj, true);
                        OwnerTransferCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New StockTransfer response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function SaveandClose(index, currentOwnerTransfer) {
            var currentOwnerTransfer = currentOwnerTransfer[currentOwnerTransfer.label].ePage.Entities;
            OwnerTransferCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            OwnerTransferCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", OwnerTransferCtrl.ePage.Entities.Header.API.SessionClose.Url + currentOwnerTransfer.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            OwnerTransferCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();
    }
})();
