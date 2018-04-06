(function(){
    "use strict";

    angular
         .module("Application")
         .controller("AdjustmentMenuController",AdjustmentMenuController);

    AdjustmentMenuController.$inject=["$scope", "$timeout", "APP_CONSTANT", "apiService", "adjustmentConfig", "helperService","appConfig","authService","$location","$state","toastr","confirmation"];

    function AdjustmentMenuController($scope, $timeout, APP_CONSTANT, apiService, adjustmentConfig, helperService,appConfig,authService,$location,$state,toastr,confirmation){

        var AdjustmentMenuCtrl = this

        function Init(){

            var currentAdjustment = AdjustmentMenuCtrl.currentAdjustment[AdjustmentMenuCtrl.currentAdjustment.label].ePage.Entities;
            console.log(currentAdjustment);

            AdjustmentMenuCtrl.ePage={
                "Title": "",
                "Prefix": "Adjustment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAdjustment

            };

            AdjustmentMenuCtrl.ePage.Masters.AdjustmentMenu = {};
            // Menu list from configuration
            AdjustmentMenuCtrl.ePage.Masters.AdjustmentMenu.ListSource = AdjustmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            AdjustmentMenuCtrl.ePage.Masters.Validation = Validation;
            AdjustmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            AdjustmentMenuCtrl.ePage.Masters.Config = adjustmentConfig;
            AdjustmentMenuCtrl.ePage.Masters.Finalize = Finalize;      
            AdjustmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            AdjustmentMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalise";  

             // Standard Menu Configuration and Data
            AdjustmentMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseAdjustments;
            AdjustmentMenuCtrl.ePage.Masters.StandardMenuInput.obj = AdjustmentMenuCtrl.currentAdjustment;
          
            if(AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderStatus == 'FIN'){
                AdjustmentMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
            }
        }
        
        function Finalize($item)
        {
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data,
            _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            
            
            if(_errorcount.length==0){
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'YES',
                    headerText: 'Once Finalised Data Can Not Be Edited..',
                    bodyText: 'Do You Want To Finalise?'
                };
                confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if(_input.UIWmsWorkOrderLine.length==0){
                        toastr.info("Adjustment Cannot be finalized without Adjustment Line")
                    }else{
                        AdjustmentMenuCtrl.ePage.Masters.Finalisesave = true; 
                        Validation($item);
                    }
                }, function () {
                    console.log("Cancelled");
                });
            }else{
                AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);                    
            }

        }
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data,
            _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            
            //Validation Call
            AdjustmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if(AdjustmentMenuCtrl.ePage.Entities.Header.Validations){
                AdjustmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(AdjustmentMenuCtrl.ePage.Entities.Header.Validations,$item.label); 
            }

            if(_errorcount.length==0){
                Save($item);
            }else{
                AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);                    
            }
        }
           
        function Save($item){

            AdjustmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            AdjustmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
             _input = _Data.Header.Data;    
             //_input.UIAdjustmentHeader.PK = _input.PK;
            _input.UIAdjustmentHeader.ExternalReference = AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;
            if ($item.isNew) {
                _input.UIAdjustmentHeader.PK = _input.PK;
                _input.UIAdjustmentHeader.CreatedDateTime = new Date();
                _input.UIAdjustmentHeader.WorkOrderStatus = 'ENT';
                _input.UIAdjustmentHeader.WorkOrderStatusDesc = 'Entered';
                _input.UIAdjustmentHeader.WorkOrderType = 'ADJ';

            } else {
                if(AdjustmentMenuCtrl.ePage.Masters.Finalisesave){
                    _input.UIAdjustmentHeader.FinalisedDate = new Date();
                    _input.UIAdjustmentHeader.WorkOrderStatus = 'FIN';
                    _input.UIAdjustmentHeader.WorkOrderStatusDesc = 'Finalised';

                    // Line Status
                angular.forEach(_input.UIWmsWorkOrderLine,function(value,key){
                    value.WorkOrderLineStatus = 'FIN';
                    value.WorkOrderLineStatusDesc = 'Finalised';
                });
                }
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Adjustment').then(function (response) {
                if (response.Status === "success") {

                    adjustmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID) {
                                value.label = AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;
                                value[AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    
                    var _index = adjustmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(AdjustmentMenuCtrl.currentAdjustment[AdjustmentMenuCtrl.currentAdjustment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        adjustmentConfig.TabList[_index][adjustmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        adjustmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/adjustment") {
                            helperService.refreshGrid();
                        }
                    } 
                    console.log("Success");
                    if(AdjustmentMenuCtrl.ePage.Masters.SaveAndClose){
                        AdjustmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        AdjustmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (AdjustmentMenuCtrl.ePage.Masters.Finalisesave) {
                        AdjustmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                        AdjustmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                        AdjustmentMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
                    } else {
                        AdjustmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                        AdjustmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    }
                } else if (response.Status === "failed") {

                    console.log("Failed");
                    angular.forEach(response.Validations, function (value, key) {
                        AdjustmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentMenuCtrl.currentAdjustment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    angular.forEach(response.Messages, function (value, key) {
                        if(value.Type == "NotUpdated"){
                            toastr.error(value.MessageDesc);
                        }
                    });
                    if (AdjustmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);
                    }
                }
                

                AdjustmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                AdjustmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;                
            });

        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();

    }

})();