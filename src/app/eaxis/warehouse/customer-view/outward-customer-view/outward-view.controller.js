(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardViewController", OutwardViewController);

    OutwardViewController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "outwardViewConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function OutwardViewController($location, APP_CONSTANT, authService, apiService, helperService, outwardViewConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var OutwardViewCtrl = this,
            location = $location;

        function Init() {
            OutwardViewCtrl.ePage = {
                "Title": "",
                "Prefix": "outward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": outwardViewConfig.Entities
            };
            

            OutwardViewCtrl.ePage.Masters.dataentryName = "OutwardCustomerView";
            OutwardViewCtrl.ePage.Masters.taskName = "OutwardCustomerView";
            OutwardViewCtrl.ePage.Masters.TabList = [];
            outwardViewConfig.TabList = [];
            OutwardViewCtrl.ePage.Masters.activeTabIndex = 0;
            OutwardViewCtrl.ePage.Masters.isNewClicked = false;
            OutwardViewCtrl.ePage.Masters.IsTabClick = false;
            OutwardViewCtrl.ePage.Masters.Config = outwardViewConfig;



            //functions
            OutwardViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OutwardViewCtrl.ePage.Masters.AddTab = AddTab;
            OutwardViewCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OutwardViewCtrl.ePage.Masters.RemoveTab = RemoveTab;

        }

      

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OutwardViewCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentOutward, isNew) {
            OutwardViewCtrl.ePage.Masters.currentOutward = undefined;

            var _isExist = OutwardViewCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentOutward.entity.WorkOrderID)
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
                OutwardViewCtrl.ePage.Masters.IsTabClick = true;
                var _currentOutward = undefined;
                if (!isNew) {
                    _currentOutward = currentOutward.entity;
                } else {
                    _currentOutward = currentOutward;
                }

                outwardViewConfig.GetTabDetails(_currentOutward, isNew).then(function (response) {
                    OutwardViewCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        OutwardViewCtrl.ePage.Masters.activeTabIndex = OutwardViewCtrl.ePage.Masters.TabList.length;
                        OutwardViewCtrl.ePage.Masters.CurrentActiveTab(currentOutward.entity.WorkOrderID);
                        OutwardViewCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('outward view already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            OutwardViewCtrl.ePage.Masters.currentOutward = currentTab;
        }

        function RemoveTab(event, index, currentOutward) {
            event.preventDefault();
            event.stopPropagation();
            var currentOutward = currentOutward[currentOutward.label].ePage.Entities;
            OutwardViewCtrl.ePage.Masters.TabList.splice(index, 1);
            apiService.get("eAxisAPI", OutwardViewCtrl.ePage.Entities.Header.API.SessionClose.Url + currentOutward.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }
        
        Init();

    }

})();
