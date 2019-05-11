(function () {
    "use strict";

    angular
        .module("Application")
        .factory('companyConfig', companyConfig);

    companyConfig.$inject = ["$location", "$q", "apiService", "helperService", "$rootScope"];
    function companyConfig($location, $q, apiService, helperService, $rootScope) {

        var exports = {
            "Entities": {
                "Header": {
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
                            "Url": "CurrencyUpliftList/GetById/",
                            "FilterID": "CURCFXCOMLI"
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
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "CurrencyUpliftList/GetById/",
                                "FilterID": "CURCFXCOMLI"
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
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {

                            }

                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                            "IsDisablePost": true
                        },
                        "TableProperties": {
                            "UICurrencyUplift": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 300
                                },
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "ccheckbox",
                                    "position": '1',
                                    "width": "40",
                                    "display": false
                                }, {
                                    "columnname": "Job Type",
                                    "isenabled": true,
                                    "property": "cjobtype",
                                    "position": '2',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Business Type",
                                    "isenabled": true,
                                    "property": "cbusinesstype",
                                    "position": '3',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Mode of Transport",
                                    "isenabled": true,
                                    "property": "cmodeoftransport",
                                    "position": '4',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Currency",
                                    "isenabled": true,
                                    "property": "ccurrency",
                                    "position": '5',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "CFX %",
                                    "isenabled": true,
                                    "property": "ccfx",
                                    "position": '6',
                                    "width": "150",
                                    "display": false
                                }, {
                                    "columnname": "CFX Min.",
                                    "isenabled": true,
                                    "property": "ccfxmin",
                                    "position": '7',
                                    "width": "150",
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
                                "cjobtype": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "155"
                                },
                                "cbusinesstype": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "155"
                                },
                                "cmodeoftransport": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "155"
                                },
                                "ccurrency": {
                                    "isenabled": true,
                                    "position": '6',
                                    "width": "155"
                                },
                                "ccfx": {
                                    "isenabled": true,
                                    "position": '7',
                                    "width": "150"
                                },
                                "ccfxmin": {
                                    "isenabled": true,
                                    "position": '8',
                                    "width": "150"
                                }

                            }
                        }
                    }
                }
            };
            if (isNew) {
                _exports.Entities.Header.Data = currentCompany.data;

                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentCompany.entity.Code,
                    isNew: isNew
                };
                exports.CompanyList.push(obj);
                deferred.resolve(exports.CompanyList);
            } else {

                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentCompany.entity.PK).then(function (response) {
                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentCompany.entity.Code]: {
                            ePage: _exports
                        },
                        label: currentCompany.entity.Code,
                        code: currentCompany.entity.Code,
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
