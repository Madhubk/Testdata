(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVManifestEditableController", SRVManifestEditableController);

    SRVManifestEditableController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVManifestEditableController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */

        var SRVManifestEditableCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("inwardConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {

            SRVManifestEditableCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            Config.ValidationFindall();

            SRVManifestEditableCtrl.ePage.Masters.SaveButtonText = "save";
            SRVManifestEditableCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVManifestEditableCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SRVManifestEditableCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };



            try {
                if (SRVManifestEditableCtrl.ePage.Masters.Entity.PK == null) {
                    ManifestNew();
                } else {
                    ManifestEdit();
                }
            } catch (error) {
                console.log(error);
            }
        }
        function ManifestNew() {

            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + null).then(function (response) {
                response.data.Response.Response.UIWmsInwardHeader.PK = response.data.Response.Response.PK;

                apiService.post("eAxisAPI", 'TmsManifestList/Insert', response.data.Response.Response).then(function (response) {
                    var _queryString = {
                        PK: response.data.Response.TmsManifestHeader.PK,
                        ManifestNumber: response.data.Response.TmsManifestHeader.ManifestNumber
                    };
                    GetTabDetails(_queryString);
                });
            });
        }

        function ManifestEdit() {
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVManifestEditableCtrl.ePage.Masters.Entity.ManifestNumber;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVManifestEditableCtrl.ePage.Masters.Entity.ManifestNumber) {
                            SRVManifestEditableCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVManifestEditableCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVManifestEditableCtrl.ePage.Masters.Entity.PK,
                            ManifestNumber: SRVManifestEditableCtrl.ePage.Masters.Entity.ManifestNumber
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVManifestEditableCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVManifestEditableCtrl.ePage.Masters.Entity.PK,
                        ManifestNumber: SRVManifestEditableCtrl.ePage.Masters.Entity.ManifestNumber
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function GetRecordDetails() {
            var _api = "WmsTransport/FindAll";
            var _filter = {
                "SortColumn": "TPT_TransportRefNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 25,
                "ManifestNumber": SRVManifestEditableCtrl.ePage.Masters.Entity.ManifestNumber
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "WMSTRAN"
            };

            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();
            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {

                if (response) {
                    response.map(function (value, key) {
                        if (SRVManifestEditableCtrl.ePage.Masters.Entity.PK == null) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVManifestEditableCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            if (value.label === SRVManifestEditableCtrl.ePage.Masters.Entity.ManifestNumber) {
                                currentObj = value[value.label].ePage.Entities;
                                SRVManifestEditableCtrl.ePage.Masters.CurrentObj = value;
                            }
                        }
                    });
                }
            });
        }

        Init();
    }
})();
