(function () {
    "use strict";

    angular
        .module("Application")
        .factory('processinstanceConfig', ProcessInstanceConfig);

    ProcessInstanceConfig.$inject = ["$q", "helperService", "toastr"];

    function ProcessInstanceConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "EBPMProcessInstance/GetById/",
                            "FilterID": "BPMPSI"
                        }
                    },
                    "Meta": {
                        "DataSlot": {
                            "ProcessName": "",
                            "EntitySource": "",
                            "EntityRefKey": "",
                            "KeyReference": "",
                            "CompleteInstanceNo": "",
                            "CompleteStepNo": "",
                            "DataSlots": {
                                "Val1": "",
                                "Val2": "",
                                "Val3": "",
                                "Val4": "",
                                "Val5": "",
                                "Val6": "",
                                "Val7": "",
                                "Val8": "",
                                "Val9": "",
                                "Val10": "",
                                "Val11":"",
                                "Val12":"",
                                "Val13":"",
                                "Val14":"",
                                "Labels": {
                                    "Val1": "",
                                    "Val2": "",
                                    "Val3": "",
                                    "Val4": "",
                                    "Val5": "",
                                    "Val6": "",
                                    "Val7": "",
                                    "Val8": "",
                                    "Val9": "",
                                    "Val10": "",
                                    "Val11": "Organisation",
                                    "Val12": "Warehouse",
                                    "Val13": "Company",
                                    "Val14": "Department",
                                },
                                "ChildItem": [{
                                    "EntitySource": "",
                                    "EntityRefKey": "",
                                    "KeyReference": ""
                                }],
                                "Related": [{
                                    "CompleteInstanceNo": "",
                                    "CompleteStepNo": "",
                                    "Mode": ""
                                }]
                            }
                        }
                    }
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
                // Get ProcessInstance details and set to configuration list
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, currentProcessInstance.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [currentProcessInstance.InstanceNo]: {
                            ePage: _exports
                        },
                        label: currentProcessInstance.InstanceNo,
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
