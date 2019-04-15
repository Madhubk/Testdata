(function () {
    "use strict";

    angular
        .module("Application")
        .factory('deliveryLineConfig', deliveryLineConfig);

    deliveryLineConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function deliveryLineConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDeliveryReport/GetById/"
                        }
                    },
                    "Meta": {

                    },
                    "Message": false
                }

            },

            "TabList": [],
            "ValidationValues": "",
            "SaveAndClose": false,
            "GetTabDetails": GetTabDetails
        };

        return exports;

        function GetTabDetails(currentDelivery, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertDeliveryReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsDeliveryReport/Insert"
                            },
                            "UpdateDeliveryReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsDeliveryReport/Update"
                            },
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "WmsDeliveryReport/GetById/",
                            },
                        },
                        "Meta": {
                            "MenuList": [
                            ],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                            },
                        },
                        "GlobalVariables": {
                            "Loading": false,
                            "NonEditable": false
                        },
                        "TableProperties": {
                        },
                    },
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentDelivery.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentDelivery.entity.DeliveryLineRefNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentDelivery.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentDelivery.DeliveryLineRefNo]: {
                            ePage: _exports
                        },
                        label: currentDelivery.DeliveryLineRefNo,
                        code: currentDelivery.DeliveryLineRefNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }
    }
})();


