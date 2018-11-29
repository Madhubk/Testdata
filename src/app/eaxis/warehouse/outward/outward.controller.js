(function(){
    "use strict";

    angular
         .module("Application")
         .controller("OutwardController",OutwardController);

    OutwardController.$inject = ["$scope","$location", "APP_CONSTANT", "authService", "apiService", "helperService","outwardConfig","$timeout","toastr","appConfig","$uibModal"];

    function OutwardController($scope,$location, APP_CONSTANT, authService, apiService, helperService,outwardConfig, $timeout,toastr,appConfig,$uibModal){

        var OutwardCtrl = this;
        
        function Init(){

            OutwardCtrl.ePage={
                "Title": "",
                "Prefix": "Outward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": outwardConfig.Entities
            };

            //Variables
            OutwardCtrl.ePage.Masters.taskName = "WarehouseOutward";
            OutwardCtrl.ePage.Masters.dataentryName = "WarehouseOutward";
            OutwardCtrl.ePage.Masters.TabList = []; 
            outwardConfig.TabList = [];
            OutwardCtrl.ePage.Masters.activeTabIndex = 0;
            OutwardCtrl.ePage.Masters.isNewClicked = false;
            OutwardCtrl.ePage.Masters.IsTabClick = false;
            OutwardCtrl.ePage.Masters.Config = outwardConfig;

            outwardConfig.ValidationFindall();
            

             //functions
             OutwardCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
             OutwardCtrl.ePage.Masters.AddTab = AddTab;
             OutwardCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
             OutwardCtrl.ePage.Masters.RemoveTab = RemoveTab;
             OutwardCtrl.ePage.Masters.CreateNewOutward = CreateNewOutward;
             OutwardCtrl.ePage.Masters.SaveandClose = SaveandClose;
             OutwardCtrl.ePage.Masters.BulkUploadOption = BulkUploadOption;
 
             GetNewOutward();
    }

    function GetNewOutward(){
        if(OutwardCtrl.ePage.Entities.Header.Message == true){
            CreateNewOutward();
        }
    }

    function SelectedGridRow($item) { 
        
        if ($item.action === "link" || $item.action === "dblClick") {
            OutwardCtrl.ePage.Masters.AddTab($item.data, false);
        }else if ($item.action === "new") {
            CreateNewOutward();
        }
    }

    function AddTab(currentOutward, isNew) { 
        OutwardCtrl.ePage.Masters.currentOutward = undefined;

        var _isExist = OutwardCtrl.ePage.Masters.TabList.some(function (value) {
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
            OutwardCtrl.ePage.Masters.IsTabClick = true;
            var _currentOutward = undefined;
            if (!isNew) {
                _currentOutward = currentOutward.entity;
            } else {
                _currentOutward = currentOutward;
            }

            outwardConfig.GetTabDetails(_currentOutward, isNew).then(function (response) {
                OutwardCtrl.ePage.Masters.TabList = response;
                $timeout(function () {
                    OutwardCtrl.ePage.Masters.activeTabIndex = OutwardCtrl.ePage.Masters.TabList.length;
                    OutwardCtrl.ePage.Masters.CurrentActiveTab(currentOutward.entity.WorkOrderID);
                    OutwardCtrl.ePage.Masters.IsTabClick = false;
                });
            });
        } else {
            toastr.info('Outward already opened ');
        }
    }

    function CurrentActiveTab(currentTab) {
         if (currentTab.label != undefined) {
             currentTab = currentTab.label.entity;
         } else {
             currentTab = currentTab;
         }
         OutwardCtrl.ePage.Masters.currentOutward = currentTab;
     }

     function RemoveTab(event, index, currentOutward) {
        event.preventDefault();
        event.stopPropagation();
        var currentOutward = currentOutward[currentOutward.label].ePage.Entities;
        OutwardCtrl.ePage.Masters.TabList.splice(index, 1);

        apiService.get("eAxisAPI", OutwardCtrl.ePage.Entities.Header.API.SessionClose.Url + currentOutward.Header.Data.PK).then(function(response){
            if (response.data.Response === "Success") {
            } else {
                console.log("Tab close Error : " + response);
            }
        });
    }

     
        function CreateNewOutward() {
            var _isExist = OutwardCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                OutwardCtrl.ePage.Entities.Header.Message = false;
                OutwardCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(OutwardCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsOutwardHeader,
                            data: response.data.Response.Response,
                            Validations:response.data.Response.Validations
                        };
                        OutwardCtrl.ePage.Masters.AddTab(_obj, true);
                        OutwardCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Outward response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }

      
        function SaveandClose(index, currentOutward){
            var currentOutward = currentOutward[currentOutward.label].ePage.Entities;
            OutwardCtrl.ePage.Masters.TabList.splice(index-1, 1);
            OutwardCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", OutwardCtrl.ePage.Entities.Header.API.SessionClose.Url + currentOutward.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            OutwardCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function BulkUploadOption(){
            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right bulkuploadoutward",
                scope: $scope,

                templateUrl: 'app/eaxis/warehouse/outward/outward-batch-upload/outward-batch-upload.html',
                controller: 'OutwardBatchUploadController as OutwardBatchUploadCtrl',
                bindToController: true,
            });
        }
        
    Init();
 }

})();