(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVManifestItemController", SRVManifestItemController);

    SRVManifestItemController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVManifestItemController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVManifestItemCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("itemConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVManifestItemCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            Config.ValidationFindall();

            SRVManifestItemCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVManifestItemCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            try {
                if (SRVManifestItemCtrl.ePage.Masters.Entity.PK == null) {
                    OpenNewManifestItem();
                } else {
                    InitManifestItem(SRVManifestItemCtrl.ePage.Masters.Entity, false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        function OpenNewManifestItem() {
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsItemHeader,
                        data: response.data.Response
                    };
                    InitManifestItem(_obj, true);
                    SRVManifestItemCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Outward response");
                }
            });
        }

        function InitManifestItem(currentItem, IsNew) {
            SRVManifestItemCtrl.ePage.Masters.currentItem = undefined;

            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVManifestItemCtrl.ePage.Masters.Entity.ItemCode;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVManifestItemCtrl.ePage.Masters.IsTabClick = true;
                var _currentItem = undefined;
                if (!IsNew) {
                    _currentItem = currentItem;
                } else {
                    _currentItem = currentItem;
                }
                GetTabDetails(_currentItem, IsNew)
            } else {
                toastr.info('Item already opened ');
            }
        }
        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var _filter = {
                pageName: 'OrganizationList,TransportsConsignment,TransportItem,TransportsManifest,ProductRelatedParty,ConsignmentLeg'
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
                SRVManifestItemCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVManifestItemCtrl.ePage.Masters.Entity.ItemCode) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVManifestItemCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            currentObj = value[value.label].ePage.Entities;
                            SRVManifestItemCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
