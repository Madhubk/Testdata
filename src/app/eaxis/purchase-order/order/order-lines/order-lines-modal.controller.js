(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderLinesFormModalController", OrderLinesFormModalController);

    OrderLinesFormModalController.$inject = ["$uibModalInstance", "apiService", "helperService", "toastr", "param", "confirmation", "appConfig"];

    function OrderLinesFormModalController($uibModalInstance, apiService, helperService, toastr, param, confirmation, appConfig) {
        var OrderLinesFormModalCtrl = this;

        function Init() {
            OrderLinesFormModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Lines_modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitOrderLineModal();
        }

        function InitOrderLineModal() {
            OrderLinesFormModalCtrl.ePage.Masters.param = param;
            OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(param.Data);
            OrderLinesFormModalCtrl.ePage.Masters.Save = Save;
            OrderLinesFormModalCtrl.ePage.Masters.SaveClose = SaveClose;
            OrderLinesFormModalCtrl.ePage.Masters.Cancel = Cancel;
            OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";

            if (param.Action !== 'edit') {
                OrderLinesFormModalCtrl.ePage.Masters.OrderLines = param.Data;
                OrderLinesFormModalCtrl.ePage.Masters.OrderLinesCopy = angular.copy(param.Data);
                OrderLinesFormModalCtrl.ePage.Masters.OrderLines.InnerPacks = 0;
                OrderLinesFormModalCtrl.ePage.Masters.OrderLines.OuterPacks = 0;
            } else {
                GetByIdLines();
            }
        }

        function GetByIdLines() {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderLine.API.GetById.Url + param.Data.PK).then(function (response) {
                if (response.data.Response) {
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLinesCopy = angular.copy(response.data.Response);
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines = response.data.Response;
                }
            });
        }

        function Save() {
            var _isEmpty = angular.equals(OrderLinesFormModalCtrl.ePage.Masters.OrderLines, {});
            OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                if (OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.IsModified = true;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.UICustomEntity.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Masters.OrderLines]).then(function (responses) {
                        if (responses.data.Response) {
                            OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            param.List[OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                            OrderLinesFormModalCtrl.ePage.Masters.OrderLinesCopy = responses.data.Response[0];
                            toastr.success("Line Saved Successfully..");
                        }
                    });
                } else {
                    var indexNew = param.List.length;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.LineNo = indexNew + 1;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.PK = "";
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.SubLineNo = indexNew + 1;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.POH_FK = param.CurrentOrder.Header.Data.PK;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.IsValid = true

                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Masters.OrderLines]).then(function (response) {
                        if (response.data.Response) {
                            OrderLinesFormModalCtrl.ePage.Masters.SaveButtonText = "Save";
                            param.List.push(response.data.Response[0]);
                            OrderLinesFormModalCtrl.ePage.Masters.OrderLines = response.data.Response[0];
                            OrderLinesFormModalCtrl.ePage.Masters.OrderLinesCopy = angular.copy(OrderLinesFormModalCtrl.ePage.Masters.OrderLines);
                            OrderLinesFormModalCtrl.ePage.Masters.Index = param.List.indexOf(response.data.Response[0]);
                            toastr.success("Line Saved Successfully..");
                        }
                    });
                }
            }
        }

        function SaveClose() {
            var _isEmpty = angular.equals(OrderLinesFormModalCtrl.ePage.Masters.OrderLines, {});
            OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Please wait...";
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                if (OrderLinesFormModalCtrl.ePage.Masters.Index != -1) {
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Masters.OrderLines]).then(function (responses) {
                        if (responses.data.Response) {
                            OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                            param.List[OrderLinesFormModalCtrl.ePage.Masters.Index] = responses.data.Response[0];
                            toastr.success("Line Saved Successfully..");
                            $uibModalInstance.dismiss('close');
                        }
                    });
                } else {
                    var indexNew = param.List.length;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.LineNo = indexNew + 1;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.PK = "";
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.SubLineNo = indexNew + 1;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.POH_FK = param.CurrentOrder.Header.Data.PK;
                    OrderLinesFormModalCtrl.ePage.Masters.OrderLines.IsValid = true

                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.Upsert.Url, [OrderLinesFormModalCtrl.ePage.Masters.OrderLines]).then(function (response) {
                        if (response.data.Response) {
                            OrderLinesFormModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                            param.List.push(response.data.Response[0]);
                            toastr.success("Line Saved Successfully..");
                            $uibModalInstance.dismiss('close');
                        }
                    });
                }
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
                        param.List[OrderLinesFormModalCtrl.ePage.Masters.Index] = OrderLinesFormModalCtrl.ePage.Masters.OrderLinesCopy;
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

        Init();
    }
})();