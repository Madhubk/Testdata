(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVConController", SRVConController);

    SRVConController.$inject = ["$location", "$timeout","$injector", "apiService", "helperService", "toastr", "appConfig", "errorWarningService","consolidationConfig","authService"];

    function SRVConController($location,$timeout, $injector, apiService, helperService, toastr, appConfig, errorWarningService,consolidationConfig,authService) {
        /* jshint validthis: true */
        var SRVConCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("consolidationConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVConCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVConCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
           SRVConCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SRVConCtrl.ePage.Masters.DataEntryObject = "ConsolHeader";
            SRVConCtrl.ePage.Masters.Config = consolidationConfig
            SRVConCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true,
                "data-event": true
            };
            // Save
            SRVConCtrl.ePage.Masters.Save = Save;
            SRVConCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVConCtrl.ePage.Masters.IsDisableSave = false;
            SRVConCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVConCtrl.ePage.Masters.Entity.Code;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVConCtrl.ePage.Masters.Entity.Code) {
                            SRVConCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVConCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVConCtrl.ePage.Masters.Entity.PK,
                            ConsolNo: SRVConCtrl.ePage.Masters.Entity.Code
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVConCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVConCtrl.ePage.Masters.Entity.PK,
                        ConsolNo: SRVConCtrl.ePage.Masters.Entity.Code
                    };
                    GetTabDetails(_curRecord);
                }
            }
            GetRelatedLookupList();
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "ConsolAttachShipment_3232,VesselLoadPort_3090,OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader",
                SAP_FK: authService.getUserInfo().AppPK
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

        function GetRecordDetails() {
            var _filter = {
                "SortColumn": "CON_ConsolNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 5,
                "ConsolNo": SRVConCtrl.ePage.Masters.Entity.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConConsolHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConConsolHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
           // GetDynamicLookupConfig();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {                    
                    response.map(function (value, key) {
                        if (value.label === SRVConCtrl.ePage.Masters.Entity.Code) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVConCtrl.ePage.Masters.CurrentObj = value;

                            var _obj = {
                                ModuleName: ["Consolidation"],
                                Code: [value.label],
                                API: "Group",
                                FilterInput: {
                                    ModuleCode: "CON",
                                    SubModuleCode: "CON",
                                },
                                GroupCode: "CON_GENERAL",
                                RelatedBasicDetails: [{
                                    // "UIField": "TEST",
                                    // "DbField": "TEST",
                                    // "value": "TEST"
                                }],
                                EntityObject: currentObj
                            };
                            errorWarningService.GetErrorCodeList(_obj);
                        }
                    });
                }
            });
        }
     
        // $timeout(function () {
        //     var _errorcount = errorWarningService.Modules.Consolidation.Entity[value.code].GlobalErrorWarningList;
        //     if (_errorcount.length > 0) {
        //         SRVConCtrl.ePage.Masters.Config.ShowErrorWarningModal(value);
        //     } else {
        //         Save(value)
        //     }
        // });

        function Save(value) {            
            SRVConCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            SRVConCtrl.ePage.Masters.IsDisableSave = true;
            var _Data = value[value.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (value.isNew) {
                _input.UIConConsolHeader.PK = _input.PK;
                _input.UIConsolExtendedInfo = {}
            } else {
                value = filterObjectUpdate(value, "IsModified");
            }

            helperService.SaveEntity(value, 'Consol').then(function (response) {
                if (response.Status === "success") {
                    consolidationConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == SRVConCtrl.ePage.Masters.currentConsol) {
                                value.label = SRVConCtrl.ePage.Masters.currentConsol;
                                value[SRVConCtrl.ePage.Masters.currentConsol] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(SRVConCtrl.ePage.Masters.currentConsol);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        } else {
                            consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        consolidationConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    toastr.success("Saved Successfully");
                } else if (response.Status === "failed") {
                    toastr.error("Save Failed");
                }

                SRVConCtrl.ePage.Masters.SaveButtonText = "Save";
                SRVConCtrl.ePage.Masters.IsDisableSave = false;
            });
        }
        

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }
})();