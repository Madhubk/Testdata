(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shipmentActionController", shipmentActionController);

    shipmentActionController.$inject = ["$scope", "$injector", "apiService", "helperService", "appConfig", "confirmation", "toastr","FreightShpConfirmation"];

    function shipmentActionController($scope, $injector, apiService, helperService, appConfig, confirmation, toastr,FreightShpConfirmation) {
        /* jshint validthis: true */
        var ShipmentActionCtrl = this;
        function Init() {
            var curObject = ShipmentActionCtrl.input[ShipmentActionCtrl.input.label].ePage.Entities;
            ShipmentActionCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": curObject
            };
            if (ShipmentActionCtrl.input) {
                InitEvent();
            }
        }

        function InitEvent() {
            ShipmentActionCtrl.ePage.Masters.Action = {};
            ShipmentActionCtrl.ePage.Masters.Action.ActionMenuClick = ActionMenuClick;
            // shipment action
            ShipmentActionCtrl.ePage.Masters.ConfigName = $injector.get('shipmentConfig');
            ShipmentActionCtrl.ePage.Masters.ConfigName.CopyShipment = CopyShipment;
            ShipmentActionCtrl.ePage.Masters.ConfigName.CancelShipment = CancelShipment;
            ShipmentActionCtrl.ePage.Masters.ConfigName.MakeIsActiveShipment = MakeIsActiveShipment;
            ShipmentActionCtrl.ePage.Masters.ConfigName.SplitShipment = SplitShipment;

        }

        $scope.$watch('ShipmentActionCtrl.input', function (oldValue, NewValue) {
            if (!ShipmentActionCtrl.input.isNew) {
                if (!ShipmentActionCtrl.input[ShipmentActionCtrl.input.label].ePage.Entities.Header.Data.UIShipmentHeader) {
                    if (ShipmentActionCtrl.input[ShipmentActionCtrl.input.label].ePage.Entities.Header.Data.IsValid) {
                        ShipmentActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        ShipmentActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                }
                else {
                    if (ShipmentActionCtrl.input[ShipmentActionCtrl.input.label].ePage.Entities.Header.Data.UIShipmentHeader.IsValid) {
                        ShipmentActionCtrl.ePage.Masters.IsActive = "Make Inactive"
                    } else {
                        ShipmentActionCtrl.ePage.Masters.IsActive = "Make Active"
                    }
                }
            }
        });

        function ActionMenuClick(type) {
            var configObj = $injector.get('shipmentConfig');
            if (type == 'copy') {
                configObj.CopyShipment(ShipmentActionCtrl, 'UIShipmentHeader', configObj);
            } else if (type == 'cancel') {
                configObj.CancelShipment(ShipmentActionCtrl, 'UIShipmentHeader', configObj);
            } else if (type == 'active') {
                if (ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK && ShipmentActionCtrl.ePage.Entities.Header.Data.UIOrderHeaders.length > 0) { 
                    toastr.warning("Shipment already attached with order. [Order #" + ShipmentActionCtrl.ePage.Entities.Header.Data.UIOrderHeaders[0].OrderNo + "]!. Unable to set Inactive");
                }
                if (ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK && ShipmentActionCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                    toastr.warning("Shipment already attached with " + ShipmentActionCtrl.ePage.Entities.Header.Data.UIConShpMappings[0].ConsolNo + "!. Unable to set Inactive");
                } else {
                    MakeIsActiveShipment();
                }
            } else if (type == 'split') {
                SplitShipment(ShipmentActionCtrl, 'UIShipmentHeader', configObj);
            }
        }

        function CopyShipment(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Order Copy?',
                bodyText: 'Would you like to copy this Shipment? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.ShipmentCopy.Url + _obj.ePage.Entities.Header.Data.PK).then(function (response) {
                        var __obj = {
                            entity: response.data.Response[keyObject],
                            data: response.data.Response
                        };
                        console.log(__obj);
                        ShipmentActionCtrl.ePage.Masters.ConfigName.Entities.AddTab(__obj, true);
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function CancelShipment(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Cancel?',
                bodyText: 'Would you like to cancel this order? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var __input = [{
                        "EntityRefPK": _obj.ePage.Entities.Header.Data.PK,
                        "Properties": [{
                            "PropertyName": "SHP_IsCancelled",
                            "PropertyNewValue": true,
                        }]
                    }];
                    apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.UpdateRecords.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            toastr.success(_obj.label + " Cancelled Successfully...!");
                            ShipmentActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function MakeIsActiveShipment() {
            if (ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader) {
                var _isValid = ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsValid;
                var _label = _isValid ? "Inactive" : "Active"
            } else {
                var _isValid = ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsValid;
                var _label = _isValid ? "Inactive" : "Active"
            }

            if (_isValid) {
                var _isValid = false;
            } else {
                _isValid = true;
            }
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Active/InActive?',
                bodyText: 'Are You Sure Want To ' + _label + "? " + ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if ( ShipmentActionCtrl.ePage.Entities.Header.Data.PK) {
                        ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsValid=_isValid;
                    } else {
                        ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IsValid=_isValid;
                        // var __input = [{
                        //     "EntityRefPK": ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
                        //     "Properties": [{
                        //         "PropertyName": "SHP_IsValid",
                        //         "PropertyNewValue": _isValid,
                        //     }]
                        // }];
                    }
                    ShipmentActionCtrl.input[ShipmentActionCtrl.input.label].ePage.Entities.Header.Data.UIShipmentHeader.IsModified = true;
                    helperService.SaveEntity(ShipmentActionCtrl.input, 'Shipment').then(function (response) {
                        if (response.Status === "success") {
                            if (_isValid) {
                                toastr.success(ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + " Active Successfully...!");
                                ShipmentActionCtrl.ePage.Masters.IsActive = "Make InActive";
                            }
                            else {
                                toastr.success(ShipmentActionCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo + " InActive Successfully...!");
                                ShipmentActionCtrl.ePage.Masters.IsActive = "Make Active";
                            }
                        } else if (response.Status === "failed") {
                            toastr.error("Shipment Update Failed...!");
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function SplitShipment(_obj, keyObject, _config) {
            var tempArray = [];
            if (_obj.ePage.Entities.Header.Data.UIShipmentHeader != undefined) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Split Shipment?',
                        bodyText: 'Would you like to split the Shipment? ' + _obj.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            var modalOptions1 = {
                                closeButtonText: 'Cancel',
                                actionButtonText: 'Ok',
                                headerText: 'Split Shipment?',
                                bodyText: 'Select Weight and Volume',
                                bodyData: _obj.ePage.Entities.Header.Data.UIShipmentHeader,
                                actionButtonText:'Split Now'
                            };
                            FreightShpConfirmation.showModal({}, modalOptions1)
                            .then(function (result,NewShipment) {
                                console.log(NewShipment)
                            }, function () {
                                console.log("Cancelled");
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                // pop-up modal 
            } else {
                toastr.warning("Can't Split Here...")
            }
        }

        Init();
    }
})();
