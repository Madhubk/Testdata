(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ScanItemController", ScanItemController);

    ScanItemController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "$filter"];

    function ScanItemController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $injector, $window, confirmation, $filter) {

        var ScanItemCtrl = this;

        function Init() {

            ScanItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Scan-Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
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
            ConsolEvent();
            getOrgSender();
            document.getElementById("SSCCID").focus();
            ScanItemCtrl.ePage.Masters.PartyDetails = "";
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
                            };
                            ScanItemCtrl.ePage.Masters.Manifest.TmsManifestItem.push(newItem);
                        }
                    }
                    // check the Consignment NO is Already there or not 
                    var _isExist = ScanItemCtrl.ePage.Masters.Manifest.TmsManifestConsignment.some(function (value, key) {
                        return value.TMC_FK === ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem[0].TMC_FK;
                    });

                    if (!_isExist) {
                        var _newcon = {
                            TMC_FK: ScanItemCtrl.ePage.Masters.TmsConsignmentItemList.TmsConsignmentItem[0].TMC_FK,
                            TMM_FK: ScanItemCtrl.ePage.Masters.Manifest.PK,
                        };
                        ScanItemCtrl.ePage.Masters.Manifest.TmsManifestConsignment.push(_newcon);
                    }

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
                    ScanItemCtrl.ePage.Masters.SenderDetails = response.data.Response;
                    ScanItemCtrl.ePage.Masters.ScanItem.Sender = ScanItemCtrl.ePage.Masters.SenderDetails[0].ORG_Code;
                    ScanItemCtrl.ePage.Masters.ScanItem.SenderName = ScanItemCtrl.ePage.Masters.SenderDetails[0].ORG_FullName;
                    ScanItemCtrl.ePage.Masters.ScanItem.SenderFK = ScanItemCtrl.ePage.Masters.SenderDetails[0].ROLE_FK;
                    getMHUType();
                    Manifestlist();
                }
            });
        }
        function getMHUType() {
            //get MHU & filter MHU type based on Sender Org
            var _filter = {
                "SortColumn": "OPR_ProductCode",
                "SortType": "DESC",
                "PageNumber": 1,
                "PageSize": 25,
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
                    ScanItemCtrl.ePage.Masters.ScanItem.ManifestType = ScanItemCtrl.ePage.Masters.MHUType[0].ProductCode;
                    onchangemanifest(ScanItemCtrl.ePage.Masters.ScanItem.ManifestType)
                }
            });
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
                    // get related Depot thru Store PK 
                    // var _filter = {
                    //     "SortColumn": "ORP_FreightDirection",
                    //     "SortType": "DESC",
                    //     "PageNumber": 1,
                    //     "PageSize": 25,
                    //     "Parent_PK" : ScanItemCtrl.ePage.Masters.OrgDetails[0].PK
                    // };
                    // var _input = {
                    //     "searchInput": helperService.createToArrayOfObject(_filter),
                    //     "FilterID": "RELPARTY"
                    // };
                    // apiService.post("eAxisAPI", "OrgRelatedPartiesMapping/FindAll", _input).then(function SuccessCallback(response) {
                    //     if (response.data.Status == "Success") {
                    //         ScanItemCtrl.ePage.Masters.PartyDetails = response.data.Response;
                    //         ScanItemCtrl.ePage.Masters.ScanItem.Depot = ScanItemCtrl.ePage.Masters.PartyDetails[0].RelatedParty_Code;
                    //         //ScanItemCtrl.ePage.Masters.IsPending = false;
                    //         OnChangeDepot(ScanItemCtrl.ePage.Masters.ScanItem.Depot)
                    //     }
                    // });
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
                            ScanItemCtrl.ePage.Masters.ScanItem.Depot = ScanItemCtrl.ePage.Masters.PartyDetails[0].ORG_MappingToCode;
                            ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK = ScanItemCtrl.ePage.Masters.PartyDetails[0].MappingTo_FK;
                            //ScanItemCtrl.ePage.Masters.IsPending = false;
                            // OnChangeDepot(ScanItemCtrl.ePage.Masters.ScanItem.Depot)
                        }
                    });
                });
            } else if (store[0] == "" && store[1]) {
                toastr.warning("StoreID is Not Valid")
            }
            else if (store[0] && store[1] == "") {
                toastr.warning("StoreName is Not Valid")
            } else {
                toastr.warning("StoreID & StoreName is Not Valid")
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
                        value.AvailableFrom = $filter('date')(value.AvailableFrom, "dd/MM/yyyy");
                        value.AvailableTo = $filter('date')(value.AvailableTo, "dd/MM/yyyy");
                        _CurrentDate = $filter('date')(_CurrentDate, "dd/MM/yyyy");
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
                    ScanItemCtrl.ePage.Masters.ScanItem.Depth = value.Depth;
                    ScanItemCtrl.ePage.Masters.ScanItem.Weight = value.Weight;
                    ScanItemCtrl.ePage.Masters.ScanItem.Height = value.Height;
                    ScanItemCtrl.ePage.Masters.ScanItem.Width = value.Width;
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
                "Sender_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.senderFK,
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
                    ScanItemCtrl.ePage.Masters.ScanItem.AddRef1Type = value.ReferanceDateType;
                }
            });
        }
        function OnChangeEvent(itemFK) {
            angular.forEach(ScanItemCtrl.ePage.Masters.PresentEvent, function (value, key) {
                if (value.PK == itemFK) {
                    ScanItemCtrl.ePage.Masters.ScanItem.AddRef2Code = value.ReferenceValue;
                    ScanItemCtrl.ePage.Masters.ScanItem.AddRef2Type = value.ReferanceDateType;
                }
            });
        }
        function Save() {
            // to show manifest repeat
            ScanItemCtrl.ePage.Masters.IsLoading = true;       // to show loading.. 
            apiService.get("eAxisAPI", "TmsItemList/GetbyID/" + null).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {

                    ScanItemCtrl.ePage.Masters.TmsItemList = response.data.Response;
                    // assigning Obj 
                    var _itemHeader = {
                        "AddRef1Code": ScanItemCtrl.ePage.Masters.ScanItem.AddRef1Code,
                        "AddRef1Type": ScanItemCtrl.ePage.Masters.ScanItem.AddRef1Type,
                        "AddRef1_FK": ScanItemCtrl.ePage.Masters.ScanItem.ConsolFK,
                        "AddRef2Code": ScanItemCtrl.ePage.Masters.ScanItem.AddRef2Code,
                        "AddRef2Type": ScanItemCtrl.ePage.Masters.ScanItem.AddRef2Type,
                        "AddRef2_FK": ScanItemCtrl.ePage.Masters.ScanItem.EventFK,
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
                        "Length": ScanItemCtrl.ePage.Masters.ScanItem.Depth,
                        "ModifiedDateTime": "",
                        "PK": ScanItemCtrl.ePage.Masters.TmsItemList.PK,
                        "ReceivedDateTime": "",
                        "ReceiverCode": ScanItemCtrl.ePage.Masters.ScanItem.StoreId,
                        "Receiver_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.StoreFK,
                        "SAP_FK": "",
                        "SenderCode": ScanItemCtrl.ePage.Masters.ScanItem.Sender,
                        "Sender_ORG_FK": ScanItemCtrl.ePage.Masters.ScanItem.SenderFK,
                        "TenantCode": "",
                        "UOM": "",
                        "VolumeUQ": "",
                        "Volumn": "",
                        "Weight": ScanItemCtrl.ePage.Masters.ScanItem.Weight,
                        "WeightUQ": "",
                        "Width": ScanItemCtrl.ePage.Masters.ScanItem.Width
                    };
                    ScanItemCtrl.ePage.Masters.TmsItemList.TmsItemHeader = _itemHeader;
                    ScanItemCtrl.ePage.Masters.TmsItemList.OrgSender.PK = ScanItemCtrl.ePage.Masters.ScanItem.SenderFK;
                    ScanItemCtrl.ePage.Masters.TmsItemList.OrgSender.Code = ScanItemCtrl.ePage.Masters.ScanItem.Sender;
                    ScanItemCtrl.ePage.Masters.TmsItemList.OrgReceiver.PK = ScanItemCtrl.ePage.Masters.ScanItem.StoreFK;
                    ScanItemCtrl.ePage.Masters.TmsItemList.OrgReceiver.Code = ScanItemCtrl.ePage.Masters.ScanItem.StoreId;
                    ScanItemCtrl.ePage.Masters.TmsItemList.OrgDepot.PK = ScanItemCtrl.ePage.Masters.ScanItem.RelatedPartyPK;
                    ScanItemCtrl.ePage.Masters.TmsItemList.OrgDepot.Code = ScanItemCtrl.ePage.Masters.ScanItem.Depot;
                    SenderaddFA();
                } else {
                    toastr.error("Could not Save...!");
                }
            });
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
            // event is pending should be add here
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
            console.log(ScanItemCtrl.ePage.Masters.TmsItemList)
            apiService.post("eAxisAPI", "TmsConsignmentItemList/Insert", ScanItemCtrl.ePage.Masters.TmsItemList).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    toastr.success("Saved Successfully...!");
                    ScanItemCtrl.ePage.Masters.TmsConsignmentItemList = response.data.Response;
                    ScanItemCtrl.ePage.Masters.ismanifestshows = true;
                    ScanItemCtrl.ePage.Masters.IsLoading = false;
                } else {
                    toastr.error("Could not Save...!");
                }
            });
        }
        Init();
    }

})();