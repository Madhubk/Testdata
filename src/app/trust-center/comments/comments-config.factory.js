(function () {
    "use strict";

    angular
        .module("Application")
        .factory('commentsConfig', CommentsConfig);

    CommentsConfig.$inject = ["$q", "helperService", "toastr"];

    function CommentsConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "MstCommentType/GetById/"
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

        function GetTabDetails(currentComments, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentComments.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentComments.entity.TypeCode,
                    isNew: isNew
                };

                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentComments.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentComments.TypeCode]: {
                            ePage: _exports
                        },
                        label: currentComments.TypeCode,
                        code: currentComments.TypeCode,
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
