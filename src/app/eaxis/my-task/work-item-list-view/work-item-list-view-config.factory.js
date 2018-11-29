(function () {
    "use strict";

    angular
        .module("Application")
        .factory('workItemListViewConfig', WorkItemListViewConfig);

        WorkItemListViewConfig.$inject = ["$q", "helperService", "toastr"];

    function WorkItemListViewConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "EBPMProcessInstance/GetById/"
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };
        return exports;

        function GetTabDetails(currentProcessInstance, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {},
                        "Meta": {}
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentProcessInstance.data;
                var obj = {
                    [currentProcessInstance.entity.InstanceNo]: {
                        ePage: _exports
                    },
                    label: currentProcessInstance.entity.InstanceNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentProcessInstance.PSI_FK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    if(response.data.Response){
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [currentProcessInstance.PSI_InstanceNo]: {
                                ePage: _exports
                            },
                            label: currentProcessInstance.PSI_InstanceNo,
                            isNew: isNew
                        };
                        exports.TabList.push(obj);
                    }
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }
    }
})();
