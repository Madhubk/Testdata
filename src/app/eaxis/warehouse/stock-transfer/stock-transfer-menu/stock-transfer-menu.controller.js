(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StockTransferMenuController", StockTransferMenuController);

    StockTransferMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "stocktransferConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr", "$uibModal","$filter"];

    function StockTransferMenuController($scope, $timeout, APP_CONSTANT, apiService, stocktransferConfig, helperService, appConfig, authService, $state, confirmation, toastr, $uibModal,$filter) {

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


            // function
            StockTransferMenuCtrl.ePage.Masters.Finalize = Finalize;

            StockTransferMenuCtrl.ePage.Masters.Validation = Validation;
            StockTransferMenuCtrl.ePage.Masters.Save = Save;
            StockTransferMenuCtrl.ePage.Masters.GenerateDocuments = GenerateDocuments;
            StockTransferMenuCtrl.ePage.Masters.CancelTransfer = CancelTransfer;
            StockTransferMenuCtrl.ePage.Masters.Config = stocktransferConfig;

            if (StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'FIN' || StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'CAN') {
                StockTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                StockTransferMenuCtrl.ePage.Masters.DisableSave = true;
            }

            DonwloadDocument()
        }

        //Normal save function without Finalise validation, so remove all errors and save
        function Save($item) {
            StockTransferMenuCtrl.ePage.Masters.Finalizesave = false;
            StockTransferMenuCtrl.ePage.Masters.Config.EnableFinaliseValidation = false;

            StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.map(function (value, key) {
                stocktransferConfig.RemoveErrorWarning('E11009', "E", 'UIWmsStockTransferLine', $item.label, true, key, '7');
                stocktransferConfig.RemoveErrorWarning('E11018', "E", 'UIWmsStockTransferLine', $item.label, true, key, '9');
                stocktransferConfig.RemoveErrorWarning('E11019', "E", 'UIWmsStockTransferLine', $item.label, true, key, '10');
                stocktransferConfig.RemoveErrorWarning('E11020', "E", 'UIWmsStockTransferLine', $item.label, true, key, '11');
                stocktransferConfig.RemoveErrorWarning('E11021', "E", 'UIWmsStockTransferLine', $item.label, true, key, '12');
                stocktransferConfig.RemoveErrorWarning('E11022', "E", 'UIWmsStockTransferLine', $item.label, true, key, '13');

            })

            Validation($item);
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
                StockTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(StockTransferMenuCtrl.currentStockTransfer);
                Saveonly($item);
            } else {
                StockTransferMenuCtrl.ePage.Masters.Finalizesave = false;
                StockTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(StockTransferMenuCtrl.currentStockTransfer);
            }
        }

        function Saveonly($item) {

            StockTransferMenuCtrl.ePage.Masters.DisableSave = true;
            StockTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

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
                if (StockTransferMenuCtrl.ePage.Masters.Finalizesave) {
                    _input.UIWmsStockTransferHeader.FinalisedDate = new Date();
                    _input.UIWmsStockTransferHeader.WorkOrderStatus = 'FIN';
                    _input.UIWmsStockTransferHeader.WorkOrderStatusDesc = 'Finalized';
                    angular.forEach(_input.UIWmsStockTransferLine, function (value, key) {
                        value.WorkOrderLineStatus = 'FIN';
                        value.WorkOrderLineStatusDesc = 'Finalized';
                    });
                }
                $item = filterObjectUpdate($item, "IsModified");
            }


            helperService.SaveEntity($item, 'StockTransfer').then(function (response) {

                StockTransferMenuCtrl.ePage.Masters.DisableSave = false;
                StockTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

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


                    if (StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'CAN') {
                        toastr.success("Cancelled Successfully...!");
                    } else {
                        toastr.success("Saved Successfully...!");
                    }

                    if (StockTransferMenuCtrl.ePage.Masters.SaveAndClose) {
                        StockTransferMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        StockTransferMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (StockTransferMenuCtrl.ePage.Masters.Finalizesave || StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'CAN') {
                        StockTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        StockTransferMenuCtrl.ePage.Masters.DisableSave = true;
                    }

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    StockTransferMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        if (value.RowIndex > 0) {
                            StockTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, StockTransferMenuCtrl.currentStockTransfer.label, true, value.RowIndex - 1, value.ColIndex, undefined, undefined, undefined);
                        } else {
                            StockTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, StockTransferMenuCtrl.currentStockTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                        }
                    });
                    if (StockTransferMenuCtrl.ePage.Entities.Header.Validations != null) {
                        StockTransferMenuCtrl.ePage.Masters.Finalizesave = false;
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

        function Finalize($item) {
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
                        if (_input.UIWmsStockTransferLine.length > 0) {
                            var mydata = _input.UIWmsStockTransferLine.some(function (value, key) {
                                if (!value.PK)
                                    return true;
                            })
                            if (mydata) {
                                toastr.info("Please Save Before Finalizing Stock Transfer");
                            } else {
                                StockTransferMenuCtrl.ePage.Masters.Finalizesave = true;
                                StockTransferMenuCtrl.ePage.Masters.Config.EnableFinaliseValidation = true;
                                Validation($item);
                            }

                        } else {
                            toastr.info("Stock Transfer cannot be finalized without Stock Transfer Line");
                        }
                    }, function () {
                        console.log("Cancelled");
                    });
            }
        }

        function CancelTransfer($item) {
            $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $uibModalInstance) {

                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ok = function () {
                        var InsertCommentObject = [];
                        var obj = {
                            "Description": "General",
                            "Comments": $scope.comment,
                            "EntityRefKey": StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.PK,
                            "EntityRefCode": StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID,
                            "CommentsType": "GEN"
                        }
                        InsertCommentObject.push(obj);
                        apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {

                            StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.map(function (value, key) {
                                value.TotalUnits = 0;
                            });
                            StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.CancelledDate = new Date();
                            StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus = 'CAN';
                            StockTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatusDesc = 'Cancelled';
                            Validation($item);

                            $uibModalInstance.dismiss('cancel');
                        });
                    }
                }
            });
        }

        function DonwloadDocument(){
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "ADJ"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                StockTransferMenuCtrl.ePage.Masters.AllDocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                StockTransferMenuCtrl.ePage.Masters.AllDocumentValues.map(function(value,key){
                    value.OtherConfig = JSON.parse(value.OtherConfig);
                });
            });
        }

        function GenerateDocuments(item, format) {
            StockTransferMenuCtrl.ePage.Masters.DisableReport = true;

            var obj = item.OtherConfig.ReportTemplate;

            obj.JobDocs.EntityRefKey = item.Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = item.Description;
            obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + StockTransferMenuCtrl.ePage.Entities.Header.Data.PK;

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                if(response.data.Response.Status=='Success'){
                 apiService.get("eAxisAPI", appConfig.Entities.Communication.API.JobDocument.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                     if (response.data.Response) {
                         if (response.data.Response !== "No Records Found!") {
                             helperService.DownloadDocument(response.data.Response);
                             StockTransferMenuCtrl.ePage.Masters.DisableReport = false;
                         }
                     } else {
                         console.log("Invalid response");
                     }
                 })
                }
             })
        }

        Init();

    }

})();