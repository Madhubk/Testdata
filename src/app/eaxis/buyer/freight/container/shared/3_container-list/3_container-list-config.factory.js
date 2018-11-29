(function () {
    "use strict";

    angular
        .module("Application")
        .factory('threeContainerConfig', ThreeContainerConfig);

    ThreeContainerConfig.$inject = ["$q", "apiService", "helperService", "toastr"];

    function ThreeContainerConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "containerlist/buyer/getbyid/",
                            "FilterID": "CONTHEAD"
                        },
                        "ContainerActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "containerlist/buyer/activityclose/"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };

        return exports;

        function GetTabDetails(CurrentContainer, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertContainer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cntcontainer/buyer/insert"
                            },
                            "UpdateContainer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cntcontainer/buyer/update"
                            }


                        }
                    }

                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = CurrentContainer.data;
                var obj = {
                    [CurrentContainer.entity.ContainerNo]: {
                        ePage: _exports
                    },
                    label: CurrentContainer.entity.ContainerNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, CurrentContainer.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [CurrentContainer.ContainerNo]: {
                            ePage: _exports
                        },
                        label: CurrentContainer.ContainerNo,
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