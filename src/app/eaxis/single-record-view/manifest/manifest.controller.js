(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVManifestController", SRVManifestController);

    SRVManifestController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVManifestController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVManifestCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("manifestConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            Config.ValidationFindall();
            SRVManifestCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVManifestCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            try {
                if (SRVManifestCtrl.ePage.Masters.Entity.PK == null) {
                    OpenNewManifest();
                } else {
                    InitManifest(SRVManifestCtrl.ePage.Masters.Entity, false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        function OpenNewManifest() {
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsManifestHeader,
                        data: response.data.Response
                    };
                    InitManifest(_obj, true);
                    SRVManifestCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Outward response");
                }
            });
        }

        function InitManifest(currentManifest, IsNew) {
            SRVManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVManifestCtrl.ePage.Masters.Entity.ManifestNumber;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!IsNew) {
                    _currentManifest = currentManifest;
                } else {
                    _currentManifest = currentManifest;
                }
                GetTabDetails(_currentManifest, IsNew)
            } else {
                toastr.info('Manifest already opened ');
            }
        }
        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var _filter = {
                pageName: 'OrganizationList,TransportsConsignment,TransportItem,TransportsManifest,ConsignmentLeg'
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

        function GetTabDetails(curRecord, IsNew) {
            GetDynamicLookupConfig();
            var currentObj;

            Config.GetTabDetails(curRecord, IsNew).then(function (response) {
                SRVManifestCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVManifestCtrl.ePage.Masters.Entity.ManifestNumber) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVManifestCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            currentObj = value[value.label].ePage.Entities;
                            SRVManifestCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
