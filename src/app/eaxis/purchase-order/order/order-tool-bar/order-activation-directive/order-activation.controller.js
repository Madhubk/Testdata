(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderActivationController", OrderActivationController);

    OrderActivationController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function OrderActivationController(helperService, apiService, appConfig, toastr) {
        var OrderActivationCtrl = this;

        function Init() {
            OrderActivationCtrl.ePage = {
                "Title": "",
                "Prefix": "Active_Inactive_Directive",
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
            OrderActivationCtrl.input.map(function (value, key) {
                value.status = true;
            });
            OrderActivationCtrl.ePage.Masters.ActivationList = OrderActivationCtrl.input;
            OrderActivationCtrl.ePage.Masters.SelectedOrder = angular.copy(OrderActivationCtrl.input);
            // function(s)
            OrderActivationCtrl.ePage.Masters.Close = Close;
            OrderActivationCtrl.ePage.Masters.DataChanges = DataChanges;
            OrderActivationCtrl.ePage.Masters.Active = Active;
            OrderActivationCtrl.ePage.Masters.InActiveBtn = "In-Active";
            OrderActivationCtrl.ePage.Masters.ActiveBtn = "Active";
            OrderActivationCtrl.ePage.Masters.IsDisabledInActiveBtn = false;
            OrderActivationCtrl.ePage.Masters.IsDisabledActiveBtn = false;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                OrderActivationCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                OrderActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        OrderActivationCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function Active(type, btn) {
            OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
            OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
            var _arrayObject = [];
            OrderActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                if (type == 'active') {
                    var _input = {
                        "EntityRefPK": value.PK,
                        "Properties": [{
                            "PropertyName": "POH_IsValid",
                            "PropertyNewValue": true,
                        }]
                    };
                    _arrayObject.push(_input);
                } else {
                    var _input = {
                        "EntityRefPK": value.PK,
                        "Properties": [{
                            "PropertyName": "POH_IsValid",
                            "PropertyNewValue": false,
                        }]
                    };
                    _arrayObject.push(_input);
                }
            });
            if (_arrayObject.length > 0) {
                OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
                OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _arrayObject).then(function (response) {
                    if (response.data.Status == 'Success') {
                        var _label = CommaSeperatedField(response.data.Response, 'OrderCumSplitNo');
                        if (type != 'active') {
                            OrderActivationCtrl.ePage.Masters[btn] = "In-Active";
                            toastr.success(_label + " Inactive Successfully...!");
                        } else {
                            OrderActivationCtrl.ePage.Masters[btn] = "Active";
                            toastr.success(_label + " Active Successfully...!");
                        }
                        OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                    } else {
                        toastr.error("Save failed...");
                        OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
                        OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                    }
                });
            }
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