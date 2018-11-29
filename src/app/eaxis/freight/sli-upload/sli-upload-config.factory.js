(function () {
    "use strict";

    angular
        .module("Application")
        .factory('SLIUploadConfig', SLIUploadConfig);

    SLIUploadConfig.$inject = ["$q", "helperService", "toastr", "errorWarningService"];

    function SLIUploadConfig($q, helperService, toastr, errorWarningService) {
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

        function GetTabDetails(currentSLI, isNew) {
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
                _exports.Entities.Header.Data = currentSLI.data;
                _exports.Entities.Header.Data.UIShipmentHeader.BookingType = "SLI";

                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentSLI.entity.ShipmentNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Booking details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentSLI.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentSLI.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: currentSLI.ShipmentNo,
                        code: currentSLI.ShipmentNo,
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
            errorWarningService.OnFieldValueChange("SLIUpload", $item.code, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("SLIUpload", $item.code, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("SLIUpload", $item.code, _input.UIShipmentHeader.ExportForwarder_Code, 'E0048', false, undefined);
            errorWarningService.OnFieldValueChange("SLIUpload", $item.code, _input.UIShipmentHeader.ImportForwarder_Code, 'E0047', false, undefined);
            if (_input.UIJobDocuments.length == 0) {
                errorWarningService.OnFieldValueChange("SLIUpload", $item.code, false, 'E0046', false, undefined);
            } else {
                errorWarningService.OnFieldValueChange("SLIUpload", $item.code, true, 'E0046', false, undefined);
            }

            _deferred.resolve(errorWarningService);


            return _deferred.promise;

        }

    }
})();