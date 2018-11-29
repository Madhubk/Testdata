(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderActivationController", three_three_OrderActivationController);

    three_three_OrderActivationController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function three_three_OrderActivationController(helperService, apiService, appConfig, toastr) {
        var three_three_OrderActivationCtrl = this;

        function Init() {
            three_three_OrderActivationCtrl.ePage = {
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
            three_three_OrderActivationCtrl.input.map(function (value, key) {
                value.status = true;
            });
            three_three_OrderActivationCtrl.ePage.Masters.ActivationList = three_three_OrderActivationCtrl.input;
            three_three_OrderActivationCtrl.ePage.Masters.SelectedOrder = angular.copy(three_three_OrderActivationCtrl.input);
            // function(s)
            three_three_OrderActivationCtrl.ePage.Masters.Close = Close;
            three_three_OrderActivationCtrl.ePage.Masters.DataChanges = DataChanges;
            three_three_OrderActivationCtrl.ePage.Masters.Active = Active;
            three_three_OrderActivationCtrl.ePage.Masters.InActiveBtn = "In-Active";
            three_three_OrderActivationCtrl.ePage.Masters.ActiveBtn = "Active";
            three_three_OrderActivationCtrl.ePage.Masters.IsDisabledInActiveBtn = false;
            three_three_OrderActivationCtrl.ePage.Masters.IsDisabledActiveBtn = false;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                three_three_OrderActivationCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                three_three_OrderActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        three_three_OrderActivationCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function Active(type, btn) {
            three_three_OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
            three_three_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
            var _arrayObject = [];
            three_three_OrderActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
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
                three_three_OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
                three_three_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _arrayObject).then(function (response) {
                    if (response.data.Status == 'Success') {
                        var _label = CommaSeperatedField(response.data.Response, 'OrderCumSplitNo');
                        if (type != 'active') {
                            three_three_OrderActivationCtrl.ePage.Masters[btn] = "In-Active";
                            toastr.success(_label + " Inactive Successfully...!");
                        } else {
                            three_three_OrderActivationCtrl.ePage.Masters[btn] = "Active";
                            toastr.success(_label + " Active Successfully...!");
                        }
                        three_three_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                    } else {
                        toastr.error("Save failed...");
                        three_three_OrderActivationCtrl.ePage.Masters[btn] = "Please wait...";
                        three_three_OrderActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
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