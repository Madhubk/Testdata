(function () {
    "use strict";

    angular
        .module("Application")
        .factory("rateheaderConfig", rateheaderConfig);

    rateheaderConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function rateheaderConfig($location, $q, helperService, apiService, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "RateHeader/GetById/"
                        },
                    },
                    "Meta": {

                    }
                }
            },
            "TabList": [],
            // "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
        };
        return exports;

        function GetTabDetails(currentRateHeader, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "RateHeader/GetById/"
                            },
                        },
                        "Meta": {
                            "MenuList": [],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                            },
                        },
                        "GlobalVariables": {
                            "Loading": false,
                            "NonEditable": false,
                        },
                        "TableProperties": {
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                        },
                    },
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentRateHeader.data;
                _exports.Entities.Header.GetById = currentRateHeader.data;
                _exports.Entities.Header.Validations = currentRateHeader.Validations;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentRateHeader.entity.RateRefNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentRateHeader.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentRateHeader.RateRefNo]: {
                            ePage: _exports
                        },
                        label: currentRateHeader.RateRefNo,
                        code: currentRateHeader.RateRefNo,
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