(function () {
    "use strict";

    angular
        .module("Application")
        .factory('trackDamageSkuConfig', TrackDamageSkuConfig);

    TrackDamageSkuConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function TrackDamageSkuConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsPickupReport/GetById/"
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

        function GetTabDetails(currentTrackDamage, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertPickUpReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickupReport/Insert"
                            },
                            "UpdatePickUpReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsPickupReport/Update"
                            },
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "WmsPickupReport/GetById/",
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
                _exports.Entities.Header.Data = currentTrackDamage.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentTrackDamage.entity.PickupLineRefNo,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentTrackDamage.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentTrackDamage.PickupLineRefNo]: {
                            ePage: _exports
                        },
                        label: currentTrackDamage.PickupLineRefNo,
                        code: currentTrackDamage.PickupLineRefNo,
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


