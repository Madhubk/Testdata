(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrderConfirmationController", one_one_OrderConfirmationController);

    one_one_OrderConfirmationController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function one_one_OrderConfirmationController(helperService, apiService, appConfig, toastr) {
        var one_one_OrderConfirmationCtrl = this;

        function Init() {
            one_one_OrderConfirmationCtrl.ePage = {
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
            one_one_OrderConfirmationCtrl.input.map(function (value, key) {
                value.status = true;
            });
            one_one_OrderConfirmationCtrl.ePage.Masters.ConfirmList = one_one_OrderConfirmationCtrl.input;
            one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder = angular.copy(one_one_OrderConfirmationCtrl.input);
            one_one_OrderConfirmationCtrl.ePage.Masters.DataChanges = DataChanges;
            one_one_OrderConfirmationCtrl.ePage.Masters.OnComplete = OnMailSucces;
            // 
            if (one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder.length > 0) {
                EmailOpenInput();
            }
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
            if (one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder.length > 0) {
                EmailOpenInput();
            }
        }

        function EmailOpenInput() {
            one_one_OrderConfirmationCtrl.ePage.Masters.Input = {
                "EntityRefKey": one_one_OrderConfirmationCtrl.ePage.Masters.ConfirmList[0].PK,
                "EntitySource": "POC",
                "EntityRefCode": one_one_OrderConfirmationCtrl.ePage.Masters.ConfirmList[0].OrderNo,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder
            }
            var _subjectInput = CommaSeperatedField(one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder, 'OrderNo')
            var _subject = "Confirmation for PO's of -" + _subjectInput;
            one_one_OrderConfirmationCtrl.ePage.Masters.MailObj = {
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
            one_one_OrderConfirmationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
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