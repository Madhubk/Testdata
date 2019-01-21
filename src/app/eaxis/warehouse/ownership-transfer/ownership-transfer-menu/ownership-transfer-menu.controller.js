(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OwnershipTransferMenuController", OwnershipTransferMenuController);

    OwnershipTransferMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "ownershipTransferConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr", "$uibModal"];

    function OwnershipTransferMenuController($scope, $timeout, APP_CONSTANT, apiService, ownershipTransferConfig, helperService, appConfig, authService, $state, confirmation, toastr, $uibModal) {

        var OwnershipTransferMenuCtrl = this;

        function Init() {

            var currentOwnerTransfer = OwnershipTransferMenuCtrl.currentOwnerTransfer[OwnershipTransferMenuCtrl.currentOwnerTransfer.label].ePage.Entities;

            OwnershipTransferMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Ownership_Transfer_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOwnerTransfer
            };


            // function
            OwnershipTransferMenuCtrl.ePage.Masters.Finalize = Finalize;

            OwnershipTransferMenuCtrl.ePage.Masters.Validation = Validation;
            OwnershipTransferMenuCtrl.ePage.Masters.Save = Save;
            OwnershipTransferMenuCtrl.ePage.Masters.CancelTransfer = CancelTransfer;
            OwnershipTransferMenuCtrl.ePage.Masters.Config = ownershipTransferConfig;

            if (OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'FIN' || OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'CAN') {
                OwnershipTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                OwnershipTransferMenuCtrl.ePage.Masters.DisableSave = true;
            }
        }

        //Normal save function without Finalise validation, so remove all errors and save
        function Save($item) {
            OwnershipTransferMenuCtrl.ePage.Masters.Finalizesave = false;
            OwnershipTransferMenuCtrl.ePage.Masters.Config.EnableFinaliseValidation = false;

            OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.map(function (value, key) {
                ownershipTransferConfig.RemoveErrorWarning('E11009', "E", 'UIWmsStockTransferLine', $item.label, true, key, '7');
                ownershipTransferConfig.RemoveErrorWarning('E11018', "E", 'UIWmsStockTransferLine', $item.label, true, key, '9');
                ownershipTransferConfig.RemoveErrorWarning('E11019', "E", 'UIWmsStockTransferLine', $item.label, true, key, '10');
                ownershipTransferConfig.RemoveErrorWarning('E11020', "E", 'UIWmsStockTransferLine', $item.label, true, key, '11');
                ownershipTransferConfig.RemoveErrorWarning('E11021', "E", 'UIWmsStockTransferLine', $item.label, true, key, '12');
                ownershipTransferConfig.RemoveErrorWarning('E11022', "E", 'UIWmsStockTransferLine', $item.label, true, key, '13');
            })
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            OwnershipTransferMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (OwnershipTransferMenuCtrl.ePage.Entities.Header.Validations) {
                OwnershipTransferMenuCtrl.ePage.Masters.Config.RemoveApiErrors(OwnershipTransferMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                OwnershipTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OwnershipTransferMenuCtrl.currentOwnerTransfer);
                ValidatingClientAndProduct();
            } else {
                OwnershipTransferMenuCtrl.ePage.Masters.Finalizesave = false;
                OwnershipTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OwnershipTransferMenuCtrl.currentOwnerTransfer);
            }
        }

        function ValidatingClientAndProduct(){
            // Client Validation 
            var TransferClientobj = {};
            OwnershipTransferMenuCtrl.ePage.Masters.DisableText = "Validating Client And Product";
            OwnershipTransferMenuCtrl.ePage.Masters.DisableSave = true;
            OwnershipTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            if (OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_Client) {
                var _filter = {
                    "ORG_FK": OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        TransferClientobj.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        TransferClientobj.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        TransferClientobj.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        TransferClientobj.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        TransferClientobj.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        TransferClientobj.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;

                        if((TransferClientobj.IMPartAttrib1Type == OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib1Type)
                        &&(TransferClientobj.IMPartAttrib2Type == OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib2Type)
                        &&(TransferClientobj.IMPartAttrib3Type == OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.IMPartAttrib3Type)){


                            //#region Validating Product Details
                            if(OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length>0){
                                var count = 0;
                                OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.map(function(value,key){
                                    var _filter1 = {
                                        "ORG_FK": OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.ORG_Client_FK,
                                        "OSP_FK": value.PRO_FK
                                    };
                    
                                    var _input1 = {
                                        "searchInput": helperService.createToArrayOfObject(_filter1),
                                        "FilterID": appConfig.Entities.PrdProductRelatedParty.API.FindAll.FilterID
                                    };
    
                                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductRelatedParty.API.FindAll.Url, _input1).then(function(response){
                                        if(response.data.Response.length>0){
                                            if((value.UseExpiryDate == response.data.Response[0].UseExpiryDate) && (value.UsePackingDate==response.data.Response[0].UsePackingDate) && (value.UsePartAttrib1==response.data.Response[0].UsePartAttrib1)
                                            && (value.UsePartAttrib2==response.data.Response[0].UsePartAttrib2) && (value.UsePartAttrib3==response.data.Response[0].UsePartAttrib3)
                                            && (value.IsPartAttrib1ReleaseCaptured==response.data.Response[0].IsPartAttrib1ReleaseCaptured)  && (value.IsPartAttrib2ReleaseCaptured==response.data.Response[0].IsPartAttrib2ReleaseCaptured)
                                            && (value.IsPartAttrib3ReleaseCaptured==response.data.Response[0].IsPartAttrib3ReleaseCaptured)){
                                                count++;
                                            }else{
                                                OwnershipTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning('E11035', 'Product Configuration is  missing', "E", false, 'UIWmsStockTransferLine', OwnershipTransferMenuCtrl.currentOwnerTransfer.label, true, key, 2, 'Product', undefined, undefined);
                                            }
                                        }else{
                                            OwnershipTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning('E11035', 'Product Configuration is  missing', "E", false, 'UIWmsStockTransferLine', OwnershipTransferMenuCtrl.currentOwnerTransfer.label, true, key, 2, 'Product', undefined, undefined);
                                        }

                                        if(count == OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.length){
                                            Saveonly(OwnershipTransferMenuCtrl.currentOwnerTransfer);
                                        }else{
                                            OwnershipTransferMenuCtrl.ePage.Masters.DisableText = "";
                                            OwnershipTransferMenuCtrl.ePage.Masters.DisableSave = false;
                                            OwnershipTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                        }

                                    });
                                })
                            }
                            else{
                                Saveonly(OwnershipTransferMenuCtrl.currentOwnerTransfer);
                            }
                            //#endregion

                        }else{
                            OwnershipTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning('E11034', 'From and To Client configuation should be same in UDF level', "E", false, 'Client', OwnershipTransferMenuCtrl.currentOwnerTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                            OwnershipTransferMenuCtrl.ePage.Masters.DisableText = "";
                            OwnershipTransferMenuCtrl.ePage.Masters.DisableSave = false;
                            OwnershipTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                        }
                    }
                });
            }
        }

        function Saveonly($item) {
            OwnershipTransferMenuCtrl.ePage.Masters.DisableText = "Saving Your Data";
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
                if (OwnershipTransferMenuCtrl.ePage.Masters.Finalizesave) {
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

                OwnershipTransferMenuCtrl.ePage.Masters.DisableSave = false;
                OwnershipTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                OwnershipTransferMenuCtrl.ePage.Masters.DisableText = "";

                if (response.Status === "success") {

                    ownershipTransferConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID) {
                                value.label = OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID;
                                value[OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = ownershipTransferConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(OwnershipTransferMenuCtrl.currentOwnerTransfer[OwnershipTransferMenuCtrl.currentOwnerTransfer.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        ownershipTransferConfig.TabList[_index][ownershipTransferConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        ownershipTransferConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/ownership-transfer") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");

                    OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG = OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_Code + ' - ' + OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.TransferFrom_ORG_FullName;
                    if (OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'CAN') {
                        toastr.success("Cancelled Successfully...!");
                    } else {
                        toastr.success("Saved Successfully...!");
                    }

                    if (OwnershipTransferMenuCtrl.ePage.Masters.SaveAndClose) {
                        OwnershipTransferMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        OwnershipTransferMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (OwnershipTransferMenuCtrl.ePage.Masters.Finalizesave || OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus == 'CAN') {
                        OwnershipTransferMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        OwnershipTransferMenuCtrl.ePage.Masters.DisableSave = true;
                    }

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    OwnershipTransferMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        if (value.RowIndex > 0) {
                            OwnershipTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OwnershipTransferMenuCtrl.currentOwnerTransfer.label, true, value.RowIndex - 1, value.ColIndex, undefined, undefined, undefined);
                        } else {
                            OwnershipTransferMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OwnershipTransferMenuCtrl.currentOwnerTransfer.label, false, undefined, undefined, undefined, undefined, undefined);
                        }
                    });
                    if (OwnershipTransferMenuCtrl.ePage.Entities.Header.Validations != null) {
                        OwnershipTransferMenuCtrl.ePage.Masters.Finalizesave = false;
                        OwnershipTransferMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OwnershipTransferMenuCtrl.currentOwnerTransfer);
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
                                toastr.info("Please Save Before Finalizing Ownership Transfer");
                            } else {
                                OwnershipTransferMenuCtrl.ePage.Masters.Finalizesave = true;
                                OwnershipTransferMenuCtrl.ePage.Masters.Config.EnableFinaliseValidation = true;
                                Validation($item);
                            }

                        } else {
                            toastr.info("Ownership Transfer cannot be finalized without Stock Transfer Line");
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
                            "EntityRefKey": OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.PK,
                            "EntityRefCode": OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderID,
                            "CommentsType": "GEN"
                        }
                        InsertCommentObject.push(obj);
                        apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {

                            OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferLine.map(function (value, key) {
                                value.TotalUnits = 0;
                            });
                            OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.CancelledDate = new Date();
                            OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatus = 'CAN';
                            OwnershipTransferMenuCtrl.ePage.Entities.Header.Data.UIWmsStockTransferHeader.WorkOrderStatusDesc = 'Cancelled';
                            Validation($item);

                            $uibModalInstance.dismiss('cancel');
                        });
                    }
                }
            });
        }


        Init();

    }

})();