(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyBookingEditDirectiveController", VerifyBookingEditDirectiveController);

    VerifyBookingEditDirectiveController.$inject = ["$q", "$scope", "$uibModal", "$injector", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "errorWarningService", "$filter"];

    function VerifyBookingEditDirectiveController($q, $scope, $uibModal, $injector, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, confirmation, errorWarningService, $filter) {
        var VerifyBookingEditDirectiveCtrl = this;
        var dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            VerifyBookingEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Verify_Booking_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            // DatePicker
            VerifyBookingEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            VerifyBookingEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            VerifyBookingEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            VerifyBookingEditDirectiveCtrl.ePage.Masters.SaveBookingApprovalDisabled = false;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.SaveBookingVerifiedDisabled = false;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.SaveBookingApproval = "Send For Booking Approval";
            VerifyBookingEditDirectiveCtrl.ePage.Masters.SaveBookingVerified = "Confirm Carrier";
            // functions
            VerifyBookingEditDirectiveCtrl.ePage.Masters.MyTask = VerifyBookingEditDirectiveCtrl.taskObj;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.submitTask = SubmitTask;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            TaskGetById();
            GetRelatedLookupList();
            initValidation();
            VerifyBookingEditDirectiveCtrl.ePage.Masters.Loaded = false
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            VerifyBookingEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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

        function AutoCompleteOnSelect($item, model, code, IsArray) {
            OnChangeValues(model, code, IsArray);
        }

        function SelectedLookupData($item, model, code, IsArray, val) {
            OnChangeValues($item.data.entity[val], code, IsArray);
        }

        function TaskGetById() {
            if (VerifyBookingEditDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VerifyBookingEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;

                        OrgInit();
                        getAttachedOrders();
                        getServices();
                        getContainers();
                        getPackLines();
                        getJobSailing()
                        StandardMenuConfig()
                        var obj = {
                            [VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                                ePage: VerifyBookingEditDirectiveCtrl.ePage
                            },
                            label: VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                            code: VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
                        };
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.TabObj = obj
                    }
                });
            }
        }

        function OrgInit() {
            VerifyBookingEditDirectiveCtrl.ePage.Masters.getfullorg = Getfullorg;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.onSelectShipper = OnSelectShipper;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.onSelectBuyer = OnSelectBuyer;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.changeShipperBuyerAddressType = ChangeShipperBuyerAddressType;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.changeShipperBuyerContact = ChangeShipperBuyerContact;
            var defaultOrg = Getfullorg(VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
            defaultOrg.then(function (val) {
                OnSelectShipper(val[0]);
            });
        }

        function Getfullorg(viewValue) {
            var _inputObj = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "OrgCode": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                return VerifyBookingEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code;
            VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK;
            VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code;
            VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName;
            // getBuyerSupplierMapping fun Call
            getOrgBuyerSupplierMapping();

            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.$intervalAddress1 = res[0].Address1;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].RelatedPortCode.substring(0, 2);
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0];
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                } else {
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsignorAddress = "";
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor');
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0];
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                } else {
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = "";
                }
            });
        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(VerifyBookingEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj);
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.Loaded = true
                }
            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer;
                VerifyBookingEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode;
                VerifyBookingEditDirectiveCtrl.ePage.Masters.Buyer = $item;
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].RelatedPortCode.substring(0, 2);
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0];
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax;
                    } else {
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee');
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0];
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone;
                    } else {
                        VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                    }
                });
            } else {
                VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = [];
                VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContact = [];
                VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = "";
                VerifyBookingEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = "";
                VerifyBookingEditDirectiveCtrl.ePage.Masters.buyerName = "";
            }
        }

        function GetOrgAddress(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK;
            } else {
                _pk = item.ORG_Buyer;
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                return VerifyBookingEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function GetOrgContact(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK;
            } else {
                _pk = item.ORG_Buyer;
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            }
            return apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                return VerifyBookingEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                VerifyBookingEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item;
                VerifyBookingEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax;
            } else {
                VerifyBookingEditDirectiveCtrl.ePage.Masters[code + "Address"] = "";
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                VerifyBookingEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item;
                VerifyBookingEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone;
            } else {
                VerifyBookingEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = "";
            }
        }

        function getAttachedOrders() {
            var _inputObj = {
                "SHP_FK": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100,
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response;
                }
            });
        }

        function getServices() {
            VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceLists = [];
            VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }
            var _input = {
                "EntityRefKey": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceLists = response.data.Response;
                    if (VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceLists.length != 0) {
                        for (var i in VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceLists, {
                                'ServiceCode': VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false';
                            } else {
                                VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode;
                            }
                        }
                    } else {
                        for (var i in VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            VerifyBookingEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false";
                        }
                    }
                }
            });
        }

        function getContainers() {
            var _inputObj = {
                "SHP_BookingOnlyLink": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response;
                }
            });
        }

        function getPackLines() {
            var _inputObj = {
                "SHP_FK": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response;
                }
            });
        }

        function getJobSailing() {
            var _filter = {
                "EntityRefKey": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                }
            });
        }



        function SubmitTask(IsApproval, type) {
            GeneralValidation(VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data, IsApproval).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    // (VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.InternalComments) ? JobInsertInput('IWN', 'Internal', VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data): false;
                    // (VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.JobComments) ? JobInsertInput('GEN', 'Job', VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data): false;
                    VerifyBookingEditDirectiveCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = true;
                    VerifyBookingEditDirectiveCtrl.ePage.Masters["SaveBooking" + type] = "Please wait";
                    var obj = {
                        // "EntitySource": "SHP",
                        // "EntityRefKey": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
                        // "EntityRefCode": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        // "ProcessName": "Quick Booking Verification",
                        // "IsApprovalRequired": IsApproval
                        "CompleteInstanceNo": VerifyBookingEditDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                        "CompleteStepNo": VerifyBookingEditDirectiveCtrl.ePage.Masters.MyTask.WSI_StepNo
                    };

                    (type == 'Verified')
                    UpdateJobRoutes().then(function (respon) {
                        if (respon.data.Status == 'Success') {
                            UpdateRecords(IsApproval).then(function (response) {
                                if (response.data.Status == 'Success') {
                                    // JobCommentsInsert().then(function (res) {
                                    //     if (res.data.Status == 'Success') {
                                    apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, obj).then(function (response) {
                                        if (response.data.Response) {
                                            VerifyBookingEditDirectiveCtrl.onComplete(VerifyBookingEditDirectiveCtrl.taskObj)
                                            VerifyBookingEditDirectiveCtrl.onRefreshStatusCount()
                                            VerifyBookingEditDirectiveCtrl.onRefreshTask()
                                        } else {
                                            toastr.error("Failed...");
                                        }
                                    });
                                    //     } else {
                                    //         toastr.error("Comments Failed...");
                                    //     }
                                    // });
                                } else {
                                    toastr.error("Failed...");
                                }
                            });
                        } else {
                            toastr.error("Routes Failed...");
                        }
                    })
                } else {
                    VerifyBookingEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function VesselplanningClose() {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentHeader.API.CloseVesselPlanningandCToB.Url + VerifyBookingEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {}
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


        function UpdateJobRoutes() {
            var deferred = $q.defer();
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.Upsert.Url, VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobRoutes).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }



        function UpdateRecords(IsApproval) {
            var deferred = $q.defer();
            var __input = [{
                "EntityRefPK": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
                "Properties": [{
                    "PropertyName": "SHP_IsBooking",
                    "PropertyNewValue": IsApproval,
                }, {
                    "PropertyName": "SHP_CargoCutoffDate",
                    "PropertyNewValue": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.CargoCutoffDate,
                }, {
                    "PropertyName": "SHP_BookingCutoffDate",
                    "PropertyNewValue": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookingCutoffDate,
                }, {
                    "PropertyName": "SHP_DocumentCutoffDate",
                    "PropertyNewValue": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.DocumentCutoffDate,
                }, {
                    "PropertyName": "SHP_CarrierReference",
                    "PropertyNewValue": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.CarrierReference,
                }]
            }];
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.UpdateRecords.Url, __input).then(function (response) {
                if (response.data.Status == 'Success') {
                    deferred.resolve(response);
                } else {
                    toastr.error("Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function initValidation() {

            if (VerifyBookingEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Sailing');
                errorWarningService.AddModuleToList("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
            }
            VerifyBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo];
            VerifyBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListDoc = errorWarningService.Modules.MyTask.Entity[VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'].GlobalErrorWarningList;
            VerifyBookingEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjDoc = errorWarningService.Modules.MyTask.Entity[VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'];
        }

        function StandardMenuConfig() {
            VerifyBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails = []
            VerifyBookingEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": VerifyBookingEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
            VerifyBookingEditDirectiveCtrl.ePage.Masters.RoutingHeader = {

                "HeaderProperties": [{
                        "columnname": "Checkbox",
                        "isenabled": false,
                        "property": "routingcheckbox",
                        "position": "1",
                        "width": "45",
                        "display": false
                    }, {
                        "columnname": "Job #",
                        "isenabled": false,
                        "property": "jobno",
                        "position": "2",
                        "width": "1600",
                        "display": false
                    },
                    {
                        "columnname": "Leg Order #",
                        "isenabled": false,
                        "property": "legorder",
                        "position": "3",
                        "width": "40",
                        "display": true
                    },
                    {
                        "columnname": "T.Mode",
                        "isenabled": true,
                        "property": "mode",
                        "position": "4",
                        "width": "160",
                        "display": true
                    },
                    {
                        "columnname": "Transport Type",
                        "isenabled": false,
                        "property": "transporttype",
                        "position": "5",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Status",
                        "isenabled": false,
                        "property": "status",
                        "position": "6",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Vessel",
                        "isenabled": true,
                        "property": "vessel",
                        "position": "7",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "Voyage/Flight",
                        "isenabled": true,
                        "property": "voyageflight",
                        "position": "8",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "LoadPort",
                        "isenabled": true,
                        "property": "pol",
                        "position": "9",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "DischargePort",
                        "isenabled": true,
                        "property": "pod",
                        "position": "10",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ETD",
                        "isenabled": true,
                        "property": "etd",
                        "position": "11",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ETA",
                        "isenabled": true,
                        "property": "eta",
                        "position": "12",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ATD",
                        "isenabled": false,
                        "property": "atd",
                        "position": "13",
                        "width": "120",
                        "display": true
                    },
                    {
                        "columnname": "ATA",
                        "isenabled": false,
                        "property": "ata",
                        "position": "14",
                        "width": "120",
                        "display": true
                    }
                ],
                "routingcheckbox": {
                    "isenabled": false,
                    "position": "1",
                    "width": "45"
                },
                "jobno": {
                    "isenabled": false,
                    "position": "2",
                    "width": "40"
                },
                "legorder": {
                    "isenabled": false,
                    "position": "3",
                    "width": "160"
                },
                "mode": {
                    "isenabled": true,
                    "position": "4",
                    "width": "160"
                },
                "transporttype": {
                    "isenabled": false,
                    "position": "5",
                    "width": "160"
                },
                "status": {
                    "isenabled": false,
                    "position": "6",
                    "width": "120"
                },
                "vessel": {
                    "isenabled": true,
                    "position": "7",
                    "width": "120"
                },
                "voyageflight": {
                    "isenabled": true,
                    "position": "8",
                    "width": "120"
                },
                "pol": {
                    "isenabled": true,
                    "position": "9",
                    "width": "120"
                },
                "pod": {
                    "isenabled": true,
                    "position": "10",
                    "width": "120"
                },
                "etd": {
                    "isenabled": true,
                    "position": "11",
                    "width": "120"
                },
                "eta": {
                    "isenabled": true,
                    "position": "12",
                    "width": "120"
                },
                "atd": {
                    "isenabled": false,
                    "position": "13",
                    "width": "120"
                },
                "ata": {
                    "isenabled": false,
                    "position": "14",
                    "width": "120"
                }
            }
            VerifyBookingEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
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


        function GeneralValidation($item, IsApproval) {
            var _input = $item;
            var _deferred = $q.defer();

            VerifyBookingEditDirectiveCtrl.ePage.Masters.CountList = $filter('filter')(_input.UIJobRoutes, {
                IsDeleted: false
            });
            // errorWarningService.OnFieldValueChange("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, _input.JobComments, 'E0035', false, undefined);
            if (VerifyBookingEditDirectiveCtrl.ePage.Masters.CountList.length > 0) {
                errorWarningService.OnFieldValueChange("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0033', false, undefined);
            } else {
                errorWarningService.OnFieldValueChange("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0033', false, undefined);
            }

            var tempArray = []
            if (VerifyBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                VerifyBookingEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {
                    if (val.DocumentType == 'DO' || val.DocumentType == 'CRO') {
                        tempArray.push(val);
                    }
                });
                if (tempArray.length > 0) {
                    errorWarningService.OnFieldValueChange("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0037', false, undefined);
                } else {
                    errorWarningService.OnFieldValueChange("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0037', false, undefined);
                }

            } else {
                errorWarningService.OnFieldValueChange("MyTask", VerifyBookingEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0037', false, undefined);
            }

            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();