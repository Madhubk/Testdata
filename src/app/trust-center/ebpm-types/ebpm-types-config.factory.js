(function () {
    "use strict";

    angular
        .module("Application")
        .factory('ebpmTypesConfig', EbpmTypesConfig);

        EbpmTypesConfig.$inject = ["$q", "helperService", "toastr"];

    function EbpmTypesConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "EBPMCFXTypes/GetById/"
                        }
                    },
                    "Meta": {
                        "Module": helperService.metaBase(),
                        "Parties": helperService.metaBase(),
                    }
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentEbpmTypes, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentEbpmTypes.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentEbpmTypes.entity.Code,
                    isNew: isNew
                };

                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentEbpmTypes.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentEbpmTypes.Code]: {
                            ePage: _exports
                        },
                        label: currentEbpmTypes.Code,
                        code: currentEbpmTypes.Code,
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
