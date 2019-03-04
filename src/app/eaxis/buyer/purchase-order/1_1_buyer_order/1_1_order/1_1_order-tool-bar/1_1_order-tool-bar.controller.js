(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrderCustomToolBarController", one_one_OrderCustomToolBarController);

    one_one_OrderCustomToolBarController.$inject = ["$scope", "$uibModal", "one_order_listConfig", "helperService", "toastr", "confirmation"];

    function one_one_OrderCustomToolBarController($scope, $uibModal, one_order_listConfig, helperService, toastr, confirmation) {
        var one_one_OrderCustomToolBarCtrl = this;

        function Init() {
            one_one_OrderCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": one_order_listConfig.Entities
            };

            one_one_OrderCustomToolBarCtrl.ePage.Masters.IsActiveMenu = one_one_OrderCustomToolBarCtrl.activeMenu;
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Config = one_order_listConfig;
            // Common Multi-select input
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Input = one_one_OrderCustomToolBarCtrl.input;
            one_one_OrderCustomToolBarCtrl.ePage.Masters.DataEntryObject = one_one_OrderCustomToolBarCtrl.dataentryObject;
            if (one_one_OrderCustomToolBarCtrl.input.length > 0) {
                EmailOpenInput();
            }

            InitAction();
        }

        function InitAction() {
            one_one_OrderCustomToolBarCtrl.ePage.Masters.OnComplete = OnMailSuccess;
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Booking = Booking;
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Activation = Activation;
            one_one_OrderCustomToolBarCtrl.ePage.Masters.OnClickBtn = OnClickBtn;
        }

        function OnClickBtn(type, displayName) {
            one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = undefined;
            switch (displayName) {
                case "Order Confirmation":
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = one_one_OrderCustomToolBarCtrl.input;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Cargo Readiness":
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = one_one_OrderCustomToolBarCtrl.input;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Shipment Pre-advice":
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = one_one_OrderCustomToolBarCtrl.input;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
                    break;
                case "Convert As Booking":
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = one_one_OrderCustomToolBarCtrl.input;
                    one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
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
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
                if (val.Buyer == one_one_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Buyer && val.Supplier == one_one_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Supplier) {
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
                            // "GridInput": one_one_OrderCustomToolBarCtrl.ePage.Masters.Input
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
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (val, key) {
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
            one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input = datas;
            one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = true;
            one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.ActivityName = displayName;
            one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar[type] = true;
            console.log(one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar);
            console.log(one_one_OrderCustomToolBarCtrl.ePage.Entities.GlobalVar.Input);
        }

        function EmailOpenInput() {
            one_one_OrderCustomToolBarCtrl.ePage.Masters.InputObj = {
                "EntityRefKey": one_one_OrderCustomToolBarCtrl.ePage.Masters.Input[0].PK,
                "EntitySource": "SFU",
                "EntityRefCode": one_one_OrderCustomToolBarCtrl.ePage.Masters.Input[0].OrderCumSplitNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": one_one_OrderCustomToolBarCtrl.ePage.Masters.Input
            }
            var _subject = "Follow-up for PO's of -" + one_one_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Buyer + " to " + one_one_OrderCustomToolBarCtrl.ePage.Masters.Input[0].Supplier;
            one_one_OrderCustomToolBarCtrl.ePage.Masters.MailObj = {
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
            one_one_OrderCustomToolBarCtrl.ePage.Masters.Input.map(function (value, key) {
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
            UpdateRecords(one_one_OrderCustomToolBarCtrl.ePage.Masters.Input);
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