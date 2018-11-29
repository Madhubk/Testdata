(function () {
    "use strict";

    angular
        .module("Application")
        .factory('excelTemplateConfig', ExcelTemplateConfig);

    ExcelTemplateConfig.$inject = ["$q", "apiService", "helperService", "toastr", "authService"];

    function ExcelTemplateConfig($q, apiService, helperService, toastr, authService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "AppSettings/GetById/"
                        }
                    }
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentExcelTemplate, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentExcelTemplate.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentExcelTemplate.entity.SourceEntityRefKey,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url + currentExcelTemplate.PK + "/", authService.getUserInfo().AppPK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentExcelTemplate.SourceEntityRefKey]: {
                            ePage: _exports
                        },
                        label: currentExcelTemplate.SourceEntityRefKey,
                        code: currentExcelTemplate.SourceEntityRefKey,
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