(function(){
    "use strict";

    angular
         .module("Application")
         .controller("DMSConsignmentController",DMSConsignmentController);

    DMSConsignmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "dmsconsignmentConfig", "$timeout", "toastr", "appConfig"];

    function DMSConsignmentController($location, APP_CONSTANT, authService, apiService, helperService, dmsconsignmentConfig, $timeout, toastr, appConfig){

        var DMSConsignmentCtrl = this;

        function Init() {
            
            DMSConsignmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": dmsconsignmentConfig.Entities
            };

            DMSConsignmentCtrl.ePage.Masters.dataentryName = "DistributionConsignment";
            DMSConsignmentCtrl.ePage.Masters.taskName = "DistributionConsignment";
            DMSConsignmentCtrl.ePage.Masters.TabList = [];
            DMSConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
            DMSConsignmentCtrl.ePage.Masters.isNewClicked = false;
            DMSConsignmentCtrl.ePage.Masters.IsTabClick = false;
            DMSConsignmentCtrl.ePage.Masters.Config = dmsconsignmentConfig;
            // Remove all Tabs 
            dmsconsignmentConfig.TabList = [];

            //functions
            DMSConsignmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DMSConsignmentCtrl.ePage.Masters.AddTab = AddTab;
            DMSConsignmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DMSConsignmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DMSConsignmentCtrl.ePage.Masters.CreateNewConsignment = CreateNewConsignment;
            DMSConsignmentCtrl.ePage.Masters.SaveandClose = SaveandClose;
            
            dmsconsignmentConfig.ValidationFindall();

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                DMSConsignmentCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewConsignment();
            }
        }
            
        function AddTab(currentConsignment, isNew) {
            DMSConsignmentCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = DMSConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
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
                DMSConsignmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                 }

                dmsconsignmentConfig.GetTabDetails(_currentConsignment, isNew).then(function (response) {
                    DMSConsignmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DMSConsignmentCtrl.ePage.Masters.activeTabIndex = DMSConsignmentCtrl.ePage.Masters.TabList.length;
                        DMSConsignmentCtrl.ePage.Masters.CurrentActiveTab(currentConsignment.entity.ConsignmentNumber);
                        DMSConsignmentCtrl.ePage.Masters.IsTabClick = false;
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
            DMSConsignmentCtrl.ePage.Masters.currentConsignment = currentTab;
        }

            
        function RemoveTab(event, index, currentConsignment) {
            event.preventDefault();
            event.stopPropagation();
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            DMSConsignmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }
            
            
        function CreateNewConsignment() {
            var _isExist = DMSConsignmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                DMSConsignmentCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(DMSConsignmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsConsignmentHeader,
                            data: response.data.Response
                            // Validations:response.data.Response.Validations
                        };
                        DMSConsignmentCtrl.ePage.Masters.AddTab(_obj, true);
                        DMSConsignmentCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Consignment response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }
            
        function SaveandClose(index, currentConsignment){
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            DMSConsignmentCtrl.ePage.Masters.TabList.splice(index-1, 1);
            DMSConsignmentCtrl.ePage.Masters.Config.SaveAndClose = false;
            DMSConsignmentCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();

    }
})();