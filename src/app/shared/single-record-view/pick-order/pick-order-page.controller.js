(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVPickOrderController", SRVPickOrderController);

    SRVPickOrderController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVPickOrderController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVPickOrderCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("outwardConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVPickOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVPickOrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVPickOrderCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            // InitOrder();
            try {
                if (SRVPickOrderCtrl.ePage.Masters.Entity.PK == null) {
                    OpenNewOrder();
                } else {
                    InitOrder(SRVPickOrderCtrl.ePage.Masters.Entity, false);
                }
            } catch (error) {
                console.log(error);
            }

        }
        function OpenNewOrder() {
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIWmsOutwardHeader,
                        data: response.data.Response.Response
                    };
                    InitOrder(_obj, true);
                    SRVPickOrderCtrl.ePage.Masters.IsNewClicked = false;
                } else {
                    console.log("Empty New Outward response");
                }
            });
        }
        function InitOrder(currentOutward, IsNew) {

            SRVPickOrderCtrl.ePage.Masters.currentOutward = undefined;

            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVPickOrderCtrl.ePage.Masters.Entity.WorkOrderID;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVPickOrderCtrl.ePage.Masters.IsTabClick = true;
                var _currentOutward = undefined;
                if (!IsNew) {
                    _currentOutward = currentOutward;
                } else {
                    _currentOutward = currentOutward;
                }
                GetTabDetails(_currentOutward, IsNew)
            } else {
                toastr.info('Pick already opened ');
            }
        }
        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var DataEntryNameList = "Warehouse,OrganizationList,CarrierServiceLevel,ProductRelatedParty,CurrencyMaster,MstContainer,OrgHeader,WarehouseLocation";
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
                    SRVPickOrderCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetTabDetails(curRecord, IsNew) {
            GetDynamicLookupConfig();
            var currentObj;

            Config.GetTabDetails(curRecord, IsNew).then(function (response) {
                SRVPickOrderCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVPickOrderCtrl.ePage.Masters.Entity.WorkOrderID) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVPickOrderCtrl.ePage.Masters.CurrentObj = value;
                        } else {
                            currentObj = value[value.label].ePage.Entities;
                            SRVPickOrderCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
