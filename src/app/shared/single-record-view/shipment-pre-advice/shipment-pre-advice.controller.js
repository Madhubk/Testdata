(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVPreAdviceController", SRVPreAdviceController);

    SRVPreAdviceController.$inject = ["$location", "$injector", "authService", "apiService", "helperService", "appConfig"];

    function SRVPreAdviceController($location, $injector, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var SRVPreAdviceCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("preAdviceConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVPreAdviceCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVPreAdviceCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVPreAdviceCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SRVPreAdviceCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            
            GetDynamicLookupConfig();
            GetPreAdviceDetails();
        }

        function GetPreAdviceDetails() {
            helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, SRVPreAdviceCtrl.ePage.Masters.Entity.SPH_FK).then(function (response) {
                if (response.data.Response) {
                    if(SRVPreAdviceCtrl.ePage.Masters.Entity.SPH_FK=='null'){
                        var _obj = {
                            entity: response.data.Response.UIPreAdviceHeader,
                            data: response.data.Response
                        };

                        Config.Entities.Header.Data = _obj.data;
                        var obj = {
                            [_obj.entity.PreAdviceId]: {
                                ePage: Config
                            },
                            label: _obj.entity.PreAdviceId,
                            isNew: true
                        };
                    } else {
                        _obj = {
                            entity: response.data.Response.UIPreAdviceHeader,
                            data: response.data.Response
                        };
                         Config.Entities.Header.Data = _obj.data;

                        var obj = {
                            [_obj.entity.PreAdviceId]: {
                                ePage: Config
                            },
                            label: _obj.entity.PreAdviceId,
                            isNew: false
                        };

                    }
                SRVPreAdviceCtrl.ePage.Masters.CurrentObj = obj;
                Config.Entities.Header.Data.UIPreAdviceHeader.Buyer = SRVPreAdviceCtrl.ePage.Masters.Entity.Buyer;
                Config.Entities.Header.Data.UIPreAdviceHeader.Supplier = SRVPreAdviceCtrl.ePage.Masters.Entity.Shipper;
                Config.Entities.Header.Data.UIPreAdviceHeader.PK = SRVPreAdviceCtrl.ePage.Masters.Entity.PK;
                } else {
                    console.log("Empty New Order response");
                }
            });
        }
        
        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,MDM_CarrierList";
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
                    SRVPreAdviceCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
