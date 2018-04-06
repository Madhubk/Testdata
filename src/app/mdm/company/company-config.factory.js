(function() {
    "use strict";

    angular
        .module("Application")
        .factory('companyConfig', companyConfig);

    companyConfig.$inject = ["$location", "$q", "apiService", "helperService", "$rootScope"];
    function companyConfig($location, $q, apiService, helperService, $rootScope) {

        var exports = {
            "Entities": {
                "CompanyHeader": {
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
                            "Url": "CmpCompany/GetById/",
                            "FilterID": "CMPCOMP"
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
            "CompanyList": [],
            "AddCompany": AddCompany
        };
        return exports;

        function AddCompany(currentCompany, isNew) {
            console.log(currentCompany);
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "CompanyHeader": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "CmpCompany/GetById/",
                                "FilterID": "CMPCOMP"
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
                _exports.Entities.CompanyHeader.Data = currentCompany.data;

                var obj = {
                    [currentCompany.entity.Code]: {
                        ePage: _exports
                    },
                    label: currentCompany.entity.Code,
                    isNew: isNew
                };
                exports.CompanyList.push(obj);
                deferred.resolve(exports.CompanyList);
            } else {

                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.CompanyHeader.API.GetByID.Url + currentCompany.entity.PK).then(function(response) {
                    _exports.Entities.CompanyHeader.Data = response.data.Response;

                    var obj = {
                        [currentCompany.entity.Code]: {
                            ePage: _exports
                        },
                        label: currentCompany.entity.Code,
                        isNew: isNew
                    };
                    exports.CompanyList.push(obj);
                    deferred.resolve(exports.CompanyList);
                });
            }
            return deferred.promise;
        }
    }
})();
