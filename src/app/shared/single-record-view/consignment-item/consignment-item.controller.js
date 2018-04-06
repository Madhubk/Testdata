(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVConsignmentItemController", SRVConsignmentItemController);

    SRVConsignmentItemController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVConsignmentItemController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVConsignItemCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("itemConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVConsignItemCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            Config.ValidationFindall();
            SRVConsignItemCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVConsignItemCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            try {
                if (SRVConsignItemCtrl.ePage.Masters.Entity.PK == null) {
                    OpenNewConsignItem();
                } else {
                    InitConsignItem(SRVConsignItemCtrl.ePage.Masters.Entity, false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        function OpenNewConsignItem() {
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsItemHeader,
                        data: response.data.Response
                    };
                    InitConsignItem(_obj, true);
                    SRVConsignItemCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Outward response");
                }
            });
        }

        function InitConsignItem(currentItem, IsNew) {
            SRVConsignItemCtrl.ePage.Masters.currentItem = undefined;

            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVConsignItemCtrl.ePage.Masters.Entity.ItemCode;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVConsignItemCtrl.ePage.Masters.IsTabClick = true;
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
            var DataEntryNameList = "OrganizationList,TransportsConsignment,TransportItem,TransportsManifest,ProductRelatedParty,ConsignmentLeg";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    SRVConsignItemCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetTabDetails(curRecord, IsNew) {
            GetDynamicLookupConfig();
            var currentObj;
            Config.GetTabDetails(curRecord, IsNew).then(function (response) {
                SRVConsignItemCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVConsignItemCtrl.ePage.Masters.Entity.ItemCode) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConsignItemCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConsignItemCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
