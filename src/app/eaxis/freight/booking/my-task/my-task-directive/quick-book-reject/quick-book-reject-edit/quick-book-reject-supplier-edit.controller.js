(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookRejectSupplierEditDirectiveController", QuickBookRejectSupplierEditDirectiveController);

    QuickBookRejectSupplierEditDirectiveController.$inject = ["$scope", "$q", "$window", "$uibModal", "$injector", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "errorWarningService"];

    function QuickBookRejectSupplierEditDirectiveController($scope, $q, $window, $uibModal, $injector, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, errorWarningService) {
        var QuickBookRejectSupplierEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Rejection_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            // DatePicker
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            TaskGetById();
            GetRelatedLookupList();
        }

        function TaskGetById() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.TaskObj = QuickBookRejectSupplierEditDirectiveCtrl.taskObj;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.modeChange = ModeChange;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.submitBooking = SubmitBooking;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.addLineItem = AddLineItem
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.singleRecordView = SingleRecordView
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.deAttachOrder = DeAttachOrder
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking"
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.Loaded = false

            //Container
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj = {};
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.addContainer = AddContainer;
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.deleteContainer = DeleteContainer;
            // //Packlines
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj = {};
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.JobLocation = [];
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.PkgCntMapping = [];
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.JobDangerousGoods = [];
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.packageAdd = PackageAdd;
            // QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.deletePackage = DeletePackage;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
            // error warning modal
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            GetGridConfig()


            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    OrgInit();
                    cfxTypeList();
                    cfxContainerType()
                    getPackType();
                    getAttachedOrders()
                    getServices();
                    getContainers();
                    getPackLines();
                    // getJobSailing();
                    // getDocuments();
                    initValidation()
                    StandardMenuConfig()
                    var obj = {
                        [QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                            ePage: QuickBookRejectSupplierEditDirectiveCtrl.ePage
                        },
                        label: QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        code: QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                    };
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.TabObj = obj
                    console.log(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.TabObj)
                }
            });
        }

        function StandardMenuConfig() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails = []
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "EntitySource": "SHP",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ContainerHeader = {
                "HeaderProperties": [{
                        "columnname": "Container Count",
                        "isenabled": true,
                        "property": "containercount",
                        "position": "1",
                        "width": "300",
                        "display": false
                    },
                    {
                        "columnname": "Container Type",
                        "isenabled": true,
                        "property": "containertype",
                        "position": "2",
                        "width": "300",
                        "display": false
                    },
                    {
                        "columnname": "Commodity",
                        "isenabled": true,
                        "property": "Commodity",
                        "position": "3",
                        "width": "300",
                        "display": false
                    }
                ],
                "containercount": {
                    "isenabled": true,
                    "position": "1",
                    "width": "300"
                },
                "containertype": {
                    "isenabled": true,
                    "position": "2",
                    "width": "300"
                },
                "Commodity": {
                    "isenabled": true,
                    "position": "3",
                    "width": "300"
                }
            };
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdCarrierPlanning_2834,OrdVesselPlanning_3187,VesselPOL_3309,VesselPOD_3310",
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

        function cfxTypeList() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList = {}
            var typeCodeList = ["INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "HEIGHTUNIT", "FREIGHTTERMS"];
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
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                typeCodeList.map(function (value, key) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList[value] = response.data.Response[value];
                });
            });

        }

        function cfxContainerType() {
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType = response.data.Response
                    var obj = _.filter(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.CntType, {
                        'Key': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function getPackType() {
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.cfxTypeList.PackType = response.data.Response;
                }
            });
        }

        function ModeChange(obj) {
            if (obj) {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm()
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode, 'E0002', false)
        }

        function OrgInit() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;

            var defaultOrg = Getfullorg(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
            defaultOrg.then(function (val) {
                OnSelectShipper(val[0])
                getOpenOrders()
            });
        }

        function Getfullorg(viewValue) {
            var _inputObj = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "Code": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                return QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address1 = res[0].Address1;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].Country;
                    var tempAddrObj = _.filter(res, {
                        'PK': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK
                    })[0];
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = tempAddrObj
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                    if (tempAddrObj) {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    }

                } else {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    var tempSupConObj = _.filter(res, {
                        'PK': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK
                    })[0];
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContact = tempSupConObj;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = tempSupConObj.Title + "\n" + tempSupConObj.Email + "\n" + tempSupConObj.Phone;
                    if (tempSupConObj) {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    }
                } else {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;

                    var tempBuyObj = _.filter(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj)
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.Loaded = true
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.Buyer = $item;
                getOpenOrders()
                getMDMDefaulvalues()
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].Country;
                        var tempAddrObj = _.filter(res, {
                            'PK': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK
                        })[0];
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = tempAddrObj
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = tempAddrObj.Address1 + "\n" + tempAddrObj.Address2 + "\n" + tempAddrObj.City + "\n" + tempAddrObj.State + "\n" + tempAddrObj.PostCode + "\n" + tempAddrObj.Phone + "\n" + tempAddrObj.Fax
                        if (tempAddrObj) {
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                        }
                    } else {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        var tempContactObj = _.filter(res, {
                            'PK': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK
                        })[0];
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContact = tempContactObj
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = tempContactObj.Title + "\n" + tempContactObj.Email + "\n" + tempContactObj.Phone
                        if (tempContactObj) {
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                        }
                    } else {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.buyerName = "";
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = ""
            }
        }

        function getMDMDefaulvalues() {
            if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;
                }
            }
        }

        function GetOrgAddress(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK
            } else {
                _pk = item.ORG_Buyer
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                return QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function GetOrgContact(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK
            } else {
                _pk = item.ORG_Buyer
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            }
            return apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                return QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getServices() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }

            apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                    if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                        for (var i in QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                'ServiceCode': QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100,
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }

        function getContainers() {

            var _inputObj = {
                "SHP_BookingOnlyLink": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
                }
            });
        }


        // function AddContainer() {
        //     ContainerValidation()
        //     if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer.length == 0) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj.SHP_BookingOnlyLink = QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj.IsDeleted = false
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.push(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj);
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj = {};
        //     }
        // }

        // function ContainerValidation() {

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj.ContainerCount, 'E0008', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj.RC_Type, 'E0009', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.CntObj.RH_NKContainerCommodityCode, 'E0010', false);
        // }

        // function DeleteContainer(item, index) {
        //     var _index = QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.splice(index, 1);
        //     } else {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer[index].IsDeleted = true
        //     }
        // }

        function getPackLines() {

            var _inputObj = {
                "SHP_FK": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
                }
            });
        }


        // function PackageAdd() {
        //     PackageValidation()
        //     if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage == 0) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.SHP_FK = QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK;
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.FreightMode = 'OUT';
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.IsDeleted = false
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj);
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj = {};
        //     }
        // }

        // function PackageValidation() {

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.PackageCount, 'E0011', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.F3_NKPackType, 'E0012', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeight, 'E0013', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualWeightUQ, 'E0014', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolume, 'E0015', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.ActualVolumeUQ, 'E0016', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.Length, 'E0017', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.Width, 'E0018', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.Height, 'E0019', false);

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package', QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.PackObj.UnitOfDimension, 'E0020', false);

        // }

        // function DeletePackage(item, index) {
        //     var _index = QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(index, 1);
        //     } else {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[index].IsDeleted = true
        //     }
        // }


        // function getJobSailing() {

        //     var _filter = {
        //         "EntityRefKey": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             response.data.Response.map(function (val, key) {
        //                 var obj = {
        //                     "IsDeleted": false,
        //                     "UIJobSailing": {
        //                         "PK": val.JBS_FK,
        //                         "LCLCutOff": val.CargoCutOffDate
        //                     },
        //                     "UIJobRoutes": {
        //                         "PK": val.PK,
        //                         "CarrierOrg_Code": val.CarrierOrg_Code,
        //                         "Vessel": val.Vessel,
        //                         "VoyageFlight": val.VoyageFlight,
        //                         "ETD": val.ETD,
        //                         "ETA": val.ETA,
        //                         "DocumentCutOffDate": val.DocumentCutOffDate,
        //                         "CarrierReference": val.CarrierReference
        //                     }
        //                 }
        //                 QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList.push(obj)
        //             })
        //         }
        //     });
        // }

        // function getDocuments() {
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.Documents = {};
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.fileDetails = [];
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.fileSize = 10;
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;

        //     var _additionalValue = {
        //         "Entity": "Shipment",
        //         "Path": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
        //     };

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.docdownloadDoc = DocdownloadDoc;
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.removeDocument = RemoveDocument;
        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails = [];

        //     GetDocType();
        //     getJobDocuments()
        // }

        // function GetDocType() {
        //     var _filter = {
        //         "EntitySource": "CONFIGURATION",
        //         "SourceEntityRefKey": "DocType",
        //         "Key": "Shipment"
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
        //         if (response.data.Response) {
        //             if (response.data.Response.length > 0) {
        //                 var _response = response.data.Response[0];
        //                 if (!_response.Value) {
        //                     _response.Value = "GEN";
        //                 }
        //                 GetDocumentTypeList(_response.Value);
        //             } else {
        //                 GetDocumentTypeList("GEN");
        //             }
        //         }
        //     });
        // }

        // function getJobDocuments() {
        //     var _input = {
        //         "EntityRefKey": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //         "EntitySource": "SHP",
        //         "EntityRefCode": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //         "Status": "Success"
        //     };

        //     var inputObj = {
        //         "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
        //         "searchInput": helperService.createToArrayOfObject(_input)
        //     }
        //     apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails = response.data.Response;
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments = response.data.Response;
        //     });
        // }


        // function GetDocumentTypeList($item) {
        //     var _filter = {
        //         DocType: $item
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             var _list = response.data.Response;
        //             var _obj = {
        //                 DocType: "ALL",
        //                 Desc: "All"
        //             };

        //             _list.push(_obj);
        //             _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

        //             QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
        //         }
        //     });
        // }

        // function GetSelectedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         var _obj = {
        //             type: value1.type,
        //             FileName: value1.name,
        //             IsActive: true,
        //             DocumentType: docType.DocType,
        //             DocumentName: docType.Desc,
        //             Status: "Success",
        //             IsNew: true,
        //             IsDeleted: false,
        //             UploadedDateTime: new Date()
        //         };
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
        //     });

        // }

        // function GetUploadedFiles(Files, docType) {
        //     Files.map(function (value1, key1) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
        //             if (value1.FileName == value2.FileName && value1.DocType == value2.type) {
        //                 SaveDocument(value1, value2);
        //             }
        //         });
        //     });
        // }

        // function SaveDocument($item, row) {
        //     var _input = {};
        //     if ($item) {
        //         var _index = $item.FileName.indexOf(".");
        //         if (_index != -1) {
        //             var _object = $item.FileName.split(".")[0];
        //         }

        //         var _input = {
        //             FileName: $item.FileName,
        //             FileExtension: $item.FileExtension,
        //             ContentType: $item.DocType,
        //             IsActive: true,
        //             IsModified: true,
        //             IsDeleted: false,
        //             DocFK: $item.Doc_PK,
        //             EntitySource: 'SHP',
        //             EntityRefKey: QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
        //             EntityRefCode: QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
        //             DocumentName: _object,
        //             DocumentType: row.DocumentType
        //         };
        //     }
        //     _input.Status = "Success"

        //     QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments.push(_input)
        //     row.IsNew = false;

        // }

        // function DocdownloadDoc(doc) {
        //     apiService.getEaxis('JobDocument/DownloadFile/' + doc.PK + '/c0b3b8d9-2248-44cd-a425-99c85c6c36d8').then(function (response) {
        //         if (response.data.Response) {
        //             if (response.data.Response !== "No Records Found!") {
        //                 appService.downloadDocument(response.data.Response);
        //             }
        //         } else {}
        //     });
        // }

        // function RemoveDocument(item, index) {
        //     var _index = QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value, key) {
        //         return value.PK;
        //     }).indexOf(item.PK);
        //     if (_index == -1) {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.splice(index, 1);
        //     } else {
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].Status = "Deleted"
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsActive = true
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsModified = true
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails[index].IsDeleted = true
        //         QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobDocuments[index].IsDeleted = true;
        //     }
        // }

        function getOpenOrders() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions = {
                "IsShpCreated": "false",
                "SortColumn": "POH_CreatedDateTime",
                "SortType": "DESC",
                "Buyer": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code,
                "Supplier": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            };
            GetGridConfig();
            getDataAsynPage(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions)
        }

        function GetGridConfig() {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.column = [

                {
                    "field": "OrderNo",
                    "displayName": "Open POs",
                    "width": 135,
                },
                {
                    "field": "OrderDate",
                    "displayName": "PO Date",
                    "width": 70,
                    cellTemplate: "<div class='padding-5'><span  title='{{row.entity.OrderDate}}' >{{row.entity.OrderDate | date:'dd-MMM-yy'}}</span></div>"
                },

                {
                    "field": "GoodsAvailableAt",
                    "displayName": "Origin",
                    "width": 65,
                    // cellTemplate: "<div class='gridCellStyle'><span  title='{{row.entity.GoodsOrigin}}' >{{row.entity.GoodsOrigin}}</span></div>"
                },
                {
                    "field": "GoodsDeliveredTo",
                    "displayName": "Dstn.",
                    "width": 65,
                    // cellTemplate: "<div class='gridCellStyle'><span  title='{{row.entity.GoodsDestination}}' >{{row.entity.GoodsDestination}}</span></div>"
                },
                {
                    "field": "GoodsDeliveredTo",
                    "displayName": "Attach.",
                    "width": 50,
                    cellTemplate: "<div class='padding-5' style='height:30px;'><a href='' ng-click='grid.appScope.QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.addLineItem(row.entity,rowRenderIndex)'><i style='font-size: 16px;' class='fa fa-arrow-circle-right'></i></a></div>"
                }
            ];
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.gridOptions = {
                enableSorting: true,
                enableGridMenu: false,
                enableColumnMenus: true,
                useExternalSorting: true,
                headerRowHeight: 30,
                rowHeight: 30,
                cellTooltip: true,
                enableColumnResizing: true,
                columnDefs: QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.column,
                data: QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = null;
                        } else {
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions.sortType = sortColumns[0].sort.direction;
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions.sortColumn = "POH_" + sortColumns[0].field;
                        }
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.IsLoading = true
                        getDataAsynPage(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.paginationOptions);
                    });
                }
            };
        }

        function getDataAsynPage(obj) {

            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(obj)
            }
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.gridOptions.data = []
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.IsLoading = true
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data = response.data.Response
                    if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data.length === 0) {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data = [];
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.IsNoRecords = true;
                }
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.IsLoading = false
                GetGridConfig()
            });


        }

        function AddLineItem(row, index, bool) {
            var paramObj = {
                "row": row,
                "index": index,
                "shipment": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data,
                "order": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data,
                "edit": bool
            }
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: 'static',
                windowClass: 'orderLineItem',
                templateUrl: 'app/eaxis/freight/booking-branch/booking-branch-directive/tabs/orderline-popup.html',
                controller: 'OrderLinePopupController',
                controllerAs: 'OrderLinePopupCtrl',
                resolve: {
                    items: function () {
                        return paramObj;
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () {

            });

        }

        function DeAttachOrder(row, index) {
            if (row.SHP_FK != null || row.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data.push(row)
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders[index].IsDeleted = true
            } else {
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.data.push(row)
                QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders.splice(index, 1)
            }
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }



        function AutoCompleteOnSelect($item, model, code, IsArray) {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange('MyTask', QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, $item, code, IsArray);
        }



        function SubmitBooking() {
            GeneralValidation(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    var _array = [];
                    for (var i in QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList) {
                        if (i !== "CfxTypeList") {
                            _array.push(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[i]);
                        }
                    }
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress = [];
                    _array.map(function (value, key) {
                        QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobAddress.push(value);
                    });
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Please wait..";
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = true;
                    // update ooking details 
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data = filterObjectUpdate(QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data, "IsModified");
                    apiService.post("eAxisAPI", appConfig.Entities.Booking.API.Update.Url, QuickBookRejectSupplierEditDirectiveCtrl.ePage.Entities.Header.Data).then(function (response) {
                        if (response.data.Response) {
                            TaskComplete();
                            toastr.success("Succeesfully saved...");
                        } else {
                            toastr.error("Save failed...");
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking";
                            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false;
                        }
                    });
                } else {

                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function JobInsertInput(type, _input, obj) {
            var _jobInput = {
                "PK": "",
                "EntityRefKey": obj.PK,
                "EntitySource": "SHP",
                "CommentsType": type,
                "Comments": obj[_input + "Comments"]
            }
            obj.UIJobComments.push(_jobInput);
            obj[_input + "Comments"] = ''
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

        function initValidation() {

            if (QuickBookRejectSupplierEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container');
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package');
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing');
                errorWarningService.AddModuleToList("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
            }
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo];
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListContainer = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'].GlobalErrorWarningList;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjContainer = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Container'];
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListPackage = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'].GlobalErrorWarningList;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjPackage = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Package'];
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListSailing = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing'].GlobalErrorWarningList;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjSailing = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing'];
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListDoc = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'].GlobalErrorWarningList;
            QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjDoc = errorWarningService.Modules.MyTask.Entity[QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'];
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function GeneralValidation($item) {
            var _input = $item;
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Shipper_Code, 'E0031', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ORG_Consignee_Code, 'E0032', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PackingMode, 'E0002', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.IncoTerm, 'E0003', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Origin, 'E0004', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfLoading, 'E0006', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.PortOfDischarge, 'E0007', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.Destination, 'E0005', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.HBLAWBChargesDisplay, 'E0039', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ExportForwarder_Code, 'E0047', false, undefined);
            errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.UIShipmentHeader.ImportForwarder_Code, 'E0048', false, undefined);
            // errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.JobComments, 'E0035', false, undefined);
            var tempArrayDoc = []
            if (_input.UIShipmentHeader.BookingType == 'CB') {
                if (QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {

                        if (val.DocumentType == 'PKL' || val.DocumentType == 'INP' || val.DocumentType == 'CIV') {
                            tempArrayDoc.push(val);
                        }
                    });

                    if (tempArrayDoc.length > 0) {
                        errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
                    } else {
                        errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                    }


                } else {
                    errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0038', false, undefined);
                }
            } else {
                errorWarningService.OnFieldValueChange("MyTask", QuickBookRejectSupplierEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0038', false, undefined);
            }




            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function TaskComplete() {
            var _input = {
                "CompleteInstanceNo": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
            };
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Taske Completed successfully...");
                    QuickBookRejectSupplierEditDirectiveCtrl.onComplete(QuickBookRejectSupplierEditDirectiveCtrl.taskObj)
                    QuickBookRejectSupplierEditDirectiveCtrl.onRefreshStatusCount()
                    QuickBookRejectSupplierEditDirectiveCtrl.onRefreshTask()
                } else {
                    toastr.error("Save failed...");
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBookingDisabled = false;
                    QuickBookRejectSupplierEditDirectiveCtrl.ePage.Masters.SaveBooking = "Submit Booking(Q)";
                }
            });
        }
        Init();
    }
})();