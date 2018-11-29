(function () {
    "use strict";

    angular
        .module("Application")
        .factory('queueLogConfig', QueueLogConfig);

    QueueLogConfig.$inject = ["$q", "apiService", "helperService", "toastr", "authService"];

    function QueueLogConfig($q, apiService, helperService, toastr, authService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "QueueLog/GetById/"
                        }
                    },

                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentQueueLog, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            if (isNew) {
                _exports.Entities.Header.Data = currentQueueLog.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentQueueLog.entity.EntitySource,
                    isNew: isNew
                };

                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentQueueLog.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response[0];
                    var obj = {
                        [currentQueueLog.EntitySource]: {
                            ePage: _exports
                        },
                        label: currentQueueLog.EntitySource,
                        code: currentQueueLog.EntitySource,
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