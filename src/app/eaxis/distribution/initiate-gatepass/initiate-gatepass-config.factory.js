(function () {
    "use strict";

    angular
        .module("Application")
        .factory('gatepassConfig', GatepassConfig);

    GatepassConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "errorWarningService"];

    function GatepassConfig($location, $q, helperService, apiService, toastr, errorWarningService) {

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
                            "Url": "TMSGatepassList/GetById/"
                        },
                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                        "OrgHeader": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeader/FindAll",
                            "FilterID": "ORGHEAD"
                        },
                        "MstContainer": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "MstContainer/FindAll",
                            "FilterID": "MSTCONT"
                        },
                        "TmsManifestList": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/GetById/",
                        },
                    },
                    "Meta": {


                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ShowErrorWarningModal": ShowErrorWarningModal
        };

        return exports;

        function GetTabDetails(currentGatepass, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertGatepass": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TMSGatepassList/Insert"
                            },
                            "UpdateGatepass": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TMSGatepassList/Update"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "OrgHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/FindAll",
                                "FilterID": "ORGHEAD"
                            },
                            "MstContainer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstContainer/FindAll",
                                "FilterID": "MSTCONT"
                            },
                            "GenerateReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Communication/GenerateReport",
                            },
                        },

                        "Meta": {
                            "MenuList": [],
                            "ORG_Code": helperService.metaBase(),
                            "TransporterCode": helperService.metaBase(),
                            "Purpose": helperService.metaBase(),
                            "VehicleType": helperService.metaBase(),
                            "VehicleNo": helperService.metaBase(),
                            "DriverName": helperService.metaBase(),
                            "DriverContactNo": helperService.metaBase()
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                            "IsConsignmentAttach": false
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentGatepass.data;
                _exports.Entities.Header.GetById = currentGatepass.data;
                _exports.Entities.Header.Validations = currentGatepass.Validations;

                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentGatepass.GatepassNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentGatepass.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentGatepass.GatepassNo]: {
                            ePage: _exports
                        },
                        label: currentGatepass.GatepassNo,
                        code: currentGatepass.GatepassNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            var str = EntityObject.code.replace(/\//g, '');
            $("#errorWarningContainer" + str).toggleClass("open");
        }
    }
})();


