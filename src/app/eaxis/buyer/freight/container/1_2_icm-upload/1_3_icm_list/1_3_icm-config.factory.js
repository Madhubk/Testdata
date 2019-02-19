(function () {
    "use strict";

    angular
        .module("Application")
        .factory('one_three_IcmConfig', one_three_IcmConfig);

    one_three_IcmConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr", "errorWarningService", "freightApiConfig","appConfig"];

    function one_three_IcmConfig($rootScope, $location, $q, apiService, helperService, toastr, errorWarningService, freightApiConfig,appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "containerlist/buyer/getbyid/",
                            "FilterID": "CONTHEAD"
                        },
                        "ContainerActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "containerlist/buyer/activityclose/"
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

        function GetTabDetails(currentContainer, isNew) {
            // Set configuration object to individual Booking
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Meta": {
                            "Container": {}
                        }
                    }
                }

            };
            if (isNew) {
                _exports.Entities.Header.Data = currentContainer.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentContainer.entity.ContainerNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Shipment details and set to configuration list
                helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerTrackContainer.API.GetById.Url, currentContainer.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentContainer.ContainerNo]: {
                            ePage: _exports
                        },
                        label: currentContainer.ContainerNo,
                        code: currentContainer.ContainerNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }

            return deferred.promise;
        }
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

})();