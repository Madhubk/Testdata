(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestGeneralController", ManifestGeneralController);

    ManifestGeneralController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "$window", "$uibModal", "adminManifestConfig", "createmanifestConfig"];

    function ManifestGeneralController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, $window, $uibModal, adminManifestConfig, createmanifestConfig) {

        var ManifestGeneralCtrl = this;

        function Init() {

            var currentManifest = ManifestGeneralCtrl.currentManifest[ManifestGeneralCtrl.currentManifest.label].ePage.Entities;

            ManifestGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            ManifestGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = false;

            ManifestGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ManifestGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ManifestGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            ManifestGeneralCtrl.ePage.Masters.SelectedLookupReceiver = SelectedLookupReceiver;
            ManifestGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            ManifestGeneralCtrl.ePage.Masters.OnChangeVehicleType = OnChangeVehicleType;
            ManifestGeneralCtrl.ePage.Masters.ChangeCarrierDetails = ChangeCarrierDetails;
            ManifestGeneralCtrl.ePage.Masters.OnChangeManifestType = OnChangeManifestType;

            if ($state.current.url == "/manifest") {
                ManifestGeneralCtrl.ePage.Masters.Config = adminManifestConfig;
            } else if ($state.current.url == "/create-manifest") {
                ManifestGeneralCtrl.ePage.Masters.Config = createmanifestConfig;
            } else {
                ManifestGeneralCtrl.ePage.Masters.Config = manifestConfig;
            }

            ManifestGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            // DatePicker
            ManifestGeneralCtrl.ePage.Masters.DatePicker = {};
            ManifestGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ManifestGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            ManifestGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            generalOperation();
            GetNewManifestAddress();
            GetOrgReceiverAddress();
            getOrgSender();
        }

        function OnChangeManifestType() {
            getCarrierBasedOnSender();
            ManifestGeneralCtrl.ePage.Masters.OnChangeValues(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestType, "E5502", false, undefined);
        }

        function getManifestTypeBasedOnSender() {
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "DESC",
                "MappingCode": "SENDER_RECEIVER",
                "MappingFor_FK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ManifestGeneralCtrl.ePage.Masters.ManifestTypeDetails = response.data.Response;
                }
            });
        }

        function getCarrierBasedOnSender() {
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "DESC",
                "MappingCode": "SENDER_CARRIER",
                "AddRef1Code": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestType,
                "MappingFor_FK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ManifestGeneralCtrl.ePage.Masters.CarrierDetails = response.data.Response;
                    getVehicleType();
                }
            });
        }

        function ChangeCarrierDetails(item) {
            angular.forEach(ManifestGeneralCtrl.ePage.Masters.CarrierDetails, function (value, key) {
                if (value.ORG_MappingToCode == item) {
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = value.ORG_MappingToName;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = value.ORG_MappingToCode;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Transporter_ORG_FK = value.MappingTo_FK;
                }
            });
            getVehicleType();
            ManifestGeneralCtrl.ePage.Masters.OnChangeValues(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode, 'E5508');
        }

        function OnChangeVehicleType(item, text) {
            if (text == "ContainerType") {
                angular.forEach(ManifestGeneralCtrl.ePage.Masters.VehicleType, function (value, key) {
                    if (value.AddRef1Code == item) {
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ContainerTypeDescription = value.TYP_Value;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ContainerTypeCode = value.AddRef1Code;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ContainerType = value.AddRef1_FK;
                    }
                });
                ManifestGeneralCtrl.ePage.Masters.OnChangeValues(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ContainerTypeCode, "E5515", false, undefined)
            } else if (text == "VehicleType") {
                angular.forEach(ManifestGeneralCtrl.ePage.Masters.VehicleType, function (value, key) {
                    if (value.AddRef1Code == item) {
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeDescription = value.TYP_Value;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode = value.AddRef1Code;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleType = value.AddRef1_FK;
                    }
                });
                ManifestGeneralCtrl.ePage.Masters.OnChangeValues(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode, "E5510", false, undefined)
            }
        }

        function getVehicleType() {
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "DESC",
                "MappingCode": "CARRIER_VEHICLE",
                "MappingFor_FK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Transporter_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ManifestGeneralCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }

        function getReceiverBasedOnSender() {
            var _filter = {
                "SortColumn": "CFM_CreatedDateTime",
                "SortType": "DESC",
                "MappingCode": "SENDER_RECEIVER",
                "MappingFor_FK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.CfxMappingFindall.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ManifestGeneralCtrl.ePage.Masters.ReceiverDetails = response.data.Response;
                }
            });
        }

        function generalOperation() {
            // Sender
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = "";
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = "";
            ManifestGeneralCtrl.ePage.Masters.Sender = ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code + ' - ' + ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName;
            if (ManifestGeneralCtrl.ePage.Masters.Sender == " - ")
                ManifestGeneralCtrl.ePage.Masters.Sender = "";
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
                        ManifestGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = response.data.Response[0].ORG_Code;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = response.data.Response[0].ORG_FullName;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = response.data.Response[0].ROLE_FK;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = response.data.Response[0].ORG_Code;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = response.data.Response[0].ORG_FullName;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK = response.data.Response[0].ROLE_FK;
                        ManifestGeneralCtrl.ePage.Masters.Sender = response.data.Response[0].ORG_Code + ' - ' + response.data.Response[0].ORG_FullName;
                        GetOrgSenderAddress();
                        getManifestTypeBasedOnSender();
                        getReceiverBasedOnSender();
                        getCarrierBasedOnSender();
                    } else {
                        if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode) {
                            getManifestTypeBasedOnSender();
                            getReceiverBasedOnSender();
                            getCarrierBasedOnSender();
                        }
                        ManifestGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        ManifestGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function SelectedLookupReceiver(item) {
            angular.forEach(ManifestGeneralCtrl.ePage.Masters.ReceiverDetails, function (value, key) {
                if (value.ORG_MappingToCode == item) {
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_MappingToCode;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_MappingToName;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingTo_FK;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Receiver_ORG_FK = value.MappingTo_FK;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode = value.ORG_MappingToCode;
                    ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName = value.ORG_MappingToName;
                }
            });
            GetOrgReceiverAddress();
            OnChangeValues(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode, 'E5500');
        }

        function SelectedLookupSender(item) {
            if (item.entity) {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.entity.FullName;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK = item.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = item.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = item.entity.FullName;
                ManifestGeneralCtrl.ePage.Masters.Sender = item.entity.Code + '-' + item.entity.FullName;

                angular.forEach(ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
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
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.FullName;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = item.FullName;
                ManifestGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;

                angular.forEach(ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
                        value.ORG_FK = item.PK;
                        value.OAD_Address_FK = item.OAD_PK;
                        value.Address1 = item.OAD_Address1;
                        value.Address2 = item.OAD_Address2;
                        value.State = item.OAD_State;
                        value.PostCode = item.OAD_PostCode;
                        value.City = item.OAD_City;
                        value.Email = item.OAD_Email
                        value.Mobile = item.OAD_Mobile;
                        value.Phone = item.OAD_Phone;
                        value.RN_NKCountryCode = item.OAD_CountryCode;
                        value.Fax = item.OAD_Fax;
                    }
                });
            }
            GetOrgSenderAddress();
            getManifestTypeBasedOnSender();
            getCarrierBasedOnSender();
            getReceiverBasedOnSender();
            OnChangeValues(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode, 'E5501');
        }

        function GetOrgSenderAddress() {
            var _filter = {
                "ORG_FK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ManifestGeneralCtrl.ePage.Masters.OrgSenderAddress = response.data.Response;

                    angular.forEach(ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
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
                "ORG_FK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Receiver_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ManifestGeneralCtrl.ePage.Masters.OrgReceiverAddress = response.data.Response;

                    angular.forEach(ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
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

                templateUrl: 'app/eaxis/transports/track-manifest/manifest-general/address/address.html',
                controller: 'ManifestAddressController as ManifestAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "JobAddress": ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress,
                            "otheraddress": otheraddress,
                            "ClientType": ClientType
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewManifestAddress() {
            var myvalue = ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": ManifestGeneralCtrl.ePage.Entities.Header.Data.PK,
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
                ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": ManifestGeneralCtrl.ePage.Entities.Header.Data.PK,
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
                ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ManifestGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function setSelectedRow(index) {
            ManifestGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            ManifestGeneralCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            angular.forEach(ManifestGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ManifestGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ManifestGeneralCtrl.currentManifest.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ManifestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ManifestGeneralCtrl.currentManifest.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        Init();
    }

})();