(function () {
    "use strict";

    angular
        .module("Application")
        .factory('excelTemplateConfig', ExcelTemplateConfig);

    ExcelTemplateConfig.$inject = ["$q", "helperService", "toastr", "authService"];

    function ExcelTemplateConfig($q, helperService, toastr, authService) {
        let exports = {
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
            let deferred = $q.defer();
            let _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentExcelTemplate.data;
                let _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentExcelTemplate.entity.Key,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url + currentExcelTemplate.PK + "/", authService.getUserInfo().AppPK).then(response => {
                    if (response.data.Messages) {
                        response.data.Messages.map(value => {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    let obj = {
                        [currentExcelTemplate.Key]: {
                            ePage: _exports
                        },
                        label: currentExcelTemplate.Key,
                        code: currentExcelTemplate.Key,
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
