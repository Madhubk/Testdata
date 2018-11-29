(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentActivationController", ShipmentActivationController);

    ShipmentActivationController.$inject = ["helperService", "apiService", "appConfig", "toastr"];

    function ShipmentActivationController(helperService, apiService, appConfig, toastr) {
        var ShipmentActivationCtrl = this;

        function Init() {
            ShipmentActivationCtrl.ePage = {
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
            ShipmentActivationCtrl.input.map(function (value, key) {
                value.status = true;
            });
            ShipmentActivationCtrl.ePage.Masters.ActivationList = ShipmentActivationCtrl.input;
            ShipmentActivationCtrl.ePage.Masters.SelectedOrder = angular.copy(ShipmentActivationCtrl.input);
            // function(s)
            ShipmentActivationCtrl.ePage.Masters.Close = Close;
            ShipmentActivationCtrl.ePage.Masters.DataChanges = DataChanges;
            ShipmentActivationCtrl.ePage.Masters.Active = Active;
            ShipmentActivationCtrl.ePage.Masters.InActiveBtn = "In-Active";
            ShipmentActivationCtrl.ePage.Masters.ActiveBtn = "Active";
            ShipmentActivationCtrl.ePage.Masters.IsDisabledInActiveBtn = false;
            ShipmentActivationCtrl.ePage.Masters.IsDisabledActiveBtn = false;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function DataChanges(_item) {
            if (_item.item.status) {
                ShipmentActivationCtrl.ePage.Masters.SelectedOrder.push(_item.item);
            } else {
                ShipmentActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
                    if (value.PK == _item.item.PK) {
                        ShipmentActivationCtrl.ePage.Masters.SelectedOrder.splice(key, 1);
                    }
                });
            }
        }

        function Active(type, btn) {
            ShipmentActivationCtrl.ePage.Masters[btn] = "Please wait...";
            ShipmentActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
            var _arrayObject = [];
            ShipmentActivationCtrl.ePage.Masters.SelectedOrder.map(function (value, key) {
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
                ShipmentActivationCtrl.ePage.Masters[btn] = "Please wait...";
                ShipmentActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, _arrayObject).then(function (response) {
                    if (response.data.Status == 'Success') {
                        var _label = CommaSeperatedField(response.data.Response, 'OrderCumSplitNo');
                        if (type != 'active') {
                            ShipmentActivationCtrl.ePage.Masters[btn] = "In-Active";
                            toastr.success(_label + " Inactive Successfully...!");
                        } else {
                            ShipmentActivationCtrl.ePage.Masters[btn] = "Active";
                            toastr.success(_label + " Active Successfully...!");
                        }
                        ShipmentActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
                    } else {
                        toastr.error("Save failed...");
                        ShipmentActivationCtrl.ePage.Masters[btn] = "Please wait...";
                        ShipmentActivationCtrl.ePage.Masters["IsDisabled" + btn] = true;
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