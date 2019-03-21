(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestGeneralController", ManifestGeneralController);

    ManifestGeneralController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "errorWarningService"];

    function ManifestGeneralController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, $filter, toastr, errorWarningService) {

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

            ManifestGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            if (errorWarningService.Modules.Manifest) {
                ManifestGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Manifest.Entity[ManifestGeneralCtrl.currentManifest.code];
            }
            if (ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestGeneralCtrl.ePage.Masters.MenuList = ManifestGeneralCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                ManifestGeneralCtrl.ePage.Masters.MenuList = ManifestGeneralCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            ManifestGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ManifestGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            ManifestGeneralCtrl.ePage.Masters.SelectedLookupReceiver = SelectedLookupReceiver;
            ManifestGeneralCtrl.ePage.Masters.SelectedLookupCarrier = SelectedLookupCarrier;
            ManifestGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            ManifestGeneralCtrl.ePage.Masters.AddAddresses = AddAddresses;
            ManifestGeneralCtrl.ePage.Masters.OnChangeVehicleType = OnChangeVehicleType;
            ManifestGeneralCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            ManifestGeneralCtrl.ePage.Masters.Config = dmsManifestConfig;

            ManifestGeneralCtrl.ePage.Masters.ManifestTypeDetails = [];
            ManifestGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            ManifestGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

            // DatePicker
            ManifestGeneralCtrl.ePage.Masters.DatePicker = {};
            ManifestGeneralCtrl.ePage.Masters.DatePicker.Options = angular.copy(APP_CONSTANT.DatePicker);
            ManifestGeneralCtrl.ePage.Masters.DatePicker.Optiondel = angular.copy(APP_CONSTANT.DatePicker);

            ManifestGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            ManifestGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ManifestGeneralCtrl.ePage.Masters.DatePicker.Options['minDate'] = new Date() + 1;

            ManifestGeneralCtrl.ePage.Masters.TransportMode = ["Road", "Air", "Sea"];

            if (!ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDispatchDate)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDispatchDate = new Date();
            if (!ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDeliveryDate)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDeliveryDate = new Date();
            if (!ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportMode)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransportMode = ManifestGeneralCtrl.ePage.Masters.TransportMode[0];
            if (!ManifestGeneralCtrl.currentManifest.isNew)
                generalOperation();

            if (ManifestGeneralCtrl.currentManifest.isNew) {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType = 'Transportation'
            }
            // ManifestGeneralCtrl.ePage.Masters.Transportation = true;
            ManifestGeneralCtrl.ePage.Masters.SelectRadioButton = SelectRadioButton;
            ManifestGeneralCtrl.ePage.Masters.DispatchDateChange = DispatchDateChange;
            ManifestGeneralCtrl.ePage.Masters.DeliveryDateChange = DeliveryDateChange;

            if (!ManifestGeneralCtrl.currentManifest.isNew) {
                GetOrgSenderAddress();
                GetOrgReceiverAddress();
            }

            GetNewManifestAddress();
            getVehicleType();
            GetDropDownList();
        }

        function DispatchDateChange() {
            ManifestGeneralCtrl.ePage.Masters.OnFieldValueChange('E5545');
            ManifestGeneralCtrl.ePage.Masters.DatePicker.Optiondel['minDate'] = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDispatchDate;
        }
        function DeliveryDateChange() {
            ManifestGeneralCtrl.ePage.Masters.OnFieldValueChange('E5546');
        }
        function SelectRadioButton(value) {
            dmsManifestConfig.TransporterTypeValue = value;
            console.log(ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType)
            console.log(dmsManifestConfig.TransporterTypeValue);
            ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterType = value;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Manifest"],
                Code: [ManifestGeneralCtrl.currentManifest.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "MAN",
                    // Code: "E0013"
                },
                EntityObject: ManifestGeneralCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["ManifestType", "ManifestLoadType"];
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
                        ManifestGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ManifestGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == "ManifestLoadType") {
                            if (!ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.LoadType)
                                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.LoadType = response.data.Response[value][0].Key;
                        }
                        if (value == "ManifestType") {
                            if (!ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestType)
                                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestType = response.data.Response[value][1].Key;
                        }
                    });
                }
            });
        }

        function checkOrg() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.OrgUserAcess.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.OrgUserAcess.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        ManifestGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                    } else {
                        ManifestGeneralCtrl.ePage.Masters.UserOrganization = true;
                        ManifestGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        ManifestGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function OnChangeVehicleType(item, text) {
            if (text == "VehicleType") {
                angular.forEach(ManifestGeneralCtrl.ePage.Masters.VehicleType, function (value, key) {
                    if (value.Code == item) {
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode = value.Code;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeDescription = value.Description;
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleType = value.PK;
                    }
                });
            }
        }

        function getVehicleType() {
            var _filter = {
                "SortColumn": "CNM_Code",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ManifestGeneralCtrl.ePage.Masters.VehicleType = response.data.Response;
                    if (!ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode)
                        ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.VehicleTypeCode = response.data.Response[0].Code;
                }
            });
        }

        function generalOperation() {
            // Sender
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = "";
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = "";
            ManifestGeneralCtrl.ePage.Masters.Sender = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode + ' - ' + ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName;
            if (ManifestGeneralCtrl.ePage.Masters.Sender == " - ")
                ManifestGeneralCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode = "";
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName = "";
            ManifestGeneralCtrl.ePage.Masters.Receiver = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode + ' - ' + ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName;
            if (ManifestGeneralCtrl.ePage.Masters.Receiver == " - ")
                ManifestGeneralCtrl.ePage.Masters.Receiver = "";

            // Transporter
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = "";
            if (ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName == null)
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = "";
            ManifestGeneralCtrl.ePage.Masters.Transporter = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode + ' - ' + ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName;
            if (ManifestGeneralCtrl.ePage.Masters.Transporter == " - ")
                ManifestGeneralCtrl.ePage.Masters.Transporter = "";

            var _filter = {
                "PK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.FilterID
            };

            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient = response.data.Response[0].WarehouseCode;
                    ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.IsWarehouseClient = true;

                    if (ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                        ManifestGeneralCtrl.ePage.Masters.MenuList = ManifestGeneralCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
                    } else {
                        ManifestGeneralCtrl.ePage.Masters.MenuList = ManifestGeneralCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
                    }
                }
            });
            var _filter = {
                "PK": ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Receiver_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestGeneralCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.FilterID
            };

            apiService.post("eAxisAPI", ManifestGeneralCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient = response.data.Response[0].Code;
                }
            });
        }

        function SelectedLookupReceiver(item, model, code, IsArray) {
            if (item.data) {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = item.data.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = item.data.entity.FullName;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = item.data.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Receiver_ORG_FK = item.data.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode = item.data.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName = item.data.entity.FullName;
                ManifestGeneralCtrl.ePage.Masters.Receiver = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = item.FullName;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Receiver_ORG_FK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName = item.FullName;
                ManifestGeneralCtrl.ePage.Masters.Receiver = item.Code + '-' + item.FullName;
            }
            OnFieldValueChange(code)

            var WarehouseCode = "";
            if (item.data) {
                WarehouseCode = item.data.entity.WarehouseCode;
            } else {
                WarehouseCode = item.WarehouseCode;
            }

            ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient = WarehouseCode;
            ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.IsWarehouseClient = true;

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
                    angular.forEach(response.data.Response, function (value, key) {
                        angular.forEach(value.AddressCapability, function (value1, key1) {
                            if (value1.IsMainAddress) {
                                ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress = value;
                            }
                        });
                    });
                    angular.forEach(ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "REC") {
                            value.ORG_FK = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.ORG_FK;
                            value.ORG_Code = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode;
                            value.ORG_FullName = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverName;
                            value.OAD_Address_FK = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.PK;
                            value.Address1 = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.Address1;
                            value.Address2 = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.Address2;
                            value.State = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.State;
                            value.Postcode = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.PostCode;
                            value.City = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.City;
                            value.Email = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.Email;
                            value.Mobile = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.Mobile;
                            value.Phone = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.Phone;
                            value.RN_NKCountryCode = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.CountryCode;
                            value.Fax = ManifestGeneralCtrl.ePage.Masters.ReceiverMainAddress.Fax;
                        }
                    });
                }
            });
        }

        function SelectedLookupSender(item, model, code, IsArray) {
            if (item.data) {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.data.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.data.entity.FullName;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.data.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK = item.data.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = item.data.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = item.data.entity.FullName;
                ManifestGeneralCtrl.ePage.Masters.Sender = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.FullName;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName = item.FullName;
                ManifestGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;
            }
            OnFieldValueChange(code)

            var WarehouseCode = "";
            if (item.data) {
                WarehouseCode = item.data.entity.WarehouseCode;
            } else {
                WarehouseCode = item.WarehouseCode;
            }

            ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient = WarehouseCode;
            ManifestGeneralCtrl.ePage.Entities.Header.CheckPoints.IsWarehouseClient = true;

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

                    angular.forEach(response.data.Response, function (value, key) {
                        angular.forEach(value.AddressCapability, function (value1, key1) {
                            if (value1.IsMainAddress) {
                                ManifestGeneralCtrl.ePage.Masters.SenderMainAddress = value;
                            }
                        });
                    });

                    angular.forEach(ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.ORG_FK;
                            value.ORG_Code = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode;
                            value.ORG_FullName = ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderName;
                            value.OAD_Address_FK = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.PK;
                            value.Address1 = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.Address1;
                            value.Address2 = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.Address2;
                            value.State = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.State;
                            value.Postcode = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.PostCode;
                            value.City = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.City;
                            value.Email = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.Email;
                            value.Mobile = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.Mobile;
                            value.Phone = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.Phone;
                            value.RN_NKCountryCode = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.CountryCode;
                            value.Fax = ManifestGeneralCtrl.ePage.Masters.SenderMainAddress.Fax;
                        }
                    });
                }
            });
        }

        function SelectedLookupCarrier(item, model, code, IsArray) {
            if (item.data) {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Transporter_ORG_FK = item.data.entity.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = item.data.entity.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = item.data.entity.FullName;
                ManifestGeneralCtrl.ePage.Masters.Transporter = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Transporter_ORG_FK = item.PK;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterCode = item.Code;
                ManifestGeneralCtrl.ePage.Entities.Header.Data.TmsManifestHeader.TransporterName = item.FullName;
                ManifestGeneralCtrl.ePage.Masters.Transporter = item.Code + '-' + item.FullName;
            }
            OnFieldValueChange(code)
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

                templateUrl: 'app/eaxis/distribution/manifest-list/manifest-general/address/address.html',
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

        function AddAddresses() {
            var value = ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK;
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edits right address",
                scope: $scope,
                templateUrl: "app/eaxis/distribution/manifest-list/manifest-general/address-model/address-model.html",
                controller: 'AddressModelController as AddressModelCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": ManifestGeneralCtrl.currentManifest,
                            "Item": value,
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if (response.data) {
                        ManifestGeneralCtrl.currentManifest[ManifestGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Pk].ePage.Entities.Header.Data = response.data;

                        ManifestGeneralCtrl.ePage.Entities.Header.Data = response.data;
                    }
                },
                function () {
                    console.log("Cancelled");
                }
            );

        }
        function GetNewManifestAddress() {
            var myvalue = ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": ManifestGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMM",
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
                ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = ManifestGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": ManifestGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMM",
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

        Init();
    }

})();