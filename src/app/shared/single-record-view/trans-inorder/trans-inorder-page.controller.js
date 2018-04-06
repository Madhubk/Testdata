(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVTransinOrderController", SRVTransinOrderController);

    SRVTransinOrderController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVTransinOrderController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        
        var SRVTransinOrderCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("inwardConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");
    function Init() {
            
            SRVTransinOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVTransinOrderCtrl.ePage.Masters.SaveButtonText = "save";
            SRVTransinOrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVTransinOrderCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            console.log(SRVTransinOrderCtrl.ePage.Masters);
            SRVTransinOrderCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };


       
            try {
                if (SRVTransinOrderCtrl.ePage.Masters.Entity.PK == null) {
                    TransinOrder();
                } else {
                    InitOrder();
                }
            } catch (error) {
                console.log(error);
            }
        }
        function TransinOrder() {
            
            apiService.get("eAxisAPI", 'WmsInwardList/GetById/' + null).then(function (response) {
                response.data.Response.Response.UIWmsInwardHeader.PK = response.data.Response.Response.PK;

                apiService.post("eAxisAPI", 'WmsInwardList/Insert', response.data.Response.Response).then(function (response) {
                    var _queryString = {
                        PK: response.data.Response.UIWmsInwardHeader.PK,
                        WorkOrderID: response.data.Response.UIWmsInwardHeader.WorkOrderID
                    };
                    GetTabDetails(_queryString);
                });
            });
        }
        function InitOrder() {
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVTransinOrderCtrl.ePage.Masters.Entity.WorkOrderID;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVTransinOrderCtrl.ePage.Masters.Entity.WorkOrderID) {
                            SRVTransinOrderCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVTransinOrderCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVTransinOrderCtrl.ePage.Masters.Entity.PK,
                            WorkOrderID: SRVTransinOrderCtrl.ePage.Masters.Entity.WorkOrderID
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVTransinOrderCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVTransinOrderCtrl.ePage.Masters.Entity.PK,
                        WorkOrderID: SRVTransinOrderCtrl.ePage.Masters.Entity.WorkOrderID
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
                    SRVTransinOrderCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
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
                "WorkOrderID": SRVTransinOrderCtrl.ePage.Masters.Entity.WorkOrderID
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
                         if (SRVTransinOrderCtrl.ePage.Masters.Entity.PK == null) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVTransinOrderCtrl.ePage.Masters.CurrentObj = value;
                        }else {
                            if (value.label === SRVTransinOrderCtrl.ePage.Masters.Entity.WorkOrderID) {
                                currentObj = value[value.label].ePage.Entities;
                                SRVTransinOrderCtrl.ePage.Masters.CurrentObj = value;
                            }
                        }
                    });
                }
                console.log(SRVTransinOrderCtrl.ePage.Masters.CurrentObj);
            });
        }

        Init();
    }
})();
