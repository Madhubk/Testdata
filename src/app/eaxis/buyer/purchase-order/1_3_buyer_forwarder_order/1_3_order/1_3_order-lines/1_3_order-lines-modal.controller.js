(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrderLinesFormModalController", one_three_OrderLinesFormModalController);

    one_three_OrderLinesFormModalController.$inject = ["$uibModalInstance", "$timeout", "apiService", "helperService", "toastr", "param", "confirmation", "orderApiConfig", "errorWarningService"];

    function one_three_OrderLinesFormModalController($uibModalInstance, $timeout, apiService, helperService, toastr, param, confirmation, orderApiConfig, errorWarningService) {
        var one_three_OrderLinesFormModalCtrl = this;

        function Init() {
            one_three_OrderLinesFormModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Lines_modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitOrderLineModal();
        }

        function InitOrderLineModal() {
            one_three_OrderLinesFormModalCtrl.ePage.Masters.param = param;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(param.Data);
            one_three_OrderLinesFormModalCtrl.ePage.Masters.Save = Save;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveClose = SaveClose;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.Cancel = Cancel;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
            one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
            one_three_OrderLinesFormModalCtrl.ePage.Masters.Text = "OrderLine";

            if (param.Action !== 'edit') {
                one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder = param.Data;
                one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_ForwarderCopy = angular.copy(param.Data);
                one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.InnerPacks = 0;
                one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.OuterPacks = 0;
                one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.ReqExWorksDate = "";
                one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.LineDropDate = "";
            } else {
                GetByIdLines();
            }
            ValidationCall();
        }

        function ValidationCall() {
            // validation findall call
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [one_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "BUYER_FORWARDER_ORD_LINE"
                },
                // GroupCode: "ORD_TRAN",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: []
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            one_three_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.OrderLine.Entity[one_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo].GlobalErrorWarningList;
            one_three_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.OrderLine.Entity[one_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo];
        }

        function GetByIdLines() {
            apiService.get("eAxisAPI", orderApiConfig.Entities.OrderLine_Buyer_Forwarder.API.getbyid.Url + param.Data.PK).then(function (response) {
                if (response.data.Response) {
                    one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_ForwarderCopy = angular.copy(response.data.Response);
                    one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder = response.data.Response;
                }
            });
        }

        function Save() {
            var _isEmpty = angular.equals(one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder, {});
            one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[one_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (one_three_OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.IsModified = true;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.UICustomEntity.IsModified = true;
                            apiService.post("eAxisAPI", orderApiConfig.Entities.OrderLine_Buyer_Forwarder.API.upsert.Url, [one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder]).then(function (responses) {
                                if (responses.data.Response) {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List[one_three_OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_ForwarderCopy = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                } else {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.LineNo = indexNew + 1;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.PK = "";
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.SubLineNo = indexNew + 1;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.POH_FK = param.CurrentOrder.Header.Data.PK;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.IsValid = true

                            apiService.post("eAxisAPI", orderApiConfig.Entities.OrderLine_Buyer_Forwarder.API.upsert.Url, [one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder]).then(function (response) {
                                if (response.data.Response) {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List.push(response.data.Response[0]);
                                    one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder = response.data.Response[0];
                                    one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_ForwarderCopy = angular.copy(one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder);
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                } else {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        }
                    } else {
                        one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        ShowErrorWarningModal("Add");
                    }
                });
            }
        }

        function SaveClose() {
            var _isEmpty = angular.equals(one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder, {});
            one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[one_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (one_three_OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.IsModified = true;
                            apiService.post("eAxisAPI", orderApiConfig.Entities.OrderLine_Buyer_Forwarder.API.upsert.Url, [one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder]).then(function (responses) {
                                if (responses.data.Response) {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List[one_three_OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                } else {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.LineNo = indexNew + 1;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.PK = "";
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.SubLineNo = indexNew + 1;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.POH_FK = param.CurrentOrder.Header.Data.PK;
                            one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.IsValid = true

                            apiService.post("eAxisAPI", orderApiConfig.Entities.OrderLine_Buyer_Forwarder.API.upsert.Url, [one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder]).then(function (response) {
                                if (response.data.Response) {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List.push(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                } else {
                                    one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        }
                    } else {
                        one_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                        ShowErrorWarningModal("Add");
                    }
                });
            }
        }

        function Cancel() {
            if (param.Action == 'edit') {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Close?',
                    bodyText: 'Would you like to close without saving your changes?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        param.List[one_three_OrderLinesFormModalCtrl.ePage.Masters.Index] = one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer_ForwarderCopy;
                        $uibModalInstance.dismiss('close');
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Close?',
                    bodyText: 'Would you like to close without saving your changes?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        $uibModalInstance.dismiss('close');
                    }, function () {
                        console.log("Cancelled");
                    });
            }
        }

        function ShowErrorWarningModal(type) {
            if (type == 'Add') {
                $("#errorWarningContainer" + one_three_OrderLinesFormModalCtrl.ePage.Masters.Text).addClass("open");
            } else {
                $("#errorWarningContainer" + one_three_OrderLinesFormModalCtrl.ePage.Masters.Text).removeClass("open");
            }
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [one_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "BUYER_ORD_LINE",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: one_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();