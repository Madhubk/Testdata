(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVSupplierController", SRVSupplierController);

    SRVSupplierController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVSupplierController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVSupplierCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("sufflierFollowupConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVSupplierCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVSupplierCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVSupplierCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            SRVSupplierCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            
            /*if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId) {
                            SRVSupplierCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVSupplierCtrl.ePage.Masters.Entity.SFH_FK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            SFH_FK: SRVSupplierCtrl.ePage.Masters.Entity.SFH_FK,
                            FollowUpId: SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId,
                            Buyer: SRVSupplierCtrl.ePage.Masters.Entity.Buyer,
                            Supplier : SRVSupplierCtrl.ePage.Masters.Entity.Shipper
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVSupplierCtrl.ePage.Masters.Entity.SFH_FK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        SFH_FK: SRVSupplierCtrl.ePage.Masters.Entity.SFH_FK,
                        FollowUpId: SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId,
                        Buyer: SRVSupplierCtrl.ePage.Masters.Entity.Buyer,
                        Supplier : SRVSupplierCtrl.ePage.Masters.Entity.Shipper
                    };
                    GetTabDetails(_curRecord);
                }
            }
*/
            GetDynamicLookupConfig()
            getSFUDetails()
            CheckUserBasedMenuVisibleType()
        }


        function getSFUDetails(){
             helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, SRVSupplierCtrl.ePage.Masters.Entity.SFH_FK).then(function (response) {
                if (response.data.Response) {
                    if(SRVSupplierCtrl.ePage.Masters.Entity.SFH_FK=='null'){
                        var _obj = {
                            entity: response.data.Response.UIOrderFollowUpHeader,
                            data: response.data.Response
                        };

                        Config.Entities.Header.Data = _obj.data;
                        var obj = {
                            [_obj.entity.FollowUpId]: {
                                ePage: Config
                            },
                            label: _obj.entity.FollowUpId,
                            isNew: true
                        };
                    } else {
                        _obj = {
                            entity: response.data.Response.UIOrderFollowUpHeader,
                            data: response.data.Response
                        };
                         Config.Entities.Header.Data = _obj.data;

                        var obj = {
                            [_obj.entity.FollowUpId]: {
                                ePage: Config
                            },
                            label: _obj.entity.FollowUpId,
                            isNew: false
                        };

                    }
                SRVSupplierCtrl.ePage.Masters.CurrentObj = obj;
                Config.Entities.Header.Data.UIOrderFollowUpHeader.Buyer = SRVSupplierCtrl.ePage.Masters.Entity.Buyer;
                Config.Entities.Header.Data.UIOrderFollowUpHeader.Supplier = SRVSupplierCtrl.ePage.Masters.Entity.Shipper;
                Config.Entities.Header.Data.UIOrderFollowUpHeader.OrderNo = SRVSupplierCtrl.ePage.Masters.Entity.OrderNo;
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
                    SRVSupplierCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        SRVSupplierCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }
        
        /*function GetRecordDetails() {
            
            var _api = "PorOrderHeader/FindAll";
            var _filter = {
                "SortColumn": "POH_FollowUpId",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "FollowUpId": SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId,
                "Buyer": SRVSupplierCtrl.ePage.Masters.Entity.Buyer,
                "Supplier" : SRVSupplierCtrl.ePage.Masters.Entity.Shipper
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORDHEAD"
            };
            
            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                if (response.data.Response) {
                    
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }*/

        /*function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();
            
            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId) {
                            currentObj = value[value.label].ePage.Entities;
                            
                            currentObj.Header.Data.UIOrderFollowUpHeader.FollowUpId = SRVSupplierCtrl.ePage.Masters.Entity.FollowUpId
                            currentObj.Header.Data.UIOrderFollowUpHeader.Buyer = SRVSupplierCtrl.ePage.Masters.Entity.Buyer;
                            currentObj.Header.Data.UIOrderFollowUpHeader.Supplier = SRVSupplierCtrl.ePage.Masters.Entity.Shipper;
                            currentObj.Header.Data.UIOrderFollowUpHeader.OrderNo = SRVSupplierCtrl.ePage.Masters.Entity.OrderNo;
                            SRVSupplierCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
            console.log(SRVSupplierCtrl.ePage.Masters.CurrentObj)
        }*/

        Init();
    }
})();
