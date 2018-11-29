(function(){
    "use strict";

    angular
         .module("Application")
         .controller("ProcessController",ProcessController);

    ProcessController.$inject = ["$scope","$location", "APP_CONSTANT", "authService", "apiService", "helperService","batchUploadProcessConfig","$timeout","toastr","appConfig","$stateParams"];

    function ProcessController($scope,$location, APP_CONSTANT, authService, apiService, helperService,batchUploadProcessConfig, $timeout,toastr,appConfig,$stateParams){

        var ProcessCtrl = this;
        
        function Init(){

            ProcessCtrl.ePage={
                "Title": "",
                "Prefix": "Process",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": batchUploadProcessConfig.Entities
            };

            //Variables
            ProcessCtrl.ePage.Masters.taskName = "JobDocumentDetails";
            ProcessCtrl.ePage.Masters.dataentryName = "JobDocumentDetails";
            ProcessCtrl.ePage.Masters.TabList = []; 
            batchUploadProcessConfig.TabList = [];
            ProcessCtrl.ePage.Masters.activeTabIndex = 0;
            ProcessCtrl.ePage.Masters.IsTabClick = false;
            ProcessCtrl.ePage.Masters.Config = batchUploadProcessConfig;
            ProcessCtrl.ePage.Masters.DefaultFilter = {
                "EntitySource":"WMS",
                "AdditionalEntityRefCode":$stateParams.modulename
            }

            

             //functions
             ProcessCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
             ProcessCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
             ProcessCtrl.ePage.Masters.RemoveTab = RemoveTab;
             ProcessCtrl.ePage.Masters.AddTab = AddTab;
 
    }

  

    function SelectedGridRow($item) { 
        
        if ($item.action === "link" || $item.action === "dblClick") {
            ProcessCtrl.ePage.Masters.AddTab($item.data, false);
        }
    }

    function AddTab(currentProcess, isNew) { 
        ProcessCtrl.ePage.Masters.currentProcess = undefined;

        var _isExist = ProcessCtrl.ePage.Masters.TabList.some(function (value) {
            if (!isNew) {
                if (value.label === currentProcess.entity.EntityRefCode)
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
            ProcessCtrl.ePage.Masters.IsTabClick = true;
            var _currentProcess = undefined;
            if (!isNew) {
                _currentProcess = currentProcess.entity;
            } else {
                _currentProcess = currentProcess;
            }

            batchUploadProcessConfig.GetTabDetails(_currentProcess, isNew).then(function (response) {
                ProcessCtrl.ePage.Masters.TabList = response;
                $timeout(function () {
                    ProcessCtrl.ePage.Masters.activeTabIndex = ProcessCtrl.ePage.Masters.TabList.length;
                    ProcessCtrl.ePage.Masters.CurrentActiveTab(currentProcess.entity.EntityRefCode);
                    ProcessCtrl.ePage.Masters.IsTabClick = false;
                });
            });
        } else {
            toastr.info('Process already opened ');
        }
    }

    function CurrentActiveTab(currentTab) {
         if (currentTab.label != undefined) {
             currentTab = currentTab.label.entity;
         } else {
             currentTab = currentTab;
         }
         ProcessCtrl.ePage.Masters.currentProcess = currentTab;
     }

     function RemoveTab(event, index, currentProcess) {
        event.preventDefault();
        event.stopPropagation();
        var currentProcess = currentProcess[currentProcess.label].ePage.Entities;
        ProcessCtrl.ePage.Masters.TabList.splice(index, 1);
    }
   
    Init();
 }

})();