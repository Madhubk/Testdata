(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardViewController", InwardViewController);

    InwardViewController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "inwardViewConfig", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function InwardViewController($location, APP_CONSTANT, authService, apiService, helperService, inwardViewConfig, $timeout, toastr, appConfig, $rootScope, $scope, $window) {
        
        var InwardViewCtrl = this,
            location = $location;

        function Init() {
            InwardViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": inwardViewConfig.Entities
            };
            
            InwardViewCtrl.ePage.Masters.dataentryName = "InwardCustomerView";
            InwardViewCtrl.ePage.Masters.taskName = "InwardCustomerView";
            InwardViewCtrl.ePage.Masters.TabList = [];
            inwardViewConfig.TabList = [];
            InwardViewCtrl.ePage.Masters.activeTabIndex = 0;
            InwardViewCtrl.ePage.Masters.isNewClicked = false;
            InwardViewCtrl.ePage.Masters.IsTabClick = false;
            InwardViewCtrl.ePage.Masters.Config = inwardViewConfig;




            //functions
            InwardViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            InwardViewCtrl.ePage.Masters.AddTab = AddTab;
            InwardViewCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            InwardViewCtrl.ePage.Masters.RemoveTab = RemoveTab;

        }

      

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                InwardViewCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function AddTab(currentInward, isNew) {
            InwardViewCtrl.ePage.Masters.currentInward = undefined;

            var _isExist = InwardViewCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentInward.entity.WorkOrderID)
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
                InwardViewCtrl.ePage.Masters.IsTabClick = true;
                var _currentInward = undefined;
                if (!isNew) {
                    _currentInward = currentInward.entity;
                } else {
                    _currentInward = currentInward;
                }

                inwardViewConfig.GetTabDetails(_currentInward, isNew).then(function (response) {
                    InwardViewCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        InwardViewCtrl.ePage.Masters.activeTabIndex = InwardViewCtrl.ePage.Masters.TabList.length;
                        InwardViewCtrl.ePage.Masters.CurrentActiveTab(currentInward.entity.WorkOrderID);
                        InwardViewCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Inward view already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            InwardViewCtrl.ePage.Masters.currentInward = currentTab;
        }

        function RemoveTab(event, index, currentInward) {
            event.preventDefault();
            event.stopPropagation();
            var currentInward = currentInward[currentInward.label].ePage.Entities;
            InwardViewCtrl.ePage.Masters.TabList.splice(index, 1);
            apiService.get("eAxisAPI", InwardViewCtrl.ePage.Entities.Header.API.SessionClose.Url + currentInward.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }
         
        Init();

    }

})();
