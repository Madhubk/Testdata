(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingActionController", BookingActionController);

    BookingActionController.$inject = ["$scope", "$injector", "$uibModal", "$state", "apiService", "helperService", "appConfig", "confirmation", "toastr"];

    function BookingActionController($scope, $injector, $uibModal, $state, apiService, helperService, appConfig, confirmation, toastr) {
        /* jshint validthis: true */
        var BookingActionCtrl = this;

        function Init() {
            var curObject = BookingActionCtrl.input[BookingActionCtrl.input.label].ePage.Entities;
            BookingActionCtrl.ePage = {
                "Title": "",
                "Prefix": "Bookong_Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": curObject
            };
            if (BookingActionCtrl.input) {
                InitEvent();
            }
        }

        function InitEvent() {
            BookingActionCtrl.ePage.Masters.Action = {};
            BookingActionCtrl.ePage.Masters.Action.ActionMenuClick = ActionMenuClick;
            BookingActionCtrl.ePage.Masters.ConfigName = $injector.get('BookingConfig');
            BookingActionCtrl.ePage.Masters.ConfigName.CancelBooking = CancelBooking;
            BookingActionCtrl.ePage.Masters.ConfigName.AmendBooking = AmendBooking;
            BookingActionCtrl.ePage.Masters.ConfigName.ConvertAsShipment = ConvertAsShipment;
        }

        function ActionMenuClick(type) {
            var configObj = $injector.get('BookingConfig');
            if (type == 'cancel') {
                configObj.CancelBooking(BookingActionCtrl.input, 'UIShipmentHeader', configObj);
            } else if (type == 'amend') {
                configObj.AmendBooking(BookingActionCtrl.input, 'UIShipmentHeader', configObj);
            } else if (type == 'shipment') {
                configObj.ConvertAsShipment(BookingActionCtrl.input, 'UIShipmentHeader', configObj);
            }
        }

        function CancelBooking(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Cancel?',
                bodyText: 'Would you like to cancel this booking? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var __input = [{
                        "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                        "Properties": [{
                            "PropertyName": "SHP_IsCancelled",
                            "PropertyNewValue": true,
                        }]
                    }];
                    apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.UpdateRecords.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            toastr.success(_obj.label + " Cancelled Successfully...!");
                            BookingActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AmendBooking(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Cancel?',
                bodyText: 'Would you like to amend this booking? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var __input = [{
                        "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                        "Properties": [{
                            "PropertyName": "SHP_IsAmended",
                            "PropertyNewValue": true,
                        }]
                    }];
                    apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.UpdateRecords.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            TaskInit(_obj, keyObject, _config);
                            toastr.success(_obj.label + " Amended Successfully...!");
                            BookingActionCtrl.ePage.Masters.IsStandardMenu = false;
                            helperService.refreshGrid();
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function ConvertAsShipment(_obj, keyObject, _config) {
            // pop-up modal 
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Cancel?',
                bodyText: 'Would you like to convert to Shipment this booking? ' + _obj.label
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var __input = [{
                        "EntityRefPK": _obj[_obj.label].ePage.Entities.Header.Data.PK,
                        "Properties": [{
                            "PropertyName": "SHP_IsBooking",
                            "PropertyNewValue": false,
                        }]
                    }];
                    apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.UpdateRecords.Url, __input).then(function (response) {
                        if (response.data.Status == 'Success') {
                            toastr.success(_obj.label + " Converted as Shipment Successfully...!");
                            BookingActionCtrl.ePage.Masters.IsStandardMenu = false;
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });
        }

        function TaskInit(_obj, keyObject, _config) {

        }

        Init();
    }
})();