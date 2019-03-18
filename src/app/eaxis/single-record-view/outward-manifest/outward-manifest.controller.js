(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOutwardManifestController", SRVOutwardManifestController);

    SRVOutwardManifestController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig", "errorWarningService"];

    function SRVOutwardManifestController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig, errorWarningService) {
        /* jshint validthis: true */
        var SRVOutwardManifestCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("dmsManifestConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVOutwardManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            // Config.ValidationFindall();
            SRVOutwardManifestCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVOutwardManifestCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SRVOutwardManifestCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // validation findall call
            var _obj = {
                ModuleName: ["Manifest"],
                Code: [SRVOutwardManifestCtrl.ePage.Masters.Entity.ManifestNumber],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "MAN"
                },
                EntityObject: SRVOutwardManifestCtrl.ePage.Masters.Entity.Header
            };

            errorWarningService.GetErrorCodeList(_obj);

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVOutwardManifestCtrl.ePage.Masters.Entity.ManifestNumber;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVOutwardManifestCtrl.ePage.Masters.Entity.ManifestNumber) {
                            SRVOutwardManifestCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    var _curRecord = {
                        PK: SRVOutwardManifestCtrl.ePage.Masters.Entity.PK,
                        ManifestNumber: SRVOutwardManifestCtrl.ePage.Masters.Entity.ManifestNumber
                    };
                    GetTabDetails(_curRecord);
                }
            } else {
                var _curRecord = {
                    PK: SRVOutwardManifestCtrl.ePage.Masters.Entity.PK,
                    ManifestNumber: SRVOutwardManifestCtrl.ePage.Masters.Entity.ManifestNumber
                };
                GetTabDetails(_curRecord);
            }
        }

        function GetDynamicLookupConfig() {

            var _filter = {
                pageName: 'TransportsManifest'
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



        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVOutwardManifestCtrl.ePage.Masters.Entity.ManifestNumber) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVOutwardManifestCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        Init();
    }
})();
