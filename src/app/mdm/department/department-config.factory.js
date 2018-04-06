(function () {
    "use strict";

    angular
        .module("Application")
        .factory('departmentConfig', departmentConfig);

    departmentConfig.$inject = ["$location", "$q", "apiService", "helperService", "$rootScope"];

    function departmentConfig($location, $q, apiService, helperService, $rootScope) {
        var exports = {
            "Entities": {
                "DepartmentHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CmpDepartment/GetById/",
                            "FilterID": "CMPDEPT"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Employee/Insert",
                        }
                    },
                    "Meta": {}
                }
            },
            "DepartmentList": [],
            "AddDepartment": AddDepartment
        };
        return exports;

        function AddDepartment(currentDepartment, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "DepartmentHeader": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "CmpDepartment/GetById/",
                                "FilterID": "CMPDEPT"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Basic Details",
                                "Value": "Basics",
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address"
                            }],
                            "Language": helperService.metaBase()
                        }
                    }
                }
            };
            if (isNew) {
                _exports.Entities.DepartmentHeader.Data = currentDepartment.data;
                var obj = {
                    [currentDepartment.entity.Code]: {
                        ePage: _exports
                    },
                    label: currentDepartment.entity.Code,
                    isNew: isNew
                };
                exports.DepartmentList.push(obj);
                deferred.resolve(exports.DepartmentList);
            } else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.DepartmentHeader.API.GetByID.Url + currentDepartment.entity.PK).then(function (response) {
                    _exports.Entities.DepartmentHeader.Data = response.data.Response;
                    var obj = {
                        [currentDepartment.entity.Code]: {
                            ePage: _exports
                        },
                        label: currentDepartment.entity.Code,
                        isNew: isNew
                    };
                    exports.DepartmentList.push(obj);
                    deferred.resolve(exports.DepartmentList);
                });
            }
            return deferred.promise;
        }
    }
})();
