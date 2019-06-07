(function(){
    "use strict";

    angular
         .module("Application")
         .controller("DowntimeRequestController",DowntimeRequestController);

    DowntimeRequestController.$inject = [ "helperService", "downtimeRequestConfig", "$timeout", "toastr"];

    function DowntimeRequestController( helperService, downtimeRequestConfig, $timeout, toastr){

        var DowntimeRequestCtrl = this;
        function Init() {
            
            DowntimeRequestCtrl.ePage = {
                "Title": "",
                "Prefix": "DowntimeRequest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": downtimeRequestConfig.Entities
            };

            DowntimeRequestCtrl.ePage.Masters.dataentryName = "DowntimeRequest";
            DowntimeRequestCtrl.ePage.Masters.taskName = "DowntimeRequest";
            // DowntimeRequestCtrl.ePage.Masters.dataentryName = "ServiceRequest";
            // DowntimeRequestCtrl.ePage.Masters.taskName = "ServiceRequest";
            DowntimeRequestCtrl.ePage.Masters.TabList = [];
            downtimeRequestConfig.TabList = [];
            DowntimeRequestCtrl.ePage.Masters.activeTabIndex = 0;
            DowntimeRequestCtrl.ePage.Masters.isNewClicked = false;
            DowntimeRequestCtrl.ePage.Masters.IsTabClick = false;

            //functions
            DowntimeRequestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DowntimeRequestCtrl.ePage.Masters.AddTab = AddTab;
            DowntimeRequestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DowntimeRequestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DowntimeRequestCtrl.ePage.Masters.CreateNewDowntimeRequest = CreateNewDowntimeRequest;
            DowntimeRequestCtrl.ePage.Masters.Config = downtimeRequestConfig;
            

        }

        function SelectedGridRow($item) {   
            if ($item.action === "link" || $item.action === "dblClick") {
                DowntimeRequestCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewDowntimeRequest();
            }
        }
            
        function AddTab(currentDowntimeRequest, isNew) {
            DowntimeRequestCtrl.ePage.Masters.currentDowntimeRequest = undefined;

            var _isExist = DowntimeRequestCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentDowntimeRequest.entity.WorkOrderID)
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
                DowntimeRequestCtrl.ePage.Masters.IsTabClick = true;
                var _currentDowntimeRequest = undefined;
                if (!isNew) {
                    _currentDowntimeRequest = currentDowntimeRequest.entity;
                } else {
                    _currentDowntimeRequest = currentDowntimeRequest;
                }

                downtimeRequestConfig.GetTabDetails(_currentDowntimeRequest, isNew).then(function (response) {
                    DowntimeRequestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DowntimeRequestCtrl.ePage.Masters.activeTabIndex = DowntimeRequestCtrl.ePage.Masters.TabList.length;
                        DowntimeRequestCtrl.ePage.Masters.CurrentActiveTab(currentDowntimeRequest.entity.WorkOrderID);
                        DowntimeRequestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Downtime Request already opened ');
            }
        }
            
        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            DowntimeRequestCtrl.ePage.Masters.currentDowntimeRequest = currentTab;
        }

            
        function RemoveTab(event, index, currentDowntimeRequest) {
            event.preventDefault();
            event.stopPropagation();
            var currentDowntimeRequest = currentDowntimeRequest[currentDowntimeRequest.label].ePage.Entities;
            DowntimeRequestCtrl.ePage.Masters.TabList.splice(index, 1);
        }
            
            
        function CreateNewDowntimeRequest() {
            var _isExist = DowntimeRequestCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                DowntimeRequestCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(DowntimeRequestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIDowntimeRequestHeader,
                            data: response.data.Response.Response,
                            Validations:response.data.Response.Validations
                        };
                        DowntimeRequestCtrl.ePage.Masters.AddTab(_obj, true);
                        DowntimeRequestCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Downtime Request response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }
            
      

        Init();

    }
})();