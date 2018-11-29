(function(){
    "use strict";

    angular
         .module("Application")
         .controller("StockTransferViewController", StockTransferViewController);

     StockTransferViewController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "stocktransferViewConfig", "$timeout", "toastr", "appConfig","$rootScope", "$scope", "$window"];

    function  StockTransferViewController($location, APP_CONSTANT, authService, apiService, helperService, stocktransferViewConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window){

        var StockTransferViewCtrl = this;

        function Init() {
            
            StockTransferViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Stock Transfer",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": stocktransferViewConfig.Entities
            };

            StockTransferViewCtrl.ePage.Masters.dataentryName = "StockTransferCustomerView";
            StockTransferViewCtrl.ePage.Masters.taskName = "StockTransferCustomerView";
            StockTransferViewCtrl.ePage.Masters.TabList = [];
            stocktransferViewConfig.TabList = [];
            StockTransferViewCtrl.ePage.Masters.activeTabIndex = 0;
            StockTransferViewCtrl.ePage.Masters.isNewClicked = false;
            StockTransferViewCtrl.ePage.Masters.IsTabClick = false;

            //functions
            StockTransferViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            StockTransferViewCtrl.ePage.Masters.AddTab = AddTab;
            StockTransferViewCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            StockTransferViewCtrl.ePage.Masters.RemoveTab = RemoveTab;
            StockTransferViewCtrl.ePage.Masters.Config = stocktransferViewConfig;

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                StockTransferViewCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }
            
        function AddTab(currentStockTransfer, isNew) {
            StockTransferViewCtrl.ePage.Masters.currentStockTransfer = undefined;

            var _isExist = StockTransferViewCtrl.ePage.Masters.TabList.some(function (value) {
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
                StockTransferViewCtrl.ePage.Masters.IsTabClick = true;
                var _currentStockTransfer = undefined;
                if (!isNew) {
                    _currentStockTransfer = currentStockTransfer.entity;
                } else {
                    _currentStockTransfer = currentStockTransfer;
                }

                stocktransferViewConfig.GetTabDetails(_currentStockTransfer, isNew).then(function (response) {
                    StockTransferViewCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        StockTransferViewCtrl.ePage.Masters.activeTabIndex = StockTransferViewCtrl.ePage.Masters.TabList.length;
                        StockTransferViewCtrl.ePage.Masters.CurrentActiveTab(currentStockTransfer.entity.WorkOrderID);
                        StockTransferViewCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('StockTransfer already opened ');
            }
        }
            
        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            StockTransferViewCtrl.ePage.Masters.currentStockTransfer = currentTab;
        }

            
        function RemoveTab(event, index, currentStockTransfer) {
            event.preventDefault();
            event.stopPropagation();
            var currentStockTransfer = currentStockTransfer[currentStockTransfer.label].ePage.Entities;
            StockTransferViewCtrl.ePage.Masters.TabList.splice(index, 1);
        }
 
        Init();

    }
})();