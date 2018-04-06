(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StocktransferController", StocktransferController);

    StocktransferController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "stocktransferConfig", "toastr"];

    function StocktransferController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, appConfig, helperService, stocktransferConfig, toastr) {
        /* jshint validthis: true */
        var StocktransferCtrl = this;

        function Init() {
            StocktransferCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": stocktransferConfig.Entities
            };

            StocktransferCtrl.ePage.Masters.dataentryName = "WarehouseStockTransfer";
            StocktransferCtrl.ePage.Masters.taskName = "StockTransfer";
            StocktransferCtrl.ePage.Masters.TabList = [];
            StocktransferCtrl.ePage.Masters.activeTabIndex = 0;
            StocktransferCtrl.ePage.Masters.isNewClicked = false;
            StocktransferCtrl.ePage.Masters.IsTabClick = false;

            stocktransferConfig.ValidationFindall();

            //functions
            StocktransferCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            StocktransferCtrl.ePage.Masters.AddTab = AddTab;
            StocktransferCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            StocktransferCtrl.ePage.Masters.RemoveTab = RemoveTab;
            StocktransferCtrl.ePage.Masters.CreateNewcurrentStockTransfer = CreateNewcurrentStockTransfer;
            StocktransferCtrl.ePage.Masters.Config = stocktransferConfig;
            StocktransferCtrl.ePage.Masters.SaveandClose = SaveandClose;

        }


        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                StocktransferCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewcurrentStockTransfer();
            }
        }

        function AddTab(currentStockTransfer, isNew) {
            StocktransferCtrl.ePage.Masters.currentStockTransfer = undefined;

            var _isExist = StocktransferCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentStockTransfer.entity.WorkOrderID)
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
                StocktransferCtrl.ePage.Masters.IsTabClick = true;
                var _currentStockTransfer = undefined;
                if (!isNew) {
                    _currentStockTransfer = currentStockTransfer.entity;
                } else {
                    _currentStockTransfer = currentStockTransfer;
                }

                stocktransferConfig.GetTabDetails(_currentStockTransfer, isNew).then(function (response) {
                    StocktransferCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        StocktransferCtrl.ePage.Masters.activeTabIndex = StocktransferCtrl.ePage.Masters.TabList.length;
                        StocktransferCtrl.ePage.Masters.CurrentActiveTab(currentStockTransfer.entity.WorkOrderID);
                        StocktransferCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('WorkOrder ID already opened');
            }
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            StocktransferCtrl.ePage.Masters.currentStockTransfer = currentTab;
        }


        function RemoveTab(event, index, currentStockTransfer) {
            event.preventDefault();
            event.stopPropagation();
            var currentStockTransfer = currentStockTransfer[currentStockTransfer.label].ePage.Entities;
            StocktransferCtrl.ePage.Masters.TabList.splice(index, 1);
            apiService.get("eAxisAPI", StocktransferCtrl.ePage.Entities.Header.API.SessionClose.Url + currentStockTransfer.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }


        function CreateNewcurrentStockTransfer() {
            var _isExist = StocktransferCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                StocktransferCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(StocktransferCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                    response.data.Response.Response.UIWmsStockTransferHeader.PK = response.data.Response.Response.PK
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsStockTransferHeader,
                            data: response.data.Response.Response
                        };
    
                        StocktransferCtrl.ePage.Masters.AddTab(_obj, true);
                        StocktransferCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New StockTransfer response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }


        function SaveandClose(index, currentStockTransfer){
            var currentStockTransfer = currentStockTransfer[currentStockTransfer.label].ePage.Entities;
            StocktransferCtrl.ePage.Masters.TabList.splice(index-1, 1);
            StocktransferCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", StocktransferCtrl.ePage.Entities.Header.API.SessionClose.Url + currentStockTransfer.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            StocktransferCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();
    }
})();
