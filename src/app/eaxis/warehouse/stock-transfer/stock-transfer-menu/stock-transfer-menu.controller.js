(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StockTransferMenuController", StockTransferMenuController);

    StockTransferMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "stocktransferConfig", "helperService", "appConfig", "authService", "$state","confirmation","toastr"];

    function StockTransferMenuController($scope, $timeout, APP_CONSTANT, apiService, stocktransferConfig, helperService, appConfig, authService, $state, confirmation,toastr) {

        var StockTransferMenuCtrl = this;

        function Init() {

            var currentStockTransfer = StockTransferMenuCtrl.currentStockTransfer[StockTransferMenuCtrl.currentStockTransfer.label].ePage.Entities;

            StockTransferMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "StockTransfer_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentStockTransfer
            };

            // Standard Menu Configuration and Data
            StockTransferMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseStockTransfer;
            StockTransferMenuCtrl.ePage.Masters.StandardMenuInput.obj = StockTransferMenuCtrl.currentStockTransfer;
            // function
            StockTransferMenuCtrl.ePage.Masters.FinaliseSave = FinaliseSave;
            StockTransferMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            StockTransferMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalise";

            StockTransferMenuCtrl.ePage.Masters.Validation = Validation;
            StockTransferMenuCtrl.ePage.Masters.Config = stocktransferConfig;

            if(StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'FIN'){
                StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
            }
        }
        
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            StockTransferMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (StockTransferMenuCtrl.ePage.Entities.Header.Validations) {
                StockTransferMenuCtrl.ePage.Masters.Config.RemoveApiErrors(StockTransferMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                StockTransferMenuCtrl.ePage.Masters.Config.EnableFinaliseValidation=false;
                Saveonly($item);
            } else {
                StockTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(StockTransferMenuCtrl.currentStockTransfer);
            }
        }

        function Saveonly($item) {

            StockTransferMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsStockTransferHeader.PK = _input.PK;
                _input.UIWmsStockTransferHeader.CreatedDateTime = new Date();
                _input.UIWmsStockTransferHeader.WorkOrderType = 'TFR';
                _input.UIWmsStockTransferHeader.WorkOrderStatus = 'ENT';
                _input.UIWmsStockTransferHeader.WorkOrderStatusDesc = 'Entered';
                _input.UIWmsStockTransferHeader.ExternalReference = _input.UIWmsStockTransferHeader.WorkOrderID;
            } else {
                if (StockTransferMenuCtrl.ePage.Masters.Finalisesave) {
                    _input.UIWmsStockTransferHeader.FinalisedDate = new Date();
                    _input.UIWmsStockTransferHeader.WorkOrderStatus = 'FIN';
                    _input.UIWmsStockTransferHeader.WorkOrderStatusDesc = 'Finalised';
                    angular.forEach(_input.UIWmsStockTransferLine,function(value,key){
                        value.WorkOrderLineStatus = 'FIN';
                        value.WorkOrderLineStatusDesc='Finalized';
                    });
                }
                $item = filterObjectUpdate($item, "IsModified");
            }


            helperService.SaveEntity($item, 'StockTransfer').then(function (response) {
                if (response.Status === "success") {

                    stocktransferConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID) {
                                value.label = StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID;
                                value[StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = stocktransferConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(StockTransferMenuCtrl.currentStockTransfer[StockTransferMenuCtrl.currentStockTransfer.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        stocktransferConfig.TabList[_index][stocktransferConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        stocktransferConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/stock-transfer") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if(StockTransferMenuCtrl.ePage.Masters.SaveAndClose){
                        StockTransferMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        StockTransferMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (StockTransferMenuCtrl.ePage.Masters.Finalisesave) {
                        StockTransferMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                        StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                        StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
                    } else {
                        StockTransferMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                        StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    }
                    StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.Receiveline = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    StockTransferMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    StockTransferMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    StockTransferMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        StockTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, StockTransferMenuCtrl.currentStockTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (StockTransferMenuCtrl.ePage.Entities.Header.Validations != null) {
                        StockTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(StockTransferMenuCtrl.currentStockTransfer);
                    }
                }
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

        function FinaliseSave($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            {
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'YES',
                    headerText: 'Once Finalized Data Can Not Be Edited..',
                    bodyText: 'Do You Want To Finalize?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        if(_input.UIWmsStockTransferLine.length==0){
                            toastr.info("Stock Transfer cannot be finalized without Stock Transfer Line");
                        }else{
                            StockTransferMenuCtrl.ePage.Masters.Finalisesave = true;
                            StockTransferMenuCtrl.ePage.Masters.Config.EnableFinaliseValidation=true;
                            Validation($item);
                        }
                    }, function () {
                        console.log("Cancelled");
                    });
            }
        }


        Init();

    }

})();