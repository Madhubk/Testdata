(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderCustomToolBarController", three_three_OrderCustomToolBarController);

    three_three_OrderCustomToolBarController.$inject = ["$scope", "$uibModal", "three_order_listConfig", "helperService", "toastr", "confirmation"];

    function three_three_OrderCustomToolBarController($scope, $uibModal, three_order_listConfig, helperService, toastr, confirmation) {
        var three_three_OrderCustomToolBarCtrl = this;

        function Init() {
            three_three_OrderCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_order_listConfig.Entities
            };

            three_three_OrderCustomToolBarCtrl.ePage.Masters.IsActiveMenu = three_three_OrderCustomToolBarCtrl.activeMenu;
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Config = three_order_listConfig;
            // Common Multi-select input
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Input = three_three_OrderCustomToolBarCtrl.input;
            three_three_OrderCustomToolBarCtrl.ePage.Masters.DataEntryObject = three_three_OrderCustomToolBarCtrl.dataentryObject;
            if (three_three_OrderCustomToolBarCtrl.input.length > 0) {
                EmailOpenInput();
            }

            InitAction();
        }

        function InitAction() {
            three_three_OrderCustomToolBarCtrl.ePage.Masters.OnComplete = OnMailSuccess;
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Booking = Booking;
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Activation = Activation;
            three_three_OrderCustomToolBarCtrl.ePage.Masters.OnClickBtn = OnClickBtn;
        }

        function OnClickBtn(type, displayName) {
            three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = undefined;
            switch (displayName) {
                case "Order Confirmation":
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = three_three_OrderCustomToolBarCtrl.input;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Cargo Readiness":
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = three_three_OrderCustomToolBarCtrl.input;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Shipment Pre-advice":
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = three_three_OrderCustomToolBarCtrl.input;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Convert As Booking":
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = three_three_OrderCustomToolBarCtrl.input;
                    three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
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
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                if (val.Buyer == three_three_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Buyer && val.Supplier == three_three_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Supplier) {
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
                            // "GridInput": three_three_OrderCustomToolBarCtrl.ePage.Masters.Input
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
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
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
            three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = datas;
            three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
            three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
            three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
            console.log(three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar);
            console.log(three_three_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input);
        }

        function EmailOpenInput() {
            three_three_OrderCustomToolBarCtrl.ePage.Masters.InputObj = {
                "EntityRefKey": three_three_OrderCustomToolBarCtrl.ePage.Masters.Input[0].PK,
                "EntitySource": "SFU",
                "EntityRefCode": three_three_OrderCustomToolBarCtrl.ePage.Masters.Input[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": three_three_OrderCustomToolBarCtrl.ePage.Masters.Input
            }
            var _subject = "Follow-up for PO's of -" + three_three_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Buyer + " to " + three_three_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Supplier;
            three_three_OrderCustomToolBarCtrl.ePage.Masters.MailObj = {
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
            three_three_OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (value, key) {
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
            UpdateRecords(three_three_OrderCustomToolBarCtrl.ePage.Masters.Input);
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