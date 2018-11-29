(function () {
    "use strict";

    angular
        .module("Application")
        .factory('BookingBranchConfig', BookingBranchConfig);

    BookingBranchConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr", "errorWarningService"];

    function BookingBranchConfig($rootScope, $location, $q, apiService, helperService, toastr, errorWarningService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/GetById/",
                            "FilterID": "SHIPHEAD"
                        },
                        "ShipmentActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/ShipmentActivityClose/"
                        },
                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
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
                                "Url": "Booking/Insert"
                            },
                            "UpdateBooking": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Booking/Update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa-plane"
                            }, {
                                "DisplayName": "Orders",
                                "Value": "Order",
                                "Icon": "fa-cart-plus"
                            }, {
                                "DisplayName": "Planning",
                                "Value": "Planning",
                                "Icon": "fa-tasks"
                            }, {
                                "DisplayName": "Service & Reference",
                                "Value": "ServiceAndReference",
                                "Icon": "fa-wrench"
                            }, {
                                "DisplayName": "Pickup & Delivery",
                                "Value": "PickupAndDelivery",
                                "Icon": "fa-train"
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o"
                            }],
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentBooking.data;

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

        function GeneralValidation($item) {
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.HBLAWBChargesDisplay, 'E0039', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.ExportForwarder_Code, 'E0047', false, undefined);
            errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.UIShipmentHeader.ImportForwarder_Code, 'E0048', false, undefined);
            // errorWarningService.OnFieldValueChange("BookingBranch", $item.code, _input.JobComments, 'E0035', false, undefined);
            if (_input.UIJobRoutes.length == 0) {
                errorWarningService.OnFieldValueChange("BookingBranch", $item.code, false, 'E0033', false, undefined);
            } else {
                errorWarningService.OnFieldValueChange("BookingBranch", $item.code, true, 'E0033', false, undefined);
            }
            var tempArrayDoc = []
            if (_input.UIShipmentHeader.BookingType == 'CB') {
                if (_input.DocumentDetails.length > 0) {
                    _input.DocumentDetails.map(function (val, key) {

                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });

                    if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("BookingBranch", $item.code, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("BookingBranch", $item.code, false, 'E0038', false, undefined);
                    }


                } else {
                    errorWarningService.OnFieldValueChange("BookingBranch", $item.code, false, 'E0038', false, undefined);
                }
            } else {
                errorWarningService.OnFieldValueChange("BookingBranch", $item.code, true, 'E0038', false, undefined);
            }

            _deferred.resolve(errorWarningService);


            return _deferred.promise;

        }

    }
})();