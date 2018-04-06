(function () {
    "use strict";

    angular
        .module("Application")
        .factory('preAdviceConfig', PreAdviceConfig);

        PreAdviceConfig.$inject = ["$q", "helperService", "toastr"];

    function PreAdviceConfig($q, helperService, toastr) {
     
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PreAdviceList/GetById/",
                            "FilterID": "SPALIST"
                        },
                        "PreAdviceActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PreAdviceList/PreAdviceActivityClose/",
                            "FilterID": "ORDPREADVICE"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };

        return exports;

        function GetTabDetails(currentpreadvice, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentpreadvice.data;
                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentpreadvice.entity.PreAdviceId,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentpreadvice.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentpreadvice.PreAdviceId]: {
                            ePage: _exports
                        },
                        label: currentpreadvice.PreAdviceId,
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