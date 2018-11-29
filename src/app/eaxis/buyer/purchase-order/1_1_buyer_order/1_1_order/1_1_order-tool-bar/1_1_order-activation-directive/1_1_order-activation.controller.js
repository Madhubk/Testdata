(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrderActivationController", one_one_OrderActivationController);

    one_one_OrderActivationController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function one_one_OrderActivationController(helperService, apiService, appConfig, toastr) {
        var one_one_OrderActivationCtrl = this;

        function Init() {
            one_one_OrderActivationCtrl.ePage = {
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
            one_one_OrderActivationCtrl.input.map(function (value, key) {
                value.status = true;
            });
            one_one_OrderActivationCtrl.ePage.Masters.ActivationList = one_one_OrderActivationCtrl.input;
            one_one_OrderActivationCtrl.ePage.Masters.SelectedOrder = angular.copy(one_one_OrderActivationCtrl.input);
            // function(s)
            one_one_OrderActivationCtrl.ePage.Masters.Close = Close;
            one_one_OrderActivationCtrl.ePage.Masters.DataChanges = DataChanges;
            one_one_OrderActivationCtrl.ePage.Masters.Active = Active;
            one_one_OrderActivationCtrl.ePage.Masters.InActiveBtn = "In-Active";
            one_one_OrderActivationCtrl.ePage.Masters.ActiveBtn = "Active";
            one_one_OrderActivationCtrl.ePage.Masters.IsDisabledInActiveBtn = false;
            one_one_OrderActivationCtrl.ePage.Masters.IsDisabledActiveBtn = false;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                one_one_OrderActivationCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                one_one_OrderActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        one_one_OrderActivationCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function Active(type, btn) {
            one_one_OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
            one_one_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
            var _arrayObject = [];
            one_one_OrderActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
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
                one_one_OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
                one_one_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _arrayObject).then(function (response) {
                    if (response.data.Status == 'Success') {
                        var _label = CommaSeperatedField(response.data.Response, 'OrderCumSplitNo');
                        if (type != 'active') {
                            one_one_OrderActivationCtrl.ePage.Masters[btn] = "In-Active";
                            toastr.success(_label + " Inactive Successfully...!");
                        } else {
                            one_one_OrderActivationCtrl.ePage.Masters[btn] = "Active";
                            toastr.success(_label + " Active Successfully...!");
                        }
                        one_one_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                    } else {
                        toastr.error("Save failed...");
                        one_one_OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
                        one_one_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
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