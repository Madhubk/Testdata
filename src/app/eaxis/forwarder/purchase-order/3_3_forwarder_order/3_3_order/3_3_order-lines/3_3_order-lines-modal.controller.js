(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderLinesFormModalController", three_three_OrderLinesFormModalController);

    three_three_OrderLinesFormModalController.$inject = ["$uibModalInstance", "$timeout", "apiService", "helperService", "toastr", "param", "confirmation", "appConfig", "errorWarningService"];

    function three_three_OrderLinesFormModalController($uibModalInstance, $timeout, apiService, helperService, toastr, param, confirmation, appConfig, errorWarningService) {
        var three_three_OrderLinesFormModalCtrl = this;

        function Init() {
            three_three_OrderLinesFormModalCtrl.ePage = {
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
            three_three_OrderLinesFormModalCtrl.ePage.Masters.param = param;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(param.Data);
            three_three_OrderLinesFormModalCtrl.ePage.Masters.Save = Save;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveClose = SaveClose;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.Cancel = Cancel;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
            three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
            three_three_OrderLinesFormModalCtrl.ePage.Masters.Text = "OrderLine";

            if (param.Action !== 'edit') {
                three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder = param.Data;
                three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_ForwarderCopy = angular.copy(param.Data);
                three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.InnerPacks = 0;
                three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.OuterPacks = 0;
                three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.ReqExWorksDate = "";
                three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.LineDropDate = "";
            } else {
                GetByIdLines();
            }
            ValidationCall();
        }

        function ValidationCall() {
            // validation findall call
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [three_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "FORWARDER_ORD_LINE"
                },
                // GroupCode: "ORD_TRAN",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: []
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            three_three_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.OrderLine.Entity[three_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo].GlobalErrorWarningList;
            three_three_OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.OrderLine.Entity[three_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo];
        }

        function GetByIdLines() {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLine.API.GetById.Url + param.Data.PK).then(function (response) {
                if (response.data.Response) {
                    three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_ForwarderCopy = angular.copy(response.data.Response);
                    three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder = response.data.Response;
                }
            });
        }

        function Save() {
            var _isEmpty = angular.equals(three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, {});
            three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[three_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (three_three_OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.IsModified = true;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.UICustomEntity.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder]).then(function (responses) {
                                if (responses.data.Response) {
                                    three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List[three_three_OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_ForwarderCopy = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.LineNo = indexNew + 1;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.PK = "";
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.SubLineNo = indexNew + 1;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.POH_FK = param.CurrentOrder.Header.Data.PK;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.IsValid = true

                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder]).then(function (response) {
                                if (response.data.Response) {
                                    three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List.push(response.data.Response[0]);
                                    three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder = response.data.Response[0];
                                    three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_ForwarderCopy = angular.copy(three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder);
                                    three_three_OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                }
                            });
                        }
                    } else {
                        three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        ShowErrorWarningModal("Add");
                    }
                });
            }
        }

        function SaveClose() {
            var _isEmpty = angular.equals(three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder, {});
            three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[three_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (three_three_OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder]).then(function (responses) {
                                if (responses.data.Response) {
                                    three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List[three_three_OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.LineNo = indexNew + 1;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.PK = "";
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.SubLineNo = indexNew + 1;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.POH_FK = param.CurrentOrder.Header.Data.PK;
                            three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder.IsValid = true

                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_Forwarder]).then(function (response) {
                                if (response.data.Response) {
                                    three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List.push(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                }
                            });
                        }
                    } else {
                        three_three_OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
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
                        param.List[three_three_OrderLinesFormModalCtrl.ePage.Masters.Index] = three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLine_ForwarderCopy;
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
                $("#errorWarningContainer" + three_three_OrderLinesFormModalCtrl.ePage.Masters.Text).addClass("open");
            } else {
                $("#errorWarningContainer" + three_three_OrderLinesFormModalCtrl.ePage.Masters.Text).removeClass("open");
            }
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [three_three_OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIOrder_Forwarder.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "FORWARDER_ORD_LINE",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: three_three_OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();