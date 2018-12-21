(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrderLinesFormModalController", one_one_OrderLinesFormModalController);

    one_one_OrderLinesFormModalController.$inject = ["$uibModalInstance", "$timeout", "apiService", "helperService", "toastr", "param", "confirmation", "appConfig", "errorWarningService"];

    function one_one_OrderLinesFormModalController($uibModalInstance, $timeout, apiService, helperService, toastr, param, confirmation, appConfig, errorWarningService) {
        var one_one_OrderLinesFormModalCtrl = this;

        function Init() {
            one_one_OrderLinesFormModalCtrl.ePage = {
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
            one_one_OrderLinesFormModalCtrl.ePage.Masters.param = param;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(param.Data);
            one_one_OrderLinesFormModalCtrl.ePage.Masters.Save = Save;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveClose = SaveClose;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.Cancel = Cancel;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
            one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
            one_one_OrderLinesFormModalCtrl.ePage.Masters.Text = "OrderLine";

            if (param.Action !== 'edit') {
                one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer = param.Data;
                one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_BuyerCopy = angular.copy(param.Data);
                one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.InnerPacks = 0;
                one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.OuterPacks = 0;
                one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.ReqExWorksDate = "";
                one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.LineDropDate = "";
            } else {
                GetByIdLines();
            }
            ValidationCall();
        }

        function ValidationCall() {
            // validation findall call
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [one_one_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "BUYER_ORD_LINE"
                },
                // GroupCode: "ORD_TRAN",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: []
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            one_one_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.OrderLine.Entity[one_one_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer.OrderCumSplitNo].GlobalErrorWarningList;
            one_one_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.OrderLine.Entity[one_one_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer.OrderCumSplitNo];
        }

        function GetByIdLines() {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLine.API.GetById.Url + param.Data.PK).then(function (response) {
                if (response.data.Response) {
                    one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_BuyerCopy = angular.copy(response.data.Response);
                    one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer = response.data.Response;
                }
            });
        }

        function Save() {
            var _isEmpty = angular.equals(one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, {});
            one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[one_one_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (one_one_OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.IsModified = true;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.UICustomEntity.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer]).then(function (responses) {
                                if (responses.data.Response) {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List[one_one_OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_BuyerCopy = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                } else {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.LineNo = indexNew + 1;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.PK = "";
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.SubLineNo = indexNew + 1;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.POH_FK = param.CurrentOrder.Header.Data.PK;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.IsValid = true

                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer]).then(function (response) {
                                if (response.data.Response) {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List.push(response.data.Response[0]);
                                    one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer = response.data.Response[0];
                                    one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_BuyerCopy = angular.copy(one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer);
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                } else {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        }
                    } else {
                        one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        ShowErrorWarningModal("Add");
                    }
                });
            }
        }

        function SaveClose() {
            var _isEmpty = angular.equals(one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer, {});
            one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[one_one_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (one_one_OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer]).then(function (responses) {
                                if (responses.data.Response) {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List[one_one_OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                } else {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.LineNo = indexNew + 1;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.PK = "";
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.SubLineNo = indexNew + 1;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.POH_FK = param.CurrentOrder.Header.Data.PK;
                            one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer.IsValid = true

                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Buyer]).then(function (response) {
                                if (response.data.Response) {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List.push(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                } else {
                                    one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    toastr.error("Line Save Failed..");
                                }
                            });
                        }
                    } else {
                        one_one_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
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
                        param.List[one_one_OrderLinesFormModalCtrl.ePage.Masters.Index] = one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_BuyerCopy;
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
                $("#errorWarningContainer" + one_one_OrderLinesFormModalCtrl.ePage.Masters.Text).addClass("open");
            } else {
                $("#errorWarningContainer" + one_one_OrderLinesFormModalCtrl.ePage.Masters.Text).removeClass("open");
            }
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [one_one_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Buyer.OrderCumSplitNo],
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
                EntityObject: one_one_OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();