(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderLinesFormModalController", OrderLinesFormModalController);

    OrderLinesFormModalController.$inject = ["$uibModalInstance", "$timeout", "apiService", "helperService", "toastr", "param", "confirmation", "appConfig", "errorWarningService"];

    function OrderLinesFormModalController($uibModalInstance, $timeout, apiService, helperService, toastr, param, confirmation, appConfig, errorWarningService) {
        var OrderLinesFormModalCtrl = this;

        function Init() {
            OrderLinesFormModalCtrl.ePage = {
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
            OrderLinesFormModalCtrl.ePage.Masters.param = param;
            OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(param.Data);
            OrderLinesFormModalCtrl.ePage.Masters.Save = Save;
            OrderLinesFormModalCtrl.ePage.Masters.SaveClose = SaveClose;
            OrderLinesFormModalCtrl.ePage.Masters.Cancel = Cancel;
            OrderLinesFormModalCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
            OrderLinesFormModalCtrl.ePage.Masters.Text = "OrderLine";

            if (param.Action !== 'edit') {
                OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines = param.Data;
                OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLinesCopy = angular.copy(param.Data);
                OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.InnerPacks = 0;
                OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.OuterPacks = 0;
                OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.ReqExWorksDate = "";
                OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.LineDropDate = "";
            } else {
                GetByIdLines();
            }
            ValidationCall();
        }

        function ValidationCall() {
            // validation findall call
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIPorOrderHeader.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD_LINE"
                },
                // GroupCode: "ORD_TRAN",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: []
            };

            errorWarningService.GetErrorCodeList(_obj);
            // error warning modal
            OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.OrderLine.Entity[OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIPorOrderHeader.OrderCumSplitNo].GlobalErrorWarningList;
            OrderLinesFormModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.OrderLine.Entity[OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIPorOrderHeader.OrderCumSplitNo];
        }

        function GetByIdLines() {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLine.API.GetById.Url + param.Data.PK).then(function (response) {
                if (response.data.Response) {
                    OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLinesCopy = angular.copy(response.data.Response);
                    OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines = response.data.Response;
                }
            });
        }

        function Save() {
            var _isEmpty = angular.equals(OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines, {});
            OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIPorOrderHeader.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.IsModified = true;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.UICustomEntity.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines]).then(function (responses) {
                                if (responses.data.Response) {
                                    OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List[OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLinesCopy = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.LineNo = indexNew + 1;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.PK = "";
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.SubLineNo = indexNew + 1;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.POH_FK = param.CurrentOrder.Header.Data.PK;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.IsValid = true

                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines]).then(function (response) {
                                if (response.data.Response) {
                                    OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                                    param.List.push(response.data.Response[0]);
                                    OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines = response.data.Response[0];
                                    OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLinesCopy = angular.copy(OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines);
                                    OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                }
                            });
                        }
                    } else {
                        OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        ShowErrorWarningModal("Add");
                    }
                });
            }
        }

        function SaveClose() {
            var _isEmpty = angular.equals(OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines, {});
            OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                CommonErrorObjInput();
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.OrderLine.Entity[OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIPorOrderHeader.OrderCumSplitNo].GlobalErrorWarningList;
                    if (_errorcount.length == 0) {
                        if (OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines]).then(function (responses) {
                                if (responses.data.Response) {
                                    OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List[OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                }
                            });
                        } else {
                            var indexNew = param.List.length;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.LineNo = indexNew + 1;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.PK = "";
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.SubLineNo = indexNew + 1;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.POH_FK = param.CurrentOrder.Header.Data.PK;
                            OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines.IsValid = true

                            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLines]).then(function (response) {
                                if (response.data.Response) {
                                    OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                                    param.List.push(response.data.Response[0]);
                                    toastr.success("Line Saved Successfully..");
                                    $uibModalInstance.dismiss('close');
                                }
                            });
                        }
                    } else {
                        OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
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
                        param.List[OrderLinesFormModalCtrl.ePage.Masters.Index] = OrderLinesFormModalCtrl.ePage.Entities.Header.Data.UIOrderLinesCopy;
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
                $("#errorWarningContainer" + OrderLinesFormModalCtrl.ePage.Masters.Text).addClass("open");
            } else {
                $("#errorWarningContainer" + OrderLinesFormModalCtrl.ePage.Masters.Text).removeClass("open");
            }
        }

        function CommonErrorObjInput(errorCode) {
            var _obj = {
                ModuleName: ["OrderLine"],
                Code: [OrderLinesFormModalCtrl.ePage.Masters.param.CurrentOrder.Header.Data.UIPorOrderHeader.OrderCumSplitNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD_LINE",
                },
                // GroupCode: "PRE_ADV",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: OrderLinesFormModalCtrl.ePage.Entities.Header.Data,
                ErrorCode: errorCode ? errorCode : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();