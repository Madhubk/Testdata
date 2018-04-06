(function () {
    "use strict";

    angular
        .module("Application")
        .factory('employeeConfig', EmployeeConfig);

    EmployeeConfig.$inject = ["$location","$q","apiService", "helperService","$rootScope"];

    function EmployeeConfig($location,$q,apiService,helperService,$rootScope) {
        var exports = {
            "Entities":{
                    "EmployeeHeader": {
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
                            "Url": "Employee/GetById/",
                            "FilterID": "EMPDTLS"
                        },
                          "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Employee/Insert",
                            
                        }
                        
                    },
                    "Meta": {

                    }
                }

            },
            "EmployeeList": [],
            "AddEmployee": AddEmployee
        };
        return exports;
    


    function AddEmployee(currentEmployee, isNewEmployee) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "EmployeeHeader": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                          
                            "CfxTypes":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "cfxtypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            }
                        },
                        "Meta": {
                            "Language": helperService.metaBase()
                        }
                    }
                }
            };

            if (isNewEmployee) {
                _exports.Entities.EmployeeHeader.Data = currentEmployee.data;
                var obj = {
                    [currentEmployee.entity.Code]: {
                        ePage: _exports
                    },
                    label: currentEmployee.entity.Code,
                    isNewEmployee: isNewEmployee
                };
                exports.EmployeeList.push(obj);
                deferred.resolve(exports.EmployeeList);
            } else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.EmployeeHeader.API.GetByID.Url + currentEmployee.PK).then(function (response) {
                                   
                   
                    // response.data.Messages.map(function (value, key) {
                    //     if (value.Type === "Warning" && value.MessageDesc !== "") {
                    //         $rootScope.messageBox('Show', 'Warning', 'Warning!', value.MessageDesc);
                    //     }
                    // });

               

                    _exports.Entities.EmployeeHeader.Data = response.data.Response;

                    var obj = {
                        [currentEmployee.Code]: {
                            ePage: _exports
                        },
                        label: currentEmployee.Code,
                        isNewEmployee: isNewEmployee
                    };
                    exports.EmployeeList.push(obj);
                    deferred.resolve(exports.EmployeeList);
                });
            }
            return deferred.promise;
        }
    }
})();



