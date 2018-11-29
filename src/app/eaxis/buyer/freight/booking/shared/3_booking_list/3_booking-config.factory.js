(function () {
    "use strict";

    angular
        .module("Application")
        .factory('three_BookingConfig', three_BookingConfig);

    three_BookingConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr", "errorWarningService"];

    function three_BookingConfig($rootScope, $location, $q, apiService, helperService, toastr, errorWarningService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyer/getbyid/",
                            "FilterID": "SHIPHEAD"
                        },
                        "ShipmentActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyer/shipmentactivityclose/"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ShowErrorWarningModal": ShowErrorWarningModal,
        };
        return exports;

        function GetTabDetails(currentBooking, isNew) {
            // Set configuration object to individual Booking
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertBooking": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "booking/buyer/insert"
                            },
                            "UpdateBooking": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "booking/buyer/update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "GParentRef": "General",
                                "Icon": "fa-plane"
                            }, {
                                "DisplayName": "Orders",
                                "Value": "Order",
                                "Icon": "fa-cart-plus"
                            }, {
                                "DisplayName": "Planning",
                                "Value": "Planning",
                                "Icon": "fa-tasks"
                            }],
                            "AddressContactObject": {}
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentBooking.data;
                _exports.Entities.Header.Data.UIShipmentHeader.IsBooking = true

                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentBooking.entity.ShipmentNo,
                    isNew: isNew
                };
                // var obj = {
                //     [currentBooking.entity.ShipmentNo]: {
                //         ePage: _exports
                //     },
                //     label: currentBooking.entity.ShipmentNo,
                //     isNew: isNew
                // };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Booking details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentBooking.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentBooking.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: currentBooking.ShipmentNo,
                        code: currentBooking.ShipmentNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.code).toggleClass("open");
        }

        // function GeneralValidation($item) {
        //     //General Page Validation
        //     var _Data = $item[$item.label].ePage.Entities,
        //         _input = _Data.Header.Data;
        //     var _deferred = $q.defer();

        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.TransportMode, 'E0001', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.ExportForwarder_Code, 'E0047', false, undefined);
        //     errorWarningService.OnFieldValueChange("Booking", $item.code, _input.UIShipmentHeader.ImportForwarder_Code, 'E0048', false, undefined);

        //     _deferred.resolve(errorWarningService);

        //     return _deferred.promise;

        // }
    }
})();