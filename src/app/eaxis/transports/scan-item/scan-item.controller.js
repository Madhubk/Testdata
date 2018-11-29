(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ScanItemController", ScanItemController);

    ScanItemController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "$filter", "dynamicLookupConfig"];

    function ScanItemController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation, $filter, dynamicLookupConfig) {

        var ScanItemCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {

            ScanItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Scan-Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
            ScanItemCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ScanItemCtrl.ePage.Masters.IsLoading = false;
            ScanItemCtrl.ePage.Masters.IsLoadingToSave = false;
            ScanItemCtrl.ePage.Masters.emptyText = "-";
            ScanItemCtrl.ePage.Masters.ScanItem = {};
            ScanItemCtrl.ePage.Masters.StoreLocation = StoreLocation;
            ScanItemCtrl.ePage.Masters.onchangemanifest = onchangemanifest;
            ScanItemCtrl.ePage.Masters.OnChangeDepot = OnChangeDepot;
            ScanItemCtrl.ePage.Masters.Save = Save;
            ScanItemCtrl.ePage.Masters.Cancel = Cancel;
            ScanItemCtrl.ePage.Masters.Reset = Reset;
            ScanItemCtrl.ePage.Masters.OpenManifest = OpenManifest;
            ScanItemCtrl.ePage.Masters.MoreManifest = MoreManifest;
            ScanItemCtrl.ePage.Masters.CloseManifest = CloseManifest;
            ScanItemCtrl.ePage.Masters.OnChangeEvent = OnChangeEvent;
            ScanItemCtrl.ePage.Masters.OnChangeConsol = OnChangeConsol;
            ScanItemCtrl.ePage.Masters.OnChangeTag = OnChangeTag;
            ScanItemCtrl.ePage.Masters.handle = handle;
            ScanItemCtrl.ePage.Masters.OnChangeItemValue = OnChangeItemValue;
            ScanItemCtrl.ePage.Masters.onchangesender = onchangesender;
            ConsolEvent();
            getOrgSender();
            GetDropDownList();
            GetDynamicLookupConfig()
            document.getElementById("SSCCID").focus();
            ScanItemCtrl.ePage.Masters.PartyDetails = "";

            ScanItemCtrl.ePage.Masters.DropDownMasterList = {};
        }

        function OnChangeItemValue() {
            ScanItemCtrl.ePage.Masters.ScanItem.Volumn = ScanItemCtrl.ePage.Masters.ScanItem.Length * ScanItemCtrl.ePage.Masters.ScanItem.Height * ScanItemCtrl.ePage.Masters.ScanItem.Width;
        }

        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var DataEntryNameList = "OrganizationList,ProductRelatedParty";
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
                    ScanItemCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["Tags"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        ScanItemCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ScanItemCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenManifest(item) {
            ScanItemCtrl.ePage.Masters.IsLoadingToSave = true;
            // open Manifest by GetbyID
            apiService.get("eAxisAPI", "TmsManifestList/GetById/" + item.PK).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ScanItemCtrl.ePage.Masters.Manifest = response.data.Response;
                    ScanItemCtrl.ePage.Masters.Manifest.TmsManifestHeader.IsModified = true;
                    // check the item is already there or not
                    var count = 0;
                    if (ScanItemCtrl.ePage.Masters.Manifest.TmsManifestItem.length > 0) {
                        angular.forEach(ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem, function (value, key) {
                            var mydata = ScanItemCtrl.ePage.Masters.Manifest.TmsManifestItem.some(function (value1, key1) {
                                return value.TIT_FK == value1.TIT_FK;
                            });
                            var newItem = {
                                TIT_FK: value.TIT_FK,
                                TMM_FK: ScanItemCtrl.ePage.Masters.Manifest.PK,
                                TMC_FK: ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsItemHeader.TMC_FK,
                                Quantity: ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem[key].Quantity
                            };

                            if (!mydata) {
                                ScanItemCtrl.ePage.Masters.Manifest.TmsManifestItem.push(newItem);
                            }
                        });
                    } else {
                        for (i = 0; i < ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem.length; i++) {
                            var newItem = {
                                TIT_FK: ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem[i].TIT_FK,
                                TMM_FK: ScanItemCtrl.ePage.Masters.Manifest.PK,
                                TMC_FK: ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsItemHeader.TMC_FK
                            };
                            ScanItemCtrl.ePage.Masters.Manifest.TmsManifestItem.push(newItem);
                        }
                    }
                    // check the Consignment NO is Already there or not 
                    // var _isExist = ScanItemCtrl.ePage.Masters.Manifest.TmsManifestConsignment.some(function (value, key) {
                    //     return value.TMC_FK === ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem[0].TMC_FK;
                    // });

                    // if (!_isExist) {
                    //     var _newcon = {
                    //         TMC_FK: ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem[0].TMC_FK,
                    //         TMM_FK: ScanItemCtrl.ePage.Masters.Manifest.PK,
                    //     };
                    //     ScanItemCtrl.ePage.Masters.Manifest.TmsManifestConsignment.push(_newcon);
                    // }

                    // Update the Consignment in API

                    apiService.post("eAxisAPI", "TmsManifestList/Update", ScanItemCtrl.ePage.Masters.Manifest).then(function SuccessCallback(response) {
                        if (response.data.Status == "Success") {
                            ScanItemCtrl.ePage.Masters.IsLoadingToSave = false;
                            ScanItemCtrl.ePage.Masters.Manifestlist = response.data.Response;
                            toastr.success("Saved Successfully...!");
                            Reset();
                        } else {
                            toastr.error("Could not Save...!");
                        }
                    });
                }
            });
        }
        function MoreManifest(item) {
            item.IsManifestVisible = true;
        }
        function CloseManifest(item) {
            item.IsManifestVisible = false;
        }
        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "SortColumn": "WUA_Code",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if(response.data.Response.length > 0){
                        ScanItemCtrl.ePage.Masters.Admin = false;
                        ScanItemCtrl.ePage.Masters.SenderDetails = response.data.Response;
                        ScanItemCtrl.ePage.Masters.ScanItem.Sender = ScanItemCtrl.ePage.Masters.SenderDetails[0].ORG_Code;
                        ScanItemCtrl.ePage.Masters.ScanItem.SenderName = ScanItemCtrl.ePage.Masters.SenderDetails[0].ORG_FullName;
                        ScanItemCtrl.ePage.Masters.ScanItem.SenderFK = ScanItemCtrl.ePage.Masters.SenderDetails[0].ROLE_FK;
                        getMHUType();    
                    }else if(response.data.Response.length == 0) {
                        ScanItemCtrl.ePage.Masters.Admin = true;
                        getDC();
                        getMHUType();  
                    }
                    // Manifestlist();
                }
            });
        }
        function getDC(){
            var _filter = {
                    "SortColumn": "ORG_Code",
                    "SortType": "DESC",
                    "PageNumber": 1,
                    "PageSize": 25,
                    "FilterType": "organization",
                    "IsDistributionCentre": true
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": "ORGHEAD"
                };
                apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        ScanItemCtrl.ePage.Masters.DCList = response.data.Response;
                    }
                });
        }
        function onchangesender(item){
            angular.forEach(ScanItemCtrl.ePage.Masters.DCList,function(value,key){
                if(value.Code == item){
                    ScanItemCtrl.ePage.Masters.ScanItem.Sender = value.Code;
                    ScanItemCtrl.ePage.Masters.ScanItem.SenderName = value.FullName
                    ScanItemCtrl.ePage.Masters.ScanItem.SenderFK = value.PK;
                    ScanItemCtrl.ePage.Masters.SenderDetails = value;
                }
            });
        }
        function getMHUType() {
            //get MHU & filter MHU type based on Sender Org
            var _filter = {
                "SortColumn": "OPR_ProductCode",
                "SortType": "DESC",
                "FilterType": "Mhu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGPRL"
            };
            apiService.post("eAxisAPI", "PrdProductRelatedParty/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ScanItemCtrl.ePage.Masters.itemlist = response.data.Response;

                    ScanItemCtrl.ePage.Masters.MHUType = $filter('filter')(ScanItemCtrl.ePage.Masters.itemlist, function (value, key) {
                        return value.ClientCode == ScanItemCtrl.ePage.Masters.ScanItem.Sender;
                    });
                    ScanItemCtrl.ePage.Masters.MHUType = $filter('orderBy')(ScanItemCtrl.ePage.Masters.MHUType, 'ProductCode');

                    ScanItemCtrl.ePage.Masters.ScanItem.ManifestType = ScanItemCtrl.ePage.Masters.MHUType[0].ProductCode;
                    onchangemanifest(ScanItemCtrl.ePage.Masters.ScanItem.ManifestType)
                }
            });
        }

        function handle(e) {
            if (e.keyCode === 13 || e.keyCode === 0) {
                StoreLocation(ScanItemCtrl.ePage.Masters.ScanItem.SSCCID)
                document.getElementById("SSCCID").blur();
            }
        }

        function StoreLocation(code) {
            // get code
            var store = code.split(",");
            ScanItemCtrl.ePage.Masters.ScanItem.StoreId = store[1];
            ScanItemCtrl.ePage.Masters.ScanItem.ItemCode = store[0];
            if (2 <= store.length && store[1] != "" && store[0] != "") {
                // get store name thru code
                //ScanItemCtrl.ePage.Masters.IsPending = true;/
                var _filter = {
                    "SortColumn": "ORG_Code",
                    "SortType": "DESC",
                    "PageNumber": 1,
                    "PageSize": 25,
                    "FilterType": "organization",
                    "OrgCode": ScanItemCtrl.ePage.Masters.ScanItem.StoreId
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": "ORGHEAD"
                };
                apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        ScanItemCtrl.ePage.Masters.OrgDetails = response.data.Response;
                        ScanItemCtrl.ePage.Masters.ScanItem.Store = ScanItemCtrl.ePage.Masters.OrgDetails[0].FullName;
                        ScanItemCtrl.ePage.Masters.ScanItem.StoreFK = ScanItemCtrl.ePage.Masters.OrgDetails[0].PK;
                    }

                    var _filter = {
                        "MappingFor_FK": ScanItemCtrl.ePage.Masters.OrgDetails[0].PK,
                        "MappingCode": "STORE_DEPOT"
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": "CFXORMAP"
                    };
                    apiService.post("eAxisAPI", "CfxOrgMapping/FindAll", _input).then(function (response) {
                        if (response.data.Status == "Success") {
                            ScanItemCtrl.ePage.Masters.PartyDetails = response.data.Response;
                            ScanItemCtrl.ePage.Masters.ScanItem.Depot = ScanItemCtrl.ePage.Masters.PartyDetails[0].ORG_MappingToCode + '-' + ScanItemCtrl.ePage.Masters.PartyDetails[0].ORG_MappingToName;
                            ScanItemCtrl.ePage.Masters.ScanItem.DepotCode = ScanItemCtrl.ePage.Masters.PartyDetails[0].ORG_MappingToCode;
                            ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK = ScanItemCtrl.ePage.Masters.PartyDetails[0].MappingTo_FK;
                            //ScanItemCtrl.ePage.Masters.IsPending = false;
                            // OnChangeDepot(ScanItemCtrl.ePage.Masters.ScanItem.Depot)
                        }
                    });
                });
            } else if (store[0] == "" && store[1]) {
                toastr.warning("SSCCID is Not Valid")
            }
            else if (store[0] && store[1] == "") {
                toastr.warning("StoreName is Not Valid")
            } else {
                toastr.warning("SSCCID & StoreName is Not Valid")
            }
        }
        function ConsolEvent() {
            var _filter = {
                "SortColumn": "ORD_ReferenceKey",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 100,

            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGREFD"
            };
            apiService.post("eAxisAPI", "OrgRefDate/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ScanItemCtrl.ePage.Masters.ConsolEvent = response.data.Response;
                    // Current Period
                    var _CurrentDate = new Date();
                    ScanItemCtrl.ePage.Masters.PresentConsolEvent = [];
                    ScanItemCtrl.ePage.Masters.PresentEvent = [];
                    ScanItemCtrl.ePage.Masters.PresentConsol = [];
                    angular.forEach(ScanItemCtrl.ePage.Masters.ConsolEvent, function (value, key) {
                        // value.AvailableFrom = $filter('date')(value.AvailableFrom, "dd/MM/yyyy");
                        // value.AvailableTo = $filter('date')(value.AvailableTo, "dd/MM/yyyy");
                        // _CurrentDate = $filter('date')(_CurrentDate, "dd/MM/yyyy");
                        value.AvailableFrom = new Date(value.AvailableFrom);
                        value.AvailableTo = new Date(value.AvailableTo);
                        if (value.AvailableFrom <= _CurrentDate && _CurrentDate <= value.AvailableTo) {
                            ScanItemCtrl.ePage.Masters.PresentConsolEvent.push(value);
                            // filtering Consol only
                            ScanItemCtrl.ePage.Masters.PresentConsol = $filter('filter')(ScanItemCtrl.ePage.Masters.PresentConsolEvent, function (value, key) {
                                return value.ReferenceKey == "Consol";
                            });
                            // filtering Event only
                            ScanItemCtrl.ePage.Masters.PresentEvent = $filter('filter')(ScanItemCtrl.ePage.Masters.PresentConsolEvent, function (value, key) {
                                return value.ReferenceKey == "Event";
                            });
                        }
                    });
                }
            });
        }
        function onchangemanifest(Type) {
            angular.forEach(ScanItemCtrl.ePage.Masters.MHUType, function (value, key) {
                if (value.ProductCode == Type) {
                    ScanItemCtrl.ePage.Masters.ScanItem.MHUFK = value.PK;
                    ScanItemCtrl.ePage.Masters.ScanItem.Length = value.Length;
                    ScanItemCtrl.ePage.Masters.ScanItem.Weight = value.Weight;
                    ScanItemCtrl.ePage.Masters.ScanItem.Height = value.Height;
                    ScanItemCtrl.ePage.Masters.ScanItem.Width = value.Width;
                    ScanItemCtrl.ePage.Masters.ScanItem.UOM = value.MeasureUQ;
                    ScanItemCtrl.ePage.Masters.ScanItem.VolumeUQ = value.MeasureUQ;
                    ScanItemCtrl.ePage.Masters.ScanItem.WeightUQ = value.WeightUQ;
                    ScanItemCtrl.ePage.Masters.ScanItem.Volumn = value.Length * value.Height * value.Width;
                }
            });
        }
        function OnChangeDepot(RelPartyCode) {
            angular.forEach(ScanItemCtrl.ePage.Masters.PartyDetails, function (value, key) {
                if (value.ORG_MappingToCode = RelPartyCode) {
                    ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK = value.MappingTo_FK;
                }
            });
        }
        function Manifestlist() {
            // get Manifest Numbers to attach Consignment  
            var _filter = {
                "SortColumn": "TMM_CreatedDateTime",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 250,
                "Sender_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.SenderFK,
                "Receiver_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK,
                "ManifestStatus": "DRF"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };
            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function SuccessCallback(response) {
                ScanItemCtrl.ePage.Masters.ManifestNolist = response.data.Response;
            });
        }
        function OnChangeConsol(itemFK) {
            angular.forEach(ScanItemCtrl.ePage.Masters.PresentConsol, function (value, key) {
                if (value.PK == itemFK) {
                    ScanItemCtrl.ePage.Masters.ScanItem.AddRef1Code = value.ReferenceValue;
                }
            });
        }
        function OnChangeEvent(itemFK) {
            angular.forEach(ScanItemCtrl.ePage.Masters.PresentEvent, function (value, key) {
                if (value.PK == itemFK) {
                    ScanItemCtrl.ePage.Masters.ScanItem.AddRef2Code = value.ReferenceValue;
                }
            });
        }
        function Save() {

            if (ScanItemCtrl.ePage.Masters.ScanItem.SSCCID == undefined) {
                // toastr.warning("Please scan valid SSCC ID");
            } else {
                var store = ScanItemCtrl.ePage.Masters.ScanItem.SSCCID.split(",");

            }

            if (store == undefined) {
                toastr.warning("Please scan valid SSCC ID");
            } else if (store[0] == "" && store[1]) {
                toastr.warning("SSCCID is Not Valid")
            } else if (store[0] && store[1] == "") {
                toastr.warning("StoreName is Not Valid")
            } else if (2 == store.length && store[1] == "" && store[0] == "") {
                toastr.warning("SSCCID & StoreName is Not Valid")
            } else if (!ScanItemCtrl.ePage.Masters.ScanItem.Store || !ScanItemCtrl.ePage.Masters.ScanItem.Depot) {
                toastr.warning("Not a valid Store & Depot")
            } else if(!ScanItemCtrl.ePage.Masters.ScanItem.ManifestType){
                toastr.warning("MHU Type is Mandatory")
            } else {
                // to show manifest repeat
                ScanItemCtrl.ePage.Masters.IsLoading = true;       // to show loading.. 

                apiService.get("eAxisAPI", "TmsItemList/GetbyID/" + null).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {

                        ScanItemCtrl.ePage.Masters.TmsItemList = response.data.Response;
                        // assigning Obj 
                        var _itemHeader = {
                            "AddRef1Code": ScanItemCtrl.ePage.Masters.ScanItem.AddRef1Code,
                            "AddRef1Type": "Consol",
                            "AddRef1_FK": ScanItemCtrl.ePage.Masters.ScanItem.ConsolFK,
                            "AddRef2Code": ScanItemCtrl.ePage.Masters.ScanItem.AddRef2Code,
                            "AddRef2Type": "Event",
                            "AddRef2_FK": ScanItemCtrl.ePage.Masters.ScanItem.EventFK,
                            "AddRef3Code": ScanItemCtrl.ePage.Masters.ScanItem.Tag,
                            "AddRef3Type": "Tag",
                            "AddRef3_FK": "",
                            "Height": ScanItemCtrl.ePage.Masters.ScanItem.Height,
                            "IsDeleted": "",
                            "IsModified": "",
                            "ItemCode": ScanItemCtrl.ePage.Masters.ScanItem.ItemCode,
                            "ItemDesc": "SSCC",
                            "ItemRefType": "MHU",
                            "ItemRef_ID": ScanItemCtrl.ePage.Masters.ScanItem.ManifestType,
                            "ItemRef_PK": ScanItemCtrl.ePage.Masters.ScanItem.MHUFK,
                            "ItemStatus": "",
                            "ItemStatusDesc": "",
                            "Length": ScanItemCtrl.ePage.Masters.ScanItem.Length,
                            "ModifiedDateTime": "",
                            "PK": ScanItemCtrl.ePage.Masters.TmsItemList.PK,
                            "ReceivedDateTime": "",
                            "ReceiverCode": ScanItemCtrl.ePage.Masters.ScanItem.StoreId,
                            "Receiver_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.StoreFK,
                            "SAP_FK": "",
                            "SenderCode": ScanItemCtrl.ePage.Masters.ScanItem.Sender,
                            "Sender_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.SenderFK,
                            "TenantCode": "",
                            "UOM": ScanItemCtrl.ePage.Masters.ScanItem.UOM,
                            "VolumeUQ": ScanItemCtrl.ePage.Masters.ScanItem.VolumeUQ,
                            "Volumn": ScanItemCtrl.ePage.Masters.ScanItem.Volumn,
                            "Weight": ScanItemCtrl.ePage.Masters.ScanItem.Weight,
                            "WeightUQ": ScanItemCtrl.ePage.Masters.ScanItem.WeightUQ,
                            "Width": ScanItemCtrl.ePage.Masters.ScanItem.Width,
                            "Quantity": 1
                        };
                        ScanItemCtrl.ePage.Masters.TmsItemList.TmsItemHeader = _itemHeader;
                        ScanItemCtrl.ePage.Masters.TmsItemList.OrgSender.PK = ScanItemCtrl.ePage.Masters.ScanItem.SenderFK;
                        ScanItemCtrl.ePage.Masters.TmsItemList.OrgSender.Code = ScanItemCtrl.ePage.Masters.ScanItem.Sender;
                        ScanItemCtrl.ePage.Masters.TmsItemList.OrgReceiver.PK = ScanItemCtrl.ePage.Masters.ScanItem.StoreFK;
                        ScanItemCtrl.ePage.Masters.TmsItemList.OrgReceiver.Code = ScanItemCtrl.ePage.Masters.ScanItem.StoreId;
                        ScanItemCtrl.ePage.Masters.TmsItemList.OrgDepot.PK = ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK;
                        ScanItemCtrl.ePage.Masters.TmsItemList.OrgDepot.Code = ScanItemCtrl.ePage.Masters.ScanItem.DepotCode;
                        SenderaddFA();
                    } else {
                        toastr.error("Could not Save...!");
                    }
                });
            }
        }
        function Cancel() {
            $state.reload();
        }
        function Reset() {
            document.getElementById("SSCCID").focus();
            ScanItemCtrl.ePage.Masters.ismanifestshows = false;
            ScanItemCtrl.ePage.Masters.ScanItem.ItemCode = "";
            ScanItemCtrl.ePage.Masters.ScanItem.Depot = "";
            ScanItemCtrl.ePage.Masters.ScanItem.StoreId = "";
            ScanItemCtrl.ePage.Masters.ScanItem.StoreFK = "";
            ScanItemCtrl.ePage.Masters.ScanItem.SSCCID = "";
            ScanItemCtrl.ePage.Masters.ScanItem.Store = "";
            ScanItemCtrl.ePage.Masters.ScanItem.EventFK = "";
            ScanItemCtrl.ePage.Masters.ScanItem.ConsolFK = "";
            ScanItemCtrl.ePage.Masters.ScanItem.Tag = "";
            ScanItemCtrl.ePage.Masters.ScanItem.Tagarray = "";
        }
        function SenderaddFA() {
            // to get Address for Job Address Obj
            var _filter = {
                "SortColumn": "OAD_Address1",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.SenderFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGADDR"
            };
            apiService.post("eAxisAPI", "OrgAddress/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ScanItemCtrl.ePage.Masters.SenderAddress = response.data.Response;
                    // obj to push sender add    
                    var _SendAd = {
                        "EntityRefKey": ScanItemCtrl.ePage.Masters.TmsItemList.PK,
                        "EntitySource": "TMS",
                        "AddressType": "SEN",
                        "ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.senderFK,
                        "OAD_Address_FK": ScanItemCtrl.ePage.Masters.SenderAddress[0].PK,
                        "Address1": ScanItemCtrl.ePage.Masters.SenderAddress[0].Address1,
                        "Address2": ScanItemCtrl.ePage.Masters.SenderAddress[0].Address2,
                        "City": ScanItemCtrl.ePage.Masters.SenderAddress[0].City,
                        "State": ScanItemCtrl.ePage.Masters.SenderAddress[0].State,
                        "JDA_RN_NKCountryCode": ScanItemCtrl.ePage.Masters.SenderAddress[0].RelatedPortCode,
                        "PostCode": ScanItemCtrl.ePage.Masters.SenderAddress[0].PostCode,
                        "Email": ScanItemCtrl.ePage.Masters.SenderAddress[0].Email,
                        "Mobile": ScanItemCtrl.ePage.Masters.SenderAddress[0].Mobile,
                        "Phone": ScanItemCtrl.ePage.Masters.SenderAddress[0].Phone,
                        "Fax": ScanItemCtrl.ePage.Masters.SenderAddress[0].Fax,
                    };
                    ScanItemCtrl.ePage.Masters.TmsItemList.JobAddress.push(_SendAd);
                    ReceiveraddFA();
                }
            });
        }
        function ReceiveraddFA() {
            // get addresssFK thru address findall (Receiver)
            var _filter = {
                "SortColumn": "OAD_Address1",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.StoreFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGADDR"
            };
            apiService.post("eAxisAPI", "OrgAddress/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ScanItemCtrl.ePage.Masters.ReceiverAddress = response.data.Response;
                    // obj to push Rec add
                    var _RecAd = {
                        "EntityRefKey": ScanItemCtrl.ePage.Masters.TmsItemList.PK,
                        "EntitySource": "TMS",
                        "AddressType": "REC",
                        "ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.StoreFK,
                        "OAD_Address_FK": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].PK,
                        "Address1": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].Address1,
                        "Address2": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].Address2,
                        "City": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].City,
                        "State": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].State,
                        "JDA_RN_NKCountryCode": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].RelatedPortCode,
                        "PostCode": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].PostCode,
                        "Email": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].Email,
                        "Mobile": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].Mobile,
                        "Phone": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].Phone,
                        "Fax": ScanItemCtrl.ePage.Masters.ReceiverAddress[0].Fax,
                    };
                    ScanItemCtrl.ePage.Masters.TmsItemList.JobAddress.push(_RecAd);
                    DepotaddFA();
                }
            });
        }
        function DepotaddFA() {
            // get addresssFK thru address findall (DEPOT)
            var _filter = {
                "SortColumn": "OAD_Address1",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
                "ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGADDR"
            };
            apiService.post("eAxisAPI", "OrgAddress/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ScanItemCtrl.ePage.Masters.DepotAddress = response.data.Response;
                    // obj to push DEP add
                    var _DepAd = {
                        "EntityRefKey": ScanItemCtrl.ePage.Masters.TmsItemList.PK,
                        "EntitySource": "TMS",
                        "AddressType": "DEP",
                        "ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK,
                        "OAD_Address_FK": ScanItemCtrl.ePage.Masters.DepotAddress[0].PK,
                        "Address1": ScanItemCtrl.ePage.Masters.DepotAddress[0].Address1,
                        "Address2": ScanItemCtrl.ePage.Masters.DepotAddress[0].Address2,
                        "City": ScanItemCtrl.ePage.Masters.DepotAddress[0].City,
                        "State": ScanItemCtrl.ePage.Masters.DepotAddress[0].State,
                        "JDA_RN_NKCountryCode": ScanItemCtrl.ePage.Masters.DepotAddress[0].RelatedPortCode,
                        "PostCode": ScanItemCtrl.ePage.Masters.DepotAddress[0].PostCode,
                        "Email": ScanItemCtrl.ePage.Masters.DepotAddress[0].Email,
                        "Mobile": ScanItemCtrl.ePage.Masters.DepotAddress[0].Mobile,
                        "Phone": ScanItemCtrl.ePage.Masters.DepotAddress[0].Phone,
                        "Fax": ScanItemCtrl.ePage.Masters.DepotAddress[0].Fax,
                    };
                    ScanItemCtrl.ePage.Masters.TmsItemList.JobAddress.push(_DepAd);
                    ItemInsert();
                }
            });
        }
        function ItemInsert() {
            apiService.post("eAxisAPI", "TmsConsignmentItemList/Insert", ScanItemCtrl.ePage.Masters.TmsItemList).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    toastr.success("Saved Successfully...!");
                    ScanItemCtrl.ePage.Masters.TmsConsignmentItemList = response.data.Response;
                    ScanItemCtrl.ePage.Masters.ismanifestshows = true;
                    ScanItemCtrl.ePage.Masters.IsLoading = false;
                    Manifestlist();
                } else if(response.data.Status == "ValidationFailed"){
                    if(response.data.Validations[0].Code == "E5571"){
                        toastr.error(response.data.Validations[0].Message);    
                        ScanItemCtrl.ePage.Masters.IsLoading = false;
                        Reset()
                    }
                }else{
                    toastr.error("Save Failed");
                }
            });
        }
        function OnChangeTag(tag) {
            angular.forEach(ScanItemCtrl.ePage.Masters.DropDownMasterList.Tags.ListSource, function (value, key) {
                if (value.Key == tag[0]) {
                    // ScanItemCtrl.ePage.Masters.ScanItem.TagFK = value.PK;
                    ScanItemCtrl.ePage.Masters.ScanItem.Tag = ScanItemCtrl.ePage.Masters.ScanItem.Tagarray.join(', ');
                }
            });
        }
        Init();
    }

})();