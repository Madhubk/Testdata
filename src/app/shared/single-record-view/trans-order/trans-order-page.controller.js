(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVTransOrderController", SRVTransOrderController);

    SRVTransOrderController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVTransOrderController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVTransOrderCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("outwardConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");
        function Init() {

            SRVTransOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVTransOrderCtrl.ePage.Masters.SaveButtonText = "save";
            SRVTransOrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVTransOrderCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
           
            InitOrder();
            
        }
        
        function InitOrder() {
           
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVTransOrderCtrl.ePage.Masters.Entity.WorkOrderID;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVTransOrderCtrl.ePage.Masters.Entity.WorkOrderID) {
                            SRVTransOrderCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVTransOrderCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVTransOrderCtrl.ePage.Masters.Entity.PK,
                            WorkOrderID: SRVTransOrderCtrl.ePage.Masters.Entity.WorkOrderID
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVTransOrderCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVTransOrderCtrl.ePage.Masters.Entity.PK,
                        WorkOrderID: SRVTransOrderCtrl.ePage.Masters.Entity.WorkOrderID
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }



        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader";
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
                    SRVTransOrderCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetRecordDetails() {
            var _api = "WmsTransport/FindAll";
            var _filter = {
                "SortColumn": "TPT_TransportRefNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 25,
                "WorkOrderID": SRVTransOrderCtrl.ePage.Masters.Entity.WorkOrderID
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
                        if (value.label === SRVTransOrderCtrl.ePage.Masters.Entity.WorkOrderID) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVTransOrderCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        Init();
    }
})();
