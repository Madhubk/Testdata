(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderCustomToolBarController", OrderCustomToolBarController);

    OrderCustomToolBarController.$inject = ["$scope", "$uibModal", "orderConfig", "helperService", "toastr", "confirmation"];

    function OrderCustomToolBarController($scope, $uibModal, orderConfig, helperService, toastr, confirmation) {
        var OrderCustomToolBarCtrl = this;

        function Init() {
            OrderCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };

            OrderCustomToolBarCtrl.ePage.Masters.IsActiveMenu = OrderCustomToolBarCtrl.activeMenu;
            OrderCustomToolBarCtrl.ePage.Masters.Config = orderConfig;
            // Common Multi-select input
            OrderCustomToolBarCtrl.ePage.Masters.Input = OrderCustomToolBarCtrl.input;
            OrderCustomToolBarCtrl.ePage.Masters.DataEntryObject = OrderCustomToolBarCtrl.dataentryObject;
            if (OrderCustomToolBarCtrl.input.length > 0) {
                EmailOpenInput();
            }

            InitAction();
        }

        function InitAction() {
            OrderCustomToolBarCtrl.ePage.Masters.OnComplete = OnMailSuccess;
            OrderCustomToolBarCtrl.ePage.Masters.Booking = Booking;
            OrderCustomToolBarCtrl.ePage.Masters.Activation = Activation;
            OrderCustomToolBarCtrl.ePage.Masters.OnClickBtn = OnClickBtn;
        }

        function OnClickBtn(type, displayName) {
            OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = undefined;
            switch (displayName) {
                case "Order Confirmation":
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = OrderCustomToolBarCtrl.input;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Cargo Readiness":
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = OrderCustomToolBarCtrl.input;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Shipment Pre-advice":
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = OrderCustomToolBarCtrl.input;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Convert As Booking":
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = OrderCustomToolBarCtrl.input;
                    OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Order Activation":
                    Activation(type, displayName);
                    break;
                default:
                    break;
            }
        }

        function Booking() {
            var MismatchOrders = [];
            var MatchOrders = [];
            OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                if (val.Buyer == OrderCustomToolBarCtrl.ePage.Masters.Input[0].Buyer && val.Supplier == OrderCustomToolBarCtrl.ePage.Masters.Input[0].Supplier) {
                    MatchOrders.push(val);
                } else {
                    MismatchOrders.push(val);
                }
            });
            if (MismatchOrders.length > 0) {
                ConfirmationPopup(MismatchOrders, MatchOrders);
            } else {
                convertBookingPopUp(MatchOrders);
            }
        }

        function convertBookingPopUp(MatchOrders) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "right",
                scope: $scope,
                templateUrl: "app/eAxis/purchase-order/order/order-tool-bar/convert-booking-modal/convert-booking-modal.html",
                // controller: 'FollowUpModalToolBarController',
                // controllerAs: "FollowUpModalToolBarCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            // "QueryString": _queryString,
                            // "GridInput": OrderCustomToolBarCtrl.ePage.Masters.Input
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {},
                function (response) {}
            );
        }

        function ConfirmationPopup(MismatchOrders, MatchOrders) {
            var text = "";
            MismatchOrders.map(function (val, key) {
                text += val.OrderNo + ','
            });
            var modalOptions = {
                closeButtonText: 'Cancel',
                closeButtonVisible: true,
                actionButtonText: 'Ok',
                headerText: 'Below listed orders Consignee/Consignor mismatched.Do you want to ignore this orders..?',
                bodyText: text
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    convertBookingPopUp(MatchOrders);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Activation(type, displayName) {
            var MismatchOrders = [];
            var MatchOrders = [];
            OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                if (val.SHP_FK && val.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    MismatchOrders.push(val);
                } else {
                    MatchOrders.push(val);
                }
            });
            if (MismatchOrders.length > 0) {
                ActivationPopup(MismatchOrders, MatchOrders, type, displayName);
            } else {
                ActiveConfirmation(MatchOrders, type, displayName);
            }
        }

        function ActivationPopup(MismatchOrders, MatchOrders, type, displayName) {
            var _orderNos = CommaSeperatedField(MismatchOrders, 'OrderCumSplitNo');
            var modalOptions = {
                closeButtonText: 'Cancel',
                closeButtonVisible: true,
                actionButtonText: 'Ok',
                headerText: 'Below listed orders are attached with shipments.Do you want to ignore this orders..?',
                bodyText: _orderNos
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    ActiveConfirmation(MatchOrders, type, displayName);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function ActiveConfirmation(datas, type, displayName) {
            OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = datas;
            OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
            OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
            OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
            console.log(OrderCustomToolBarCtrl.ePage.Entities.GlobalVar);
            console.log(OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input);
        }

        function EmailOpenInput() {
            OrderCustomToolBarCtrl.ePage.Masters.InputObj = {
                "EntityRefKey": OrderCustomToolBarCtrl.ePage.Masters.Input[0].PK,
                "EntitySource": "SFU",
                "EntityRefCode": OrderCustomToolBarCtrl.ePage.Masters.Input[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": OrderCustomToolBarCtrl.ePage.Masters.Input
            }
            var _subject = "Follow-up for PO's of -" + OrderCustomToolBarCtrl.ePage.Masters.Input[0].Buyer + " to " + OrderCustomToolBarCtrl.ePage.Masters.Input[0].Supplier;
            OrderCustomToolBarCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderSummaryReport",
                TemplateObj: {
                    Key: "OrderSummaryReport",
                    Description: "Order Summary Report"
                }
            };
        }

        function OnMailSuccess($item) {
            var _input = [];
            OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (value, key) {
                var _inputData = {
                    "OrderNo": value.OrderNo,
                    "OrderSplitNo": value.OrderSplitNo,
                    "POH_FK": value.PK,
                    "Buyer": value.Buyer,
                    "Supplier": value.Supplier,
                    "FollowUpDetailPK": ""
                }
                _input.push(_inputData);
            });
            var _filter = {
                "GroupEntityRefKey": "",
                "UIVesselPlanningDetails": _input
            }
            apiService.post("eAxisAPI", appConfig.Entities.CargoReadiness.API.CompleteFollowUpTask.Url, _filter).then(function (response) {
                if (response.data.Status === "Success") {} else {
                    toastr.error("Task Completion Failed...!");
                }
            });
            UpdateRecords(OrderCustomToolBarCtrl.ePage.Masters.Input);
        }

        function UpdateRecords(_items) {
            var _updateInput = [];
            _items.map(function (val, key) {
                var _tempObj = {
                    "EntityRefPK": val.PK,
                    "Properties": [{
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "FLS"
                    }]
                };
                _updateInput.push(_tempObj);
            });
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Successfully saved...");
                } else {
                    toastr.error("Save Failed...")
                }
            });
        }

        function CommaSeperatedField(item, fieldName) {
            var field = "";
            item.map(function (val, key) {
                field += val[fieldName] + ','
            });
            return field.substring(0, field.length - 1);
        }

        Init();
    }
})();