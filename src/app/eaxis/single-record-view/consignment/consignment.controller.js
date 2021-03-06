(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVConsignmentController", SRVConsignmentController);

    SRVConsignmentController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVConsignmentController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVConsignCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("consignmentConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVConsignCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            Config.ValidationFindall();
            SRVConsignCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVConsignCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            try {
                if (SRVConsignCtrl.ePage.Masters.Entity.PK == null) {
                    OpenNewConsignment();
                } else {
                    InitConsignment(SRVConsignCtrl.ePage.Masters.Entity, false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        function OpenNewConsignment() {
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsConsignmentHeader,
                        data: response.data.Response
                    };
                    InitConsignment(_obj, true);
                    SRVConsignCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Outward response");
                }
            });
        }

        function InitConsignment(currentConsignment, IsNew) {
            SRVConsignCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVConsignCtrl.ePage.Masters.Entity.ConsignmentNumber;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVConsignCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!IsNew) {
                    _currentConsignment = currentConsignment;
                } else {
                    _currentConsignment = currentConsignment;
                }
                GetTabDetails(_currentConsignment, IsNew)
            } else {
                toastr.info('Consignment already opened ');
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
                SRVConsignCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVConsignCtrl.ePage.Masters.Entity.ConsignmentNumber) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConsignCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConsignCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
