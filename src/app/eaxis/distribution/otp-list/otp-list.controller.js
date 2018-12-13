(function(){
    "use strict";

    angular
         .module("Application")
         .controller("OtpController", OtpController);

     OtpController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "otpconfig", "$timeout", "toastr", "appConfig","$rootScope", "$scope", "$window"];

    function  OtpController($location, APP_CONSTANT, authService, apiService, helperService, otpconfig, $timeout, toastr, appConfig, $rootScope, $scope, $window){

        var OtpCtrl = this;

        function Init() {
            
            OtpCtrl.ePage = {
                "Title": "",
                "Prefix": "OTP List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": otpconfig.Entities
            };

            OtpCtrl.ePage.Masters.dataentryName = "OtpList";
            OtpCtrl.ePage.Masters.taskName = "OtpList";
            OtpCtrl.ePage.Masters.TabList = [];
            otpconfig.TabList = [];
            OtpCtrl.ePage.Masters.activeTabIndex = 0;
            OtpCtrl.ePage.Masters.isNewClicked = false;
            OtpCtrl.ePage.Masters.IsTabClick = false;

            //functions
            OtpCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OtpCtrl.ePage.Masters.AddTab = AddTab;
            OtpCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OtpCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OtpCtrl.ePage.Masters.Config = otpconfig;

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                OtpCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }
            
        function AddTab(currentStockTransfer, isNew) {
            OtpCtrl.ePage.Masters.currentStockTransfer = undefined;

            var _isExist = OtpCtrl.ePage.Masters.TabList.some(function (value) {
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
                OtpCtrl.ePage.Masters.IsTabClick = true;
                var _currentStockTransfer = undefined;
                if (!isNew) {
                    _currentStockTransfer = currentStockTransfer.entity;
                } else {
                    _currentStockTransfer = currentStockTransfer;
                }

                otpconfig.GetTabDetails(_currentStockTransfer, isNew).then(function (response) {
                    OtpCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        OtpCtrl.ePage.Masters.activeTabIndex = OtpCtrl.ePage.Masters.TabList.length;
                        OtpCtrl.ePage.Masters.CurrentActiveTab(currentStockTransfer.entity.WorkOrderID);
                        OtpCtrl.ePage.Masters.IsTabClick = false;
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
            OtpCtrl.ePage.Masters.currentStockTransfer = currentTab;
        }

            
        function RemoveTab(event, index, currentStockTransfer) {
            event.preventDefault();
            event.stopPropagation();
            var currentStockTransfer = currentStockTransfer[currentStockTransfer.label].ePage.Entities;
            OtpCtrl.ePage.Masters.TabList.splice(index, 1);
        }
 
        Init();

    }
})();