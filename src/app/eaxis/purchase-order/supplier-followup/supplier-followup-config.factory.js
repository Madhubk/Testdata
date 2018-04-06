(function () {
    "use strict";

    angular
        .module("Application")
        .factory('sufflierFollowupConfig', SufflierFollowupConfig);

    SufflierFollowupConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr"];

    function SufflierFollowupConfig($rootScope, $location, $q, apiService, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "FollowUpList/GetById/",
                            "FilterID": "SFULIST"
                        },
                        "OrderGetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderList/GetById/",
                            "FilterID": " ORDHEAD"
                        },
                        "GetByFollowUpNo": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "PorOrderFollowUp/GetByFollowUpNo/",
                            "FilterID": "SUPPFOL"
                        },
                        "FollowUpActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "FollowUpList/FollowUpActivityClose/",
                            "FilterID": ""
                        },
                        "FindAll" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderHeader/FindAll",
                                "FilterID": "ORDHEAD"
                        },
                        "Insert" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FollowUpList/Insert"
                        },
                        "Update" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FollowUpList/Update"
                        },
                        "Delete" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FollowUpList/Delete"
                        },
                        "Comments" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobComments/Insert"
                        },
                        "ActivateCRDUpdate" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "FollowUpList/ActivateCRDUpdate"
                        }
                        /*"Upsert" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderFollowUp/Upsert"
                        }*/
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };

        return exports;

        function GetTabDetails(currentSFU, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "Insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderFollowUp/Insert"
                            },
                            "Update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderFollowUp/Update"
                            },
                            "FindAll" : {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderHeader/FindAll",
                                "FilterID": "ORDHEAD"
                            },
                            "FollowUpActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "FollowUpList/FollowUpActivityClose/",
                                "FilterID": ""
                            },
                            "Upsert" : {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "Url": "PorOrderFollowUp/Upsert"
                            }

                        }
                    }

                }
            };

            if (isNew) {
                
                _exports.Entities.Header.Data = currentSFU.data;
                var obj = {
                    [currentSFU.entity.FollowUpId]: {
                        ePage: _exports
                    },
                    label: currentSFU.entity.FollowUpId,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentSFU.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentSFU.FollowUpId]: {
                            ePage: _exports
                        },
                        label: currentSFU.FollowUpId,
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