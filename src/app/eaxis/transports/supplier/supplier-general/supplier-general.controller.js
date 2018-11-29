(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SupplierGeneralController", SupplierGeneralController);

    SupplierGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "supplierConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "$uibModal", "$filter", "filterFilter"];

    function SupplierGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, supplierConfig, helperService, toastr, $injector, $window, confirmation, $uibModal, $filter, filterFilter) {

        var SupplierGeneralCtrl = this;

        function Init() {
            var currentSupplier = SupplierGeneralCtrl.currentSupplier[SupplierGeneralCtrl.currentSupplier.label].ePage.Entities;

            SupplierGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentSupplier,
            };

            SupplierGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            SupplierGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            SupplierGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            SupplierGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            SupplierGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            SupplierGeneralCtrl.ePage.Masters.OnChangeJourneyTitle = OnChangeJourneyTitle;
            SupplierGeneralCtrl.ePage.Masters.OnChangeSenderCarrier = OnChangeSenderCarrier;
            SupplierGeneralCtrl.ePage.Masters.OnChangeDeliveryCarrier = OnChangeDeliveryCarrier;
            SupplierGeneralCtrl.ePage.Masters.OnChangeReceiver = OnChangeReceiver;
            SupplierGeneralCtrl.ePage.Masters.Validation = Validation;
            SupplierGeneralCtrl.ePage.Masters.ARvisible = false;
            SupplierGeneralCtrl.ePage.Masters.Config = supplierConfig;
            SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType = "ADH"

            SupplierGeneralCtrl.ePage.Masters.Lineslist = true;

            SupplierGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            SupplierGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = false;
            // DatePicker
            SupplierGeneralCtrl.ePage.Masters.DatePicker = {};
            SupplierGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            SupplierGeneralCtrl.ePage.Masters.DatePicker.OptionsDel = angular.copy(APP_CONSTANT.DatePicker)
            var a = new Date();
            a = a.setDate(a.getDate() - 1);
            var date = new Date(a);
            SupplierGeneralCtrl.ePage.Masters.DatePicker.OptionsDel['minDate'] = date;

            SupplierGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            SupplierGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            SupplierGeneralCtrl.ePage.Masters.DatePicker.Closed = Closed;
            generalOperation();
            GetNewItemAddress();

            if (!SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode) {
                getOrgSender();
            } else {
                getSenderZone();
                serviceType();
                SenderCarrier();
                GetOrgSenderAddress();
                checkOrg();
                GetDropDownList();
            }

            if (!SupplierGeneralCtrl.currentSupplier.isNew) {
                serviceType()
                getSenderZone()
                GetReceiverZone()
                GetOrgSenderAddress();
                GetOrgReceiverAddress();
                SenderCarrier()
                GetDispatchHub()
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = $filter('date')(SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime, "dd-MMM-yyyy");
            }
            if (SupplierGeneralCtrl.currentSupplier.isNew) {
                SupplierGeneralCtrl.ePage.Masters.JourneyTitlelistSource = "";
                SupplierGeneralCtrl.ePage.Masters.SenderCarrierlistSource = "";
                SupplierGeneralCtrl.ePage.Masters.DeliveryCarrierlistSource = "";
                SupplierGeneralCtrl.ePage.Masters.DispatchHublistSource = "";
                SupplierGeneralCtrl.ePage.Masters.ReceiverList = "";
            }
        }

        function checkOrg() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        SupplierGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                    } else {
                        SupplierGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        SupplierGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        SupplierGeneralCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode = response.data.Response[0].ORG_Code;
                        SupplierGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = response.data.Response[0].ORG_Code;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = response.data.Response[0].ORG_FullName;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = response.data.Response[0].ROLE_FK;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = response.data.Response[0].ORG_Code;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = response.data.Response[0].ORG_FullName;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = response.data.Response[0].ROLE_FK;
                        SupplierGeneralCtrl.ePage.Masters.Sender = response.data.Response[0].ORG_Code + ' - ' + response.data.Response[0].ORG_FullName;
                        // if (SupplierGeneralCtrl.ePage.Masters.Sender) {
                        getSenderZone();
                        serviceType();
                        // }
                        // if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK) {
                        SenderCarrier();
                        // }
                        GetOrgSenderAddress();
                        GetOrgHeader()
                    } else {
                        SupplierGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        SupplierGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function GetOrgHeader() {
            var _filter = {
                "PK": SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender = response.data.Response[0];
                    GetDropDownList();
                }
            });
        }

        function generalOperation() {
            // Sender
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode == null)
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = "";
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName == null)
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = "";
            SupplierGeneralCtrl.ePage.Masters.Sender = SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
            if (SupplierGeneralCtrl.ePage.Masters.Sender == " - ")
                SupplierGeneralCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode == null)
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = "";
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName == null)
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = "";
            SupplierGeneralCtrl.ePage.Masters.Receiver = SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
            if (SupplierGeneralCtrl.ePage.Masters.Receiver == " - ")
                SupplierGeneralCtrl.ePage.Masters.Receiver = "";
        }

        function SelectedLookupSender(item) {
            if (item.entity) {
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.entity.PK;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.entity.Code;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.entity.FullName;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore = item.entity.IsStore;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsDistributionCentre = item.entity.IsDistributionCentre;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsRoadFreightDepot = item.entity.IsRoadFreightDepot;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.entity.PK;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = item.entity.Code;
                SupplierGeneralCtrl.ePage.Masters.Sender = item.entity.Code + '-' + item.entity.FullName;

                angular.forEach(SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.entity.PK;
                        value.OAD_Address_FK = item.entity.OAD_PK;
                        value.Address1 = item.entity.OAD_Address1;
                        value.Address2 = item.entity.OAD_Address2;
                        value.State = item.entity.OAD_State;
                        value.PostCode = item.entity.OAD_PostCode;
                        value.City = item.entity.OAD_City;
                        value.Email = item.entity.OAD_Email;
                        value.Mobile = item.entity.OAD_Mobile;
                        value.Phone = item.entity.OAD_Phone;
                        value.RN_NKCountryCode = item.entity.OAD_CountryCode;
                        value.Fax = item.entity.OAD_Fax;
                    }
                });
            }
            else {
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.PK;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.Code;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.FullName;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore = item.IsStore;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsDistributionCentre = item.IsDistributionCentre;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsRoadFreightDepot = item.IsRoadFreightDepot;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.PK;
                SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = item.Code;
                SupplierGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;

                angular.forEach(SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.PK;
                        value.OAD_Address_FK = item.OAD_PK;
                        value.Address1 = item.OAD_Address1;
                        value.Address2 = item.OAD_Address2;
                        value.State = item.OAD_State;
                        value.PostCode = item.OAD_PostCode;
                        value.City = item.OAD_City;
                        value.Email = item.OAD_Email;
                        value.Mobile = item.OAD_Mobile;
                        value.Phone = item.OAD_Phone;
                        value.RN_NKCountryCode = item.OAD_CountryCode;
                        value.Fax = item.OAD_Fax;
                    }
                });
            }
            SupplierGeneralCtrl.ePage.Masters.OnChangeValues(SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode, "E5516", false, undefined);
            // Journey Title
            if (SupplierGeneralCtrl.ePage.Masters.SenderZoneFK && SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK && SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType) {
                GetJourneyTitle();
            }
            GetDropDownList();
            GetOrgSenderAddress();
            SenderCarrier()
            getSenderZone()
            serviceType()
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                GetDispatchHub()
            }
        }

        function GetOrgSenderAddress() {
            var _filter = {
                "ORG_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierGeneralCtrl.ePage.Masters.OrgSenderAddress = response.data.Response;
                    angular.forEach(SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.PostCode = response.data.Response[0].PostCode;
                            value.City = response.data.Response[0].City;
                            value.Email = response.data.Response[0].Email;
                            value.Mobile = response.data.Response[0].Mobile;
                            value.Phone = response.data.Response[0].Phone;
                            value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                            value.Fax = response.data.Response[0].Fax;
                        }
                    });
                }
            });
        }

        function GetOrgReceiverAddress() {
            var _filter = {
                "ORG_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierGeneralCtrl.ePage.Masters.OrgReceiverAddress = response.data.Response;
                    angular.forEach(SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "REC") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.PostCode = response.data.Response[0].PostCode;
                            value.City = response.data.Response[0].City;
                            value.Email = response.data.Response[0].Email;
                            value.Mobile = response.data.Response[0].Mobile;
                            value.Phone = response.data.Response[0].Phone;
                            value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                            value.Fax = response.data.Response[0].Fax;
                        }
                    });
                }
            });
        }

        function OtherAddresses(otheraddress, ClientType) {
            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/eaxis/transports/track-supplier/supplier-general/supplier-address/supplier-address.html',
                controller: 'SupplierAddressController as SupplierAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "JobAddress": SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress,
                            "otheraddress": otheraddress,
                            "ClientType": ClientType
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewItemAddress() {
            var myvalue = SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": SupplierGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "SND",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": SupplierGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "REC",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                SupplierGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            SupplierGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Closed(closed) {
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime && SupplierGeneralCtrl.ePage.Masters.TransitDays) {
                GetDeliverydate()
            }
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["servicetypes"];
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
                        SupplierGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        SupplierGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                    if (SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsRoadFreightDepot || SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsDistributionCentre) {
                        SupplierGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = filterFilter(SupplierGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, { Key: 'ADH' })
                    } else if (SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                        SupplierGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = filterFilter(SupplierGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, { Key: 'STS' })
                    }
                }
            });
        }

        function setSelectedRow(index) {
            SupplierGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(SupplierGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                SupplierGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), SupplierGeneralCtrl.currentSupplier.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                SupplierGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), SupplierGeneralCtrl.currentSupplier.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function OnChangeServiceType(servicetype) {
            angular.forEach(SupplierGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, function (value, key) {
                if (value.Key == servicetype) {
                    SupplierGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType = value.Key;
                }
            });
            if (servicetype == "STS") { SupplierGeneralCtrl.ePage.Masters.ARvisible = true; }
            SupplierGeneralCtrl.ePage.Masters.OnChangeValues(SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType, "E5518", false, undefined);
            // Journey Title
            if (SupplierGeneralCtrl.ePage.Masters.SenderZoneFK && SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK && SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType) {
                GetJourneyTitle();
            }
        }

        function SenderCarrier() {
            // Sender Carrier
            var _filter = {
                "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "MappingCode": "SENDER_CARRIER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    SupplierGeneralCtrl.ePage.Masters.SenderCarrierlistSource = response.data.Response;
                    if (SupplierGeneralCtrl.currentSupplier.isNew) {
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode = response.data.Response[0].ORG_MappingToCode;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrier_ORG_FK = response.data.Response[0].MappingTo_FK;
                    }
                } else {
                    SupplierGeneralCtrl.ePage.Masters.SenderCarrierlistSource = "";
                }
            });
        }

        function OnChangeSenderCarrier(SenderCarrier) {
            angular.forEach(SupplierGeneralCtrl.ePage.Masters.SenderCarrierlistSource, function (value, key) {
                if (value.ORG_MappingToCode == SenderCarrier) {
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrier_ORG_FK = value.MappingTo_FK;
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode = value.ORG_MappingToCode;
                    SupplierGeneralCtrl.ePage.Masters.OnChangeValues(SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode, "E5519", false, undefined);
                }
            });
        }

        function DeliveryCarrier() {
            // Del Carrier
            var _filter = {
                "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                "MappingCode": "STORE_DEPOT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    SupplierGeneralCtrl.ePage.Masters.DeliveryCarrierlistSource = response.data.Response;
                }
            });
        }

        function OnChangeDeliveryCarrier(DeliveryCarrier) {
            angular.forEach(SupplierGeneralCtrl.ePage.Masters.DispatchHublistSource, function (value, key) {
                if (value.ORG_BasedOnName == DeliveryCarrier) {
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrier_ORG_FK = value.MappingBasedOn_FK;
                }
            });
        }

        function GetReceiver() {
            if (SupplierGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                SupplierGeneralCtrl.ePage.Masters.MappingCode = "DC_DEPOT_STORE"
            } else {
                SupplierGeneralCtrl.ePage.Masters.MappingCode = "SENDER_RECEIVER";
            }
            var _filter = {
                "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "MappingCode": SupplierGeneralCtrl.ePage.Masters.MappingCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;
                } else {
                    if (SupplierGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                        var _filter = {
                            "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                            "MappingCode": "SENDER_RECEIVER"
                        };
                        var _input = {
                            "searchInput": helperService.createToArrayOfObject(_filter),
                            "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
                        };
                        apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                            if (response.data.Response) {
                                SupplierGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;
                            }
                        });
                    }
                }
                if (!SupplierGeneralCtrl.currentSupplier.isNew) {
                    GetDispatchHub();
                }
            });
        }

        function OnChangeReceiver(receiver) {
            angular.forEach(SupplierGeneralCtrl.ePage.Masters.ReceiverList, function (value, key) {
                if (!SupplierGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                    if (value.ORG_MappingToCode == receiver) {
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = value.MappingTo_FK;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.ORG_MappingToCode;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.ORG_MappingToName;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingTo_FK;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_MappingToCode;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_MappingToName;
                        SupplierGeneralCtrl.ePage.Masters.Receiver = SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                } else {
                    if (value.ORG_BasedOnCode == receiver) {
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = value.MappingBasedOn_FK;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.ORG_BasedOnCode;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.ORG_BasedOnName;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingBasedOn_FK;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_BasedOnCode;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_BasedOnName;
                        SupplierGeneralCtrl.ePage.Masters.Receiver = SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                }
                SupplierGeneralCtrl.ePage.Masters.OnChangeValues(SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode, "E5517", false, undefined);
                if (SupplierGeneralCtrl.ePage.Masters.SenderZoneFK && SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK && SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType) {
                    GetJourneyTitle();
                }
            });
        }

        function getSenderZone() {
            var _filter = {
                "Code": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                "FullName": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierGeneralCtrl.ePage.Masters.SenderDetail = response.data.Response[0];
                    SupplierGeneralCtrl.ePage.Masters.SenderZone = response.data.Response[0].TMZ_Name;
                    SupplierGeneralCtrl.ePage.Masters.SenderZoneFK = response.data.Response[0].TMZ_FK;
                    if (!SupplierGeneralCtrl.currentSupplier.isNew && SupplierGeneralCtrl.ePage.Masters.SenderZoneFK && SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK) {
                        GetJourneyTitle()
                    }
                    GetReceiver()
                }
            });
        }

        function GetReceiverZone() {
            var _filter = {
                "Code": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode,
                "FullName": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    SupplierGeneralCtrl.ePage.Masters.ReceiverZone = response.data.Response[0].TMZ_Name;
                    SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK = response.data.Response[0].TMZ_FK;
                    if (!SupplierGeneralCtrl.currentSupplier.isNew && SupplierGeneralCtrl.ePage.Masters.SenderZoneFK && SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK) {
                        GetJourneyTitle()
                    }
                }
            });
        }

        function GetDispatchHub() {
            // get  
            if (SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                var _filter = {
                    "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                    "MappingCode": "STORE_DEPOT"
                };
            } else {
                var _filter = {
                    "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                    "MappingCode": "STORE_DEPOT"
                };
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    SupplierGeneralCtrl.ePage.Masters.DispatchHublistSource = response.data.Response;
                    SupplierGeneralCtrl.ePage.Masters.DispatchHub = response.data.Response[0].ORG_MappingToCode + "-" + response.data.Response[0].ORG_MappingToName;
                    if (SupplierGeneralCtrl.currentSupplier.isNew) {
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierCode = response.data.Response[0].ORG_BasedOnCode;
                        SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrier_ORG_FK = response.data.Response[0].MappingBasedOn_FK;
                    }
                } else {
                    SupplierGeneralCtrl.ePage.Masters.DispatchHublistSource = " ";
                }
            });
        }

        function GetJourneyTitle() {
            var _filter = {
                "TMZ_FromZoneFK": SupplierGeneralCtrl.ePage.Masters.SenderZoneFK,
                "TMZ_ToZoneFK": SupplierGeneralCtrl.ePage.Masters.ReceiverZoneFK,
                "ServiceType": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.TmsJourney.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.TmsJourney.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    SupplierGeneralCtrl.ePage.Masters.JourneyTitlelistSource = response.data.Response;
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle = response.data.Response[0].Title;
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK = response.data.Response[0].PK;
                    // if(!SupplierGeneralCtrl.currentSupplier.isNew){
                    GetJourneyLeg()
                    //}
                } else {
                    SupplierGeneralCtrl.ePage.Masters.JourneyTitlelistSource = "";
                }
            });
        }

        function OnChangeJourneyTitle(title) {
            angular.forEach(SupplierGeneralCtrl.ePage.Masters.JourneyTitlelistSource, function (value, key) {
                if (value.Title == title) {
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK = value.PK;
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle = value.Title;
                    GetJourneyLeg();
                    // SupplierGeneralCtrl.ePage.Masters.OnChangeValues(SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle, "E5520", false, undefined);
                }
            });
        }

        function GetJourneyLeg() {
            var _filter = {
                "TMJ_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.TmsJourneyLeg.FilterID
            };
            apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.TmsJourneyLeg.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _TransitDays = 0;
                    angular.forEach(response.data.Response, function (value, key) {
                        var a = parseInt(value.TML_TransitDays);
                        if (a != 0) {
                            var _TransitDay = _TransitDays + a;
                        }
                        SupplierGeneralCtrl.ePage.Masters.TransitDays = _TransitDay;
                    });
                }
                if (SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime && SupplierGeneralCtrl.ePage.Masters.TransitDays) {
                    GetDeliverydate()
                }
            });
        }

        function GetDeliverydate() {
            var _input = {
                "ExpectedPickupDate": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime,
                "IntransitDays": SupplierGeneralCtrl.ePage.Masters.TransitDays
            };
            apiService.post("eAxisAPI", "/MstNonWorkingDays/CalculateDueDate", _input).then(function (response) {
                if (response.data.Response) {
                    var deliverydate = response.data.Response.ExpectedDeliveryDate;
                    deliverydate = $filter('date')(deliverydate, "dd-MMM-yyyy");
                    SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = deliverydate;
                }
            });
        }

        function serviceType() {
            // if(!SupplierGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore){
            //     var _filter = {
            //         "MappingCode": "SENDER_SERVICETYPE",
            //         "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK
            //     };
            // }else{
            //     var _filter = {
            //         "MappingCode": "SENDER_SERVICETYPE",
            //         "MappingFor_FK": SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK
            //     };
            // }    
            // var _input = {
            //     "searchInput": helperService.createToArrayOfObject(_filter),
            //     "FilterID": SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            // };
            // apiService.post("eAxisAPI", SupplierGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         SupplierGeneralCtrl.ePage.Masters.servicetypelistSource = response.data.Response;
            //     }
            // });
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            SupplierGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (SupplierGeneralCtrl.ePage.Entities.Header.Validations) {
                SupplierGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(SupplierGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                SupplierGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(SupplierGeneralCtrl.currentSupplier);
            }
        }

        function Save($item) {
            if (SupplierGeneralCtrl.ePage.Masters.SaveAndClose) {
                SupplierGeneralCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (SupplierGeneralCtrl.ePage.Masters.IsMore) {
                SupplierGeneralCtrl.ePage.Masters.ShowMoreText = false;
            } else {
                SupplierGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            SupplierGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.TmsConsignmentItem.map(function (value, key) {
                value.TMC_FK = _input.TmsConsignmentHeader.PK;
            });

            helperService.SaveEntity($item, 'Supplier').then(function (response) {
                SupplierGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (SupplierGeneralCtrl.ePage.Masters.SaveAndClose) {
                    SupplierGeneralCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (SupplierGeneralCtrl.ePage.Masters.IsMore) {
                    SupplierGeneralCtrl.ePage.Masters.ShowMoreText = true;
                } else {
                    SupplierGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                }

                if (response.Status === "success") {
                    var _index = SupplierGeneralCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(SupplierGeneralCtrl.currentSupplier[SupplierGeneralCtrl.currentSupplier.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (SupplierGeneralCtrl.currentSupplier[SupplierGeneralCtrl.currentSupplier.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + SupplierGeneralCtrl.currentSupplier[SupplierGeneralCtrl.currentSupplier.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    SupplierGeneralCtrl.ePage.Masters.Config.TabList[_index][SupplierGeneralCtrl.ePage.Masters.Config.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    SupplierGeneralCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber;
                                                value[SupplierGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            SupplierGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }

                        if (SupplierGeneralCtrl.ePage.Masters.SaveAndClose) {
                            SupplierGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                            SupplierGeneralCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        SupplierGeneralCtrl.ePage.Masters.Config.TabList[_index].isNew = false;
                        if ($state.current.url == "/supplier") {
                            helperService.refreshGrid();
                        }
                    }
                    SupplierGeneralCtrl.ePage.Masters.IsMore = false;
                    toastr.success("Saved Successfully");
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("save failed");
                    SupplierGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        SupplierGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), SupplierGeneralCtrl.currentSupplier.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (SupplierGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        SupplierGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(SupplierGeneralCtrl.currentSupplier);
                    }
                    SupplierGeneralCtrl.ePage.Masters.IsMore = false;
                }
            });
        }
        Init();
    }

})();