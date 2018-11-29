(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderConfirmationController", OrderConfirmationController);

    OrderConfirmationController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function OrderConfirmationController(helperService, apiService, appConfig, toastr) {
        var OrderConfirmationCtrl = this;

        function Init() {
            OrderConfirmationCtrl.ePage = {
                "Title": "",
                "Prefix": "Confirmation_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitAction();
        }

        function InitAction() {
            OrderConfirmationCtrl.input.map(function (value, key) {
                value.status = true;
            });
            OrderConfirmationCtrl.ePage.Masters.ConfirmList = OrderConfirmationCtrl.input;
            OrderConfirmationCtrl.ePage.Masters.SelectedOrder = angular.copy(OrderConfirmationCtrl.input);
            OrderConfirmationCtrl.ePage.Masters.DataChanges = DataChanges;
            OrderConfirmationCtrl.ePage.Masters.OnComplete = OnMailSucces;
            // 
            if (OrderConfirmationCtrl.ePage.Masters.SelectedOrder.length > 0) {
                EmailOpenInput();
            }
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                OrderConfirmationCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                OrderConfirmationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        OrderConfirmationCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
            if (OrderConfirmationCtrl.ePage.Masters.SelectedOrder.length > 0) {
                EmailOpenInput();
            }
        }

        function EmailOpenInput() {
            OrderConfirmationCtrl.ePage.Masters.Input = {
                "EntityRefKey": OrderConfirmationCtrl.ePage.Masters.ConfirmList[0].PK,
                "EntitySource": "POC",
                "EntityRefCode": OrderConfirmationCtrl.ePage.Masters.ConfirmList[0].OrderNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": OrderConfirmationCtrl.ePage.Masters.SelectedOrder
            }
            var _subjectInput = CommaSeperatedField(OrderConfirmationCtrl.ePage.Masters.SelectedOrder, 'OrderNo')
            var _subject = "Confirmation for PO's of -" + _subjectInput;
            OrderConfirmationCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: "OrderConfirmation",
                TemplateObj: {
                    Key: "OrderConfirmation",
                    Description: "Order Confirmation Request"
                }
            };
        }

        function OnMailSucces($item) {
            var _input = [];
            OrderConfirmationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                var _updateInput = {
                    "EntityRefPK": value.PK,
                    "Properties": [{
                        "PropertyName": "POH_IsConfirmReqSent",
                        "PropertyNewValue": true
                    }]
                };
                _input.push(_updateInput);
            });

            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Successfully Mail Sent...");
                } else {
                    toastr.error("Failed...")
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