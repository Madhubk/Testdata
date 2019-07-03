(function(){
    "use strict";

    angular
         .module("Application")
         .controller("ServiceRequestListController",ServiceRequestListController);

    ServiceRequestListController.$inject = [ "helperService", "serviceRequestListConfig", "$timeout", "toastr"];

    function ServiceRequestListController( helperService, serviceRequestListConfig, $timeout, toastr){

        var ServiceRequestListCtrl = this;
        
        function Init() {
            
            ServiceRequestListCtrl.ePage = {
                "Title": "",
                "Prefix": "ServiceRequestList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": serviceRequestListConfig.Entities
            };
            
            ServiceRequestListCtrl.ePage.Masters.dataentryName = "ServiceRequest";
            ServiceRequestListCtrl.ePage.Masters.taskName = "ServiceRequest";
            ServiceRequestListCtrl.ePage.Masters.TabList = [];
            serviceRequestListConfig.TabList = [];
            ServiceRequestListCtrl.ePage.Masters.activeTabIndex = 0;
            ServiceRequestListCtrl.ePage.Masters.isNewClicked = false;
            ServiceRequestListCtrl.ePage.Masters.IsTabClick = false;

            //functions
            ServiceRequestListCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ServiceRequestListCtrl.ePage.Masters.AddTab = AddTab;
            ServiceRequestListCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ServiceRequestListCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ServiceRequestListCtrl.ePage.Masters.CreateNewServiceRequestList = CreateNewServiceRequestList;
            ServiceRequestListCtrl.ePage.Masters.Config = serviceRequestListConfig;
            

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                ServiceRequestListCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewServiceRequestList();
            }
        }
            
        function AddTab(currentServiceRequestList, isNew) {
            ServiceRequestListCtrl.ePage.Masters.currentServiceRequestList = undefined;

            var _isExist = ServiceRequestListCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentServiceRequestList.entity.RequestNo)
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
                ServiceRequestListCtrl.ePage.Masters.IsTabClick = true;
                var _currentServiceRequestList = undefined;
                if (!isNew) {
                    _currentServiceRequestList = currentServiceRequestList.entity;
                } else {
                    _currentServiceRequestList = currentServiceRequestList;
                }

                serviceRequestListConfig.GetTabDetails(_currentServiceRequestList, isNew).then(function (response) {
                    ServiceRequestListCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ServiceRequestListCtrl.ePage.Masters.activeTabIndex = ServiceRequestListCtrl.ePage.Masters.TabList.length;
                        ServiceRequestListCtrl.ePage.Masters.CurrentActiveTab(currentServiceRequestList.entity.RequestNo);
                        ServiceRequestListCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('My Request already opened ');
            }
        }
            
        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            ServiceRequestListCtrl.ePage.Masters.currentServiceRequestList = currentTab;
        }

            
        function RemoveTab(event, index, currentServiceRequestList) {
            event.preventDefault();
            event.stopPropagation();
            var currentServiceRequestList = currentServiceRequestList[currentServiceRequestList.label].ePage.Entities;
            ServiceRequestListCtrl.ePage.Masters.TabList.splice(index, 1);
        }
            
            
        function CreateNewServiceRequestList() {
            
            location.href = '#/EA/SRQ/downtime-request-general';

            // var _isExist = ServiceRequestListCtrl.ePage.Masters.TabList.some(function (value) {
            //     if (value.label === "New")
            //         return true;
            //     else
            //         return false;
            // });
            // if(!_isExist){
            //     ServiceRequestListCtrl.ePage.Masters.isNewClicked = true;
            //     helperService.getFullObjectUsingGetById(ServiceRequestListCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
            //         if (response.data.Response) {
            //             var _obj = {
            //                 entity: response.data.Response.Response.UIServiceRequestListHeader,
            //                 data: response.data.Response.Response,
            //                 Validations:response.data.Response.Validations
            //             };
            //             ServiceRequestListCtrl.ePage.Masters.AddTab(_obj, true);
            //             ServiceRequestListCtrl.ePage.Masters.isNewClicked = false;
            //         } else {
            //             console.log("Empty New My Request response");
            //         }
            //     });
            // }else{
            //     toastr.info("New Record Already Opened...!");
            // }
        }                  

        Init();

    }
})();