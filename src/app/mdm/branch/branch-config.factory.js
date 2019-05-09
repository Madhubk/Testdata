        (function() {
            "use strict";

            angular
                .module("Application")
                .factory('branchConfig', BranchConfig);

            BranchConfig.$inject = ["$location", "$q", "apiService", "helperService", "$rootScope"];

            function BranchConfig($location, $q, apiService, helperService, $rootScope) {
                var exports = {
                    "Entities": {
                        "BranchHeader": {
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
                                    "Url": "CmpBranch/GetById/",
                                    "FilterID": "CMPBRAN"
                                }

                            },
                            "Meta": {

                            }
                        }

                    },
                    "BranchList": [],
                    "AddBranch": AddBranch
                };
                return exports;

                function AddBranch(currentBranch, isNew) {
                    // Set configuration object to individual Consolidation
                    var deferred = $q.defer();
                    var _exports = {
                        "Entities": {
                            "BranchHeader": {
                                "Data": {},
                                "RowIndex": -1,
                                "API": {

                                    "CfxTypes": {
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

                    if (isNew) {
                        _exports.Entities.BranchHeader.Data = currentBranch.data;
                        var obj = {
                            New: {
                                ePage: _exports
                            },
                            label: "New",
                            code:currentBranch.entity.Code,
                            isNew: isNew
                        };
                        exports.BranchList.push(obj);
                        deferred.resolve(exports.BranchList);
                    } else {
                        // Get Consolidation details and set to configuration list
                        apiService.get("eAxisAPI", exports.Entities.BranchHeader.API.GetByID.Url + currentBranch.entity.PK).then(function(response) {
                            _exports.Entities.BranchHeader.Data = response.data.Response;
                            var obj = {
                                [currentBranch.entity.Code]: {
                                    ePage: _exports
                                },
                                label: currentBranch.entity.Code,
                                code:currentBranch.entity.Code,
                                isNew: isNew
                            };

                            exports.BranchList.push(obj);
                            deferred.resolve(exports.BranchList);
                        });
                    }
                    return deferred.promise;
                }
            }
        })();
