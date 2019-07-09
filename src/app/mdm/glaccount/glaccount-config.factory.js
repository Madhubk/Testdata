(function () {
    "use strict";

    angular.module("Application")
        .factory('glaccountConfig', GLaccountConfig);

    GLaccountConfig.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr"];

    function GLaccountConfig($q, helperService, apiService, appConfig, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                },
                "API": {
                    "GLaccount": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "Post",
                                "Url": "AccGLHeader/FindAll",
                                "FilterID": "ACCGLHE"
                            },
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccGLHeaderCompanyList/GetById/"
                            },
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccGLHeaderCompanyFilter/Delete/"
                            },
                            "GLaccountActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccGLHeader/AccGLHeaderActivityClose/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "DataentryName": "AccGLHeader",
            "DataentryTitle": "GL Account"
        };
        return exports;

        function GetTabDetails(currentGlaccount, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertGLaccount": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccGLHeaderCompanyList/Insert"
                            },
                            "UpdateGLaccount": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccGLHeaderCompanyList/Update"
                            }
                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": []
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                        },
                        "TableProperties": {
                            "UIAccGLHeaderCompanyFilter": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 150
                                },
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "ccheckbox",
                                    "position": '1',
                                    "width": "40",
                                    "display": false
                                }, {
                                    "columnname": "S. No",
                                    "isenabled": true,
                                    "property": "csno",
                                    "position": '3',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Company",
                                    "isenabled": true,
                                    "property": "ccompany",
                                    "position": '3',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Company Name",
                                    "isenabled": true,
                                    "property": "ccompanyname",
                                    "position": '4',
                                    "width": "155",
                                    "display": false
                                }],
                                "ccheckbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "40"
                                },
                                "csno": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "50"
                                },
                                "ccompany": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "155"
                                },
                                "ccompanyname": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "155"
                                }
                            }
                        }

                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentGlaccount.data;
                var _code = currentGlaccount.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentGlaccount.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.GLaccount.API.GetById.Url, currentGlaccount.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentGlaccount.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentGlaccount.AccountNum,
                        code: _code,
                        pk: currentGlaccount.PK,
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