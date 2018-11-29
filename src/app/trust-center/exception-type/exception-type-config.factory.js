(function () {
    "use strict";

    angular
        .module("Application")
        .factory('exceptionTypeConfig', ExceptionTypeConfig);

    ExceptionTypeConfig.$inject = ["$q", "apiService", "helperService", "toastr"];

    function ExceptionTypeConfig($q, apiService, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data":{},
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "MstExceptionType/GetById/"
                        }
                    },
                    "RowIndex": -1,
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

        function GetTabDetails(currentExceptionType, isNew) {

            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentExceptionType.data;
                
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentExceptionType.entity.Key,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentExceptionType.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentExceptionType.Key]: {
                            ePage: _exports
                        },
                        label: currentExceptionType.Key,
                        code: currentExceptionType.Key,
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
