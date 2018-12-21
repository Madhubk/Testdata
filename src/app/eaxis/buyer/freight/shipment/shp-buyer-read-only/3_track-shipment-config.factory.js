(function () {
    "use strict";

    angular
        .module("Application")
        .factory('three_TrackshipmentConfig', three_TrackshipmentConfig);

    three_TrackshipmentConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "authService", "helperService", "toastr", "appConfig", "$timeout", "freightApiConfig"];

    function three_TrackshipmentConfig($rootScope, $location, $q, apiService, authService, helperService, toastr, appConfig, $timeout, freightApiConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentShipment, isNew) {
            // Set configuration object to individual shipment
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
                _exports.Entities.Header.Data = currentShipment.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentShipment.entity.ShipmentNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Shipment details and set to configuration list
                helperService.getFullObjectUsingGetById(freightApiConfig.Entities["1_3"].API.listgetbyid.Url, currentShipment.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentShipment.ShipmentNo]: {
                            ePage: _exports
                        },
                        label: currentShipment.ShipmentNo,
                        code: currentShipment.ShipmentNo,
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
            var _obj = {
                ModuleName: ["Shipment"],
                Code: [$item.code],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: "SHP_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                _deferred.resolve(errorWarningService);
            });
            return _deferred.promise;

        }

        function PortsComparison(Str1, Str2) {
            if (!Str1 || !Str2) {
                return false
            }
            if (Str1 && Str2) {
                if (Str1.slice(0, 2) == Str2.slice(0, 2)) {
                    return true
                } else {
                    return false
                }
            }
        }

    }
})();