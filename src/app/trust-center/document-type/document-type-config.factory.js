(function () {
    "use strict";

    angular
        .module("Application")
        .factory('documentTypeConfig', DocumentTypeConfig);

    DocumentTypeConfig.$inject = ["$q", "helperService", "toastr"];

    function DocumentTypeConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DocTypeMaster/GetById/"
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

        function GetTabDetails(currentDocumentType, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentDocumentType.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentDocumentType.entity.DocType,
                    isNew: isNew
                };

                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentDocumentType.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentDocumentType.DocType]: {
                            ePage: _exports
                        },
                        label: currentDocumentType.DocType,
                        code: currentDocumentType.DocType,
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
