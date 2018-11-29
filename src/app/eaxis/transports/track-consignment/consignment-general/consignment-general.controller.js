(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentGeneralController", ConsignmentGeneralController);

    ConsignmentGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "$uibModal", "$filter", "adminConsignmentConfig", "createConsignConfig", "filterFilter"];

    function ConsignmentGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, toastr, $injector, $window, confirmation, $uibModal, $filter, adminConsignmentConfig, createConsignConfig, filterFilter) {

        var ConsignmentGeneralCtrl = this;

        function Init() {
            var currentConsignment = ConsignmentGeneralCtrl.currentConsignment[ConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            ConsignmentGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ConsignmentGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            ConsignmentGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeJourneyTitle = OnChangeJourneyTitle;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeSenderCarrier = OnChangeSenderCarrier;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeDeliveryCarrier = OnChangeDeliveryCarrier;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeReceiver = OnChangeReceiver;
            ConsignmentGeneralCtrl.ePage.Masters.Validation = Validation;
            ConsignmentGeneralCtrl.ePage.Masters.AddNewItemSave = AddNewItemSave;
            ConsignmentGeneralCtrl.ePage.Masters.OnDateChangeValues = OnDateChangeValues;
            ConsignmentGeneralCtrl.ePage.Masters.GetDeliverydate = GetDeliverydate;


            ConsignmentGeneralCtrl.ePage.Masters.ARvisible = false;
            ConsignmentGeneralCtrl.ePage.Masters.isActive = ConsignmentGeneralCtrl.isActive;

            if ($state.current.url == "/consignment") {
                ConsignmentGeneralCtrl.ePage.Masters.Config = adminConsignmentConfig;
            } else if ($state.current.url == "/create-consignment") {
                ConsignmentGeneralCtrl.ePage.Masters.Config = createConsignConfig;
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.Config = consignmentConfig;
            }

            ConsignmentGeneralCtrl.ePage.Masters.NewStatus = "New";

            ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            ConsignmentGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = false;
            // DatePicker
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker = {};
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.OptionsDel = angular.copy(APP_CONSTANT.DatePicker)
            // var a = new Date();
            // a = a.setDate(a.getDate() - 1);
            // var date = new Date(a);
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.OptionsDel['minDate'] = new Date();

            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.Closed = Closed;
            generalOperation();
            GetNewItemAddress();

            if (!ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode) {
                getOrgSender();
            } else {
                getSenderZone();
                serviceType();
                SenderCarrier();
                GetOrgSenderAddress();
                checkOrg();
                GetDropDownList();
            }

            if (!ConsignmentGeneralCtrl.currentConsignment.isNew) {
                serviceType()
                getSenderZone()
                GetReceiverZone()
                GetOrgSenderAddress();
                GetOrgReceiverAddress();
                SenderCarrier()
                GetDispatchHub()
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = $filter('date')(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime, "dd-MMM-yyyy");
            }
            if (ConsignmentGeneralCtrl.currentConsignment.isNew) {
                ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.DeliveryCarrierlistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = "";
            }
        }
        function OnDateChangeValues() {
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == "STS" || ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == "PFR") {
                OnChangeValues(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime, "E5521", false, undefined)
            } else {
                OnChangeValues('falsevalue', "E5521", false, undefined)
            }
            GetDeliverydate()
        }

        function AddNewItemSave() {
            ConsignmentGeneralCtrl.ePage.Masters.IsSaveMsg = true;
            Validation(ConsignmentGeneralCtrl.currentConsignment);
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
                        ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode = response.data.Response[0].ORG_Code;
                        ConsignmentGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                    } else {
                        ConsignmentGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        ConsignmentGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                    GetOrgHeader();
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

                        ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode = response.data.Response[0].ORG_Code;
                        ConsignmentGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = response.data.Response[0].ORG_Code;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = response.data.Response[0].ORG_FullName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = response.data.Response[0].ROLE_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = response.data.Response[0].ORG_Code;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = response.data.Response[0].ORG_FullName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = response.data.Response[0].ROLE_FK;
                        ConsignmentGeneralCtrl.ePage.Masters.Sender = response.data.Response[0].ORG_Code + ' - ' + response.data.Response[0].ORG_FullName;
                        // if (ConsignmentGeneralCtrl.ePage.Masters.Sender) {
                        getSenderZone();
                        serviceType();
                        // }
                        // if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK) {
                        SenderCarrier();
                        // }
                        GetOrgSenderAddress();
                        GetOrgHeader()
                    } else {
                        ConsignmentGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        ConsignmentGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function GetOrgHeader() {
            var _filter = {
                "PK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender = response.data.Response[0];

                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore && ConsignmentGeneralCtrl.currentConsignment.isNew) {
                        ConsignmentGeneralCtrl.ePage.Masters.IsViewStatus = true;
                    } else {
                        ConsignmentGeneralCtrl.ePage.Masters.IsViewStatus = false;
                    }

                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsStore = true;
                    } else {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsStore = false;
                    }

                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsConsignor) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsStore = true;
                    } else {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsStore = false;
                    }

                    GetDropDownList();
                }
            });
        }

        function generalOperation() {
            // Sender
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = "";
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = "";
            ConsignmentGeneralCtrl.ePage.Masters.Sender = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
            if (ConsignmentGeneralCtrl.ePage.Masters.Sender == " - ")
                ConsignmentGeneralCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = "";
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = "";
            ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
            if (ConsignmentGeneralCtrl.ePage.Masters.Receiver == " - ")
                ConsignmentGeneralCtrl.ePage.Masters.Receiver = "";
        }

        function SelectedLookupSender(item) {
            if (item.data) {
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.data.entity.PK;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.data.entity.Code;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.data.entity.FullName;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore = item.data.entity.IsStore;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsDistributionCentre = item.data.entity.IsDistributionCentre;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsRoadFreightDepot = item.data.entity.IsRoadFreightDepot;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsConsignor = item.data.entity.IsConsignor;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.data.entity.PK;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = item.data.entity.Code;
                ConsignmentGeneralCtrl.ePage.Masters.Sender = item.data.entity.Code + '-' + item.data.entity.FullName;

                angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.data.entity.PK;
                        value.OAD_Address_FK = item.data.entity.OAD_PK;
                        value.Address1 = item.data.entity.OAD_Address1;
                        value.Address2 = item.data.entity.OAD_Address2;
                        value.State = item.data.entity.OAD_State;
                        value.Postcode = item.data.entity.OAD_PostCode;
                        value.City = item.data.entity.OAD_City;
                        value.Email = item.data.entity.OAD_Email;
                        value.Mobile = item.data.entity.OAD_Mobile;
                        value.Phone = item.data.entity.OAD_Phone;
                        value.RN_NKCountryCode = item.data.entity.OAD_CountryCode;
                        value.Fax = item.data.entity.OAD_Fax;
                    }
                });
            }
            else {
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.PK;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.Code;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.FullName;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore = item.IsStore;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsDistributionCentre = item.IsDistributionCentre;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsRoadFreightDepot = item.IsRoadFreightDepot;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsConsignor = item.IsConsignor;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.PK;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = item.Code;
                ConsignmentGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;

                angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.PK;
                        value.OAD_Address_FK = item.OAD_PK;
                        value.Address1 = item.OAD_Address1;
                        value.Address2 = item.OAD_Address2;
                        value.State = item.OAD_State;
                        value.Postcode = item.OAD_PostCode;
                        value.City = item.OAD_City;
                        value.Email = item.OAD_Email;
                        value.Mobile = item.OAD_Mobile;
                        value.Phone = item.OAD_Phone;
                        value.RN_NKCountryCode = item.OAD_CountryCode;
                        value.Fax = item.OAD_Fax;
                    }
                });
            }

            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore || ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsConsignor) {
                ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsStore = true;
            } else {
                ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsStore = false;
            }

            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore && ConsignmentGeneralCtrl.currentConsignment.isNew) {
                ConsignmentGeneralCtrl.ePage.Masters.IsViewStatus = true;
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.IsViewStatus = false;
            }

            ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode, "E5516", false, undefined);
            // Journey Title
            if (ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK && ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK && ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType && ConsignmentGeneralCtrl.currentConsignment.isNew) {
                GetJourneyTitle();
            }
            GetDropDownList();
            GetOrgSenderAddress();
            SenderCarrier()
            getSenderZone()
            serviceType()
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                GetDispatchHub()
            }
        }

        function GetOrgSenderAddress() {
            var _filter = {
                "ORG_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.OrgSenderAddress = response.data.Response;
                    angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.Postcode = response.data.Response[0].PostCode;
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
                "ORG_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.OrgReceiverAddress = response.data.Response;
                    angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "REC") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.Postcode = response.data.Response[0].PostCode;
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

                templateUrl: 'app/eaxis/transports/track-consignment/consignment-general/consignment-address/consignment-address.html',
                controller: 'ConsignmentAddressController as ConsignmentAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "JobAddress": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress,
                            "otheraddress": otheraddress,
                            "ClientType": ClientType
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewItemAddress() {
            var myvalue = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "SND",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "Postcode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "REC",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "Postcode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Closed(closed) {
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime && ConsignmentGeneralCtrl.ePage.Masters.TransitDays) {
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
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsRoadFreightDepot || ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsDistributionCentre) {
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = filterFilter(ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, { Key: 'ADH' })
                    } else if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = $filter('filter')(ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, function (value1, key1) {
                            return value1.Key == "STS";
                        });
                    } else if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsConsignor) {
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource = filterFilter(ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, { Key: 'PFR' })
                    }
                }
            });
        }

        function setSelectedRow(index) {
            ConsignmentGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConsignmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentGeneralCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ConsignmentGeneralCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function OnChangeServiceType(servicetype) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList.servicetypes.ListSource, function (value, key) {
                if (value.Key == servicetype) {
                    ConsignmentGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType = value.Key;
                }
            });
            if (servicetype == "STS") {
                ConsignmentGeneralCtrl.ePage.Masters.ARvisible = true;
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.ARvisible = false;
            }
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType, "E5518", false, undefined);
            // Journey Title

            if (ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK && ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK && ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType && ConsignmentGeneralCtrl.currentConsignment.isNew) {
                GetJourneyTitle();
            }
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime && ConsignmentGeneralCtrl.ePage.Masters.TransitDays) {
                OnDateChangeValues()
            }

            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == "STS" && ConsignmentGeneralCtrl.currentConsignment.isNew) {
                ConsignmentGeneralCtrl.ePage.Masters.IsViewStatus = true;
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.IsViewStatus = false;
            }

        }

        function SenderCarrier() {
            // Sender Carrier
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "MappingCode": "SENDER_CARRIER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource = response.data.Response;
                    if (ConsignmentGeneralCtrl.currentConsignment.isNew) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode = response.data.Response[0].ORG_MappingToCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrier_ORG_FK = response.data.Response[0].MappingTo_FK;
                    }
                } else {
                    ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource = "";
                }
            });
        }

        function OnChangeSenderCarrier(SenderCarrier) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource, function (value, key) {
                if (value.ORG_MappingToCode == SenderCarrier) {
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrier_ORG_FK = value.MappingTo_FK;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode = value.ORG_MappingToCode;
                    ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode, "E5519", false, undefined);
                }
            });
        }

        function DeliveryCarrier() {
            // Del Carrier
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                "MappingCode": "STORE_DEPOT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ConsignmentGeneralCtrl.ePage.Masters.DeliveryCarrierlistSource = response.data.Response;
                }
            });
        }

        function OnChangeDeliveryCarrier(DeliveryCarrier) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource, function (value, key) {
                if (value.ORG_BasedOnName == DeliveryCarrier) {
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrier_ORG_FK = value.MappingBasedOn_FK;
                }
            });
        }

        function GetReceiver() {
            if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                ConsignmentGeneralCtrl.ePage.Masters.MappingCode = "DC_DEPOT_STORE"
            }
            else {
                ConsignmentGeneralCtrl.ePage.Masters.MappingCode = "SENDER_RECEIVER";
            }
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "MappingCode": ConsignmentGeneralCtrl.ePage.Masters.MappingCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;
                    if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                        ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = $filter('unique')(ConsignmentGeneralCtrl.ePage.Masters.ReceiverList, 'MappingBasedOnCode')
                    }
                } else {
                    if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                        var _filter = {
                            "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                            "MappingCode": "SENDER_RECEIVER"
                        };
                        var _input = {
                            "searchInput": helperService.createToArrayOfObject(_filter),
                            "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
                        };
                        apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                            if (response.data.Response) {
                                ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;
                            }
                        });
                    }
                }
                if (!ConsignmentGeneralCtrl.currentConsignment.isNew) {
                    GetDispatchHub();
                }
            });
        }

        function GetStoreReceiver() {
            var _filter = {
                "Store": true,
                "Active": true
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = $filter('filter')(ConsignmentGeneralCtrl.ePage.Masters.ReceiverList, function (value1, key1) {
                        return value1.PK != ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.PK;
                    });
                }
            });
        }


        function OnChangeReceiver(receiver) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.ReceiverList, function (value, key) {
                if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsRoadFreightDepot || ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsConsignor) {
                    if (value.ORG_MappingToCode == receiver) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = value.MappingTo_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.ORG_MappingToCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.ORG_MappingToName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingTo_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_MappingToCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_MappingToName;
                        ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                } else if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsStore) {
                    if (value.Code == receiver) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = value.PK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.Code;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.FullName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.PK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.Code;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.FullName;
                        ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                } else if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre) {
                    if (value.ORG_BasedOnCode == receiver) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = value.MappingBasedOn_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.ORG_BasedOnCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.ORG_BasedOnName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingBasedOn_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_BasedOnCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_BasedOnName;
                        ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                }
                ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode, "E5517", false, undefined);
                if (ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK && ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK && ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType && ConsignmentGeneralCtrl.currentConsignment.isNew) {
                    GetJourneyTitle();
                }
            });
        }

        function getSenderZone() {
            var _filter = {
                "Code": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                "FullName": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.SenderDetail = response.data.Response[0];
                    ConsignmentGeneralCtrl.ePage.Masters.SenderZone = response.data.Response[0].TMZ_Name;
                    ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK = response.data.Response[0].TMZ_FK;
                    if (!ConsignmentGeneralCtrl.currentConsignment.isNew && ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK && ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK && ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType) {
                        GetJourneyTitle()
                    }
                    if (!ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsStore) {
                        GetReceiver()
                    } else if (ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsStore) {
                        GetStoreReceiver()
                    }
                }
            });
        }

        function GetReceiverZone() {
            var _filter = {
                "Code": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode,
                "FullName": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverZone = response.data.Response[0].TMZ_Name;
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK = response.data.Response[0].TMZ_FK;
                    if (ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK && ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK && ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType) {
                        GetJourneyTitle()
                    }
                }
            });
        }

        function GetDispatchHub() {
            // get  
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore) {
                var _filter = {
                    "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                    "MappingCode": "STORE_DEPOT"
                };
            } else {
                var _filter = {
                    "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                    "MappingCode": "STORE_DEPOT"
                };
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource = response.data.Response;
                    ConsignmentGeneralCtrl.ePage.Masters.DispatchHub = response.data.Response[0].ORG_MappingToCode + "-" + response.data.Response[0].ORG_MappingToName;
                    if (ConsignmentGeneralCtrl.currentConsignment.isNew) {
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierCode = response.data.Response[0].ORG_BasedOnCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrier_ORG_FK = response.data.Response[0].MappingBasedOn_FK;
                    }
                } else {
                    ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource = " ";
                }
            });
        }

        function GetJourneyTitle() {
            var _filter = {
                "TMZ_FromZoneFK": ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK,
                "TMZ_ToZoneFK": ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK,
                "ServiceType": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType,
                "JourneyType": "JRN"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourney.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourney.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource = response.data.Response;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle = response.data.Response[0].Title;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK = response.data.Response[0].PK;
                    ConsignmentGeneralCtrl.ePage.Masters.TransitDays = response.data.Response[0].TransitDays;
                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime && ConsignmentGeneralCtrl.ePage.Masters.TransitDays) {
                        GetDeliverydate()
                    }
                    // if(!ConsignmentGeneralCtrl.currentConsignment.isNew){
                    // GetJourneyLeg()
                    //}
                } else {
                    ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource = "";
                }
            });
        }

        function OnChangeJourneyTitle(title) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource, function (value, key) {
                if (value.Title == title) {
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK = value.PK;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle = value.Title;
                    ConsignmentGeneralCtrl.ePage.Masters.TransitDays = value.TransitDays;
                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime && ConsignmentGeneralCtrl.ePage.Masters.TransitDays) {
                        GetDeliverydate()
                    }
                    // ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle, "E5520", false, undefined);
                }
            });
        }

        // function GetJourneyLeg() {
        //     var _filter = {
        //         "TMJ_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourneyLeg.FilterID
        //     };
        //     apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourneyLeg.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             var _TransitDays = 0;
        //             angular.forEach(response.data.Response, function (value, key) {
        //                 var a = parseInt(value.TML_TransitDays);
        //                 if (a != 0) {
        //                     var _TransitDay = _TransitDays + a;
        //                 }
        //                 ConsignmentGeneralCtrl.ePage.Masters.TransitDays = _TransitDay;
        //             });
        //         }

        //     });
        // }

        function GetDeliverydate() {
            var _input = {
                "ExpectedPickupDate": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime,
                "IntransitDays": ConsignmentGeneralCtrl.ePage.Masters.TransitDays
            };
            apiService.post("eAxisAPI", "/MstNonWorkingDays/CalculateDueDate", _input).then(function (response) {
                if (response.data.Response) {
                    var deliverydate = response.data.Response.ExpectedDeliveryDate;
                    deliverydate = $filter('date')(deliverydate, "dd-MMM-yyyy");
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = deliverydate;
                }
            });
        }

        function serviceType() {
            // if(!ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.IsStore){
            //     var _filter = {
            //         "MappingCode": "SENDER_SERVICETYPE",
            //         "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK
            //     };
            // }else{
            //     var _filter = {
            //         "MappingCode": "SENDER_SERVICETYPE",
            //         "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK
            //     };
            // }    
            // var _input = {
            //     "searchInput": helperService.createToArrayOfObject(_filter),
            //     "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            // };
            // apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         ConsignmentGeneralCtrl.ePage.Masters.servicetypelistSource = response.data.Response;
            //     }
            // });
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ConsignmentGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Validations) {
                ConsignmentGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(ConsignmentGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentGeneralCtrl.currentConsignment);
            }
        }

        function Save($item) {
            if (ConsignmentGeneralCtrl.ePage.Masters.SaveAndClose) {
                ConsignmentGeneralCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (ConsignmentGeneralCtrl.ePage.Masters.IsMore) {
                ConsignmentGeneralCtrl.ePage.Masters.ShowMoreText = false;
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

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

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                ConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (ConsignmentGeneralCtrl.ePage.Masters.SaveAndClose) {
                    ConsignmentGeneralCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (ConsignmentGeneralCtrl.ePage.Masters.IsMore) {
                    ConsignmentGeneralCtrl.ePage.Masters.ShowMoreText = true;
                } else {
                    ConsignmentGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                }

                if (response.Status === "success") {

                    var _index = ConsignmentGeneralCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ConsignmentGeneralCtrl.currentConsignment[ConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (ConsignmentGeneralCtrl.currentConsignment[ConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + ConsignmentGeneralCtrl.currentConsignment[ConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    ConsignmentGeneralCtrl.ePage.Masters.Config.TabList[_index][ConsignmentGeneralCtrl.ePage.Masters.Config.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    ConsignmentGeneralCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber;
                                                value[ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            ConsignmentGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }

                        if (ConsignmentGeneralCtrl.ePage.Masters.SaveAndClose) {
                            ConsignmentGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ConsignmentGeneralCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        ConsignmentGeneralCtrl.ePage.Masters.Config.TabList[_index].isNew = false;
                        if ($state.current.url == "/consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    ConsignmentGeneralCtrl.ePage.Masters.IsMore = false;
                    console.log("Success");
                    if (!ConsignmentGeneralCtrl.ePage.Masters.IsSaveMsg) {
                        toastr.success("Saved Successfully");
                    }
                    ConsignmentGeneralCtrl.ePage.Masters.IsSaveMsg = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("save failed");
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ConsignmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentGeneralCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ConsignmentGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        ConsignmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentGeneralCtrl.currentConsignment);
                    }
                    ConsignmentGeneralCtrl.ePage.Masters.IsMore = false;
                }
            });
        }

        Init();
    }

})();