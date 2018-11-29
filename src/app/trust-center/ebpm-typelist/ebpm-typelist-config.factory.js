(function () {
    "use strict";

    angular
        .module("Application")
        .factory('ebpmTypelistConfig', EbpmTypelistConfig);

        EbpmTypelistConfig.$inject = ["$q", "helperService", "toastr"];

    function EbpmTypelistConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "SOPTypelist/GetById/"
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

        function GetTabDetails(currentTypelist, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentTypelist.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentTypelist.entity.Code,
                    isNew: isNew
                };

                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentTypelist.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentTypelist.Code]: {
                            ePage: _exports
                        },
                        label: currentTypelist.Code,
                        code: currentTypelist.Code,
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
