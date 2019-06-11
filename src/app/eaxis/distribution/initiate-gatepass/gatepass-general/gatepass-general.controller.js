(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatepassGeneralController", GatepassGeneralController);

    GatepassGeneralController.$inject = ["authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "gatepassConfig", "creategatepassConfig", "errorWarningService", "$timeout"];

    function GatepassGeneralController(authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, gatepassConfig, creategatepassConfig, errorWarningService, $timeout) {

        var GatepassGeneralCtrl = this;

        function Init() {
            var currentGatepass = GatepassGeneralCtrl.currentGatepass[GatepassGeneralCtrl.currentGatepass.label].ePage.Entities;
            GatepassGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "GatePass_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

            GatepassGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            if (errorWarningService.Modules.Gatepass) {
                GatepassGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Gatepass.Entity[GatepassGeneralCtrl.currentGatepass.code];
            }

            GatepassGeneralCtrl.ePage.Masters.SelectedLookupOrg = SelectedLookupOrg;
            GatepassGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            GatepassGeneralCtrl.ePage.Masters.SelectedLookupTransporter = SelectedLookupTransporter;

            GatepassGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            GatepassGeneralCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            GatepassGeneralCtrl.ePage.Masters.Config = gatepassConfig;

            GetNewAddress();
            GetAllVehicleType();
            GetDropDownList();
            generalOperation();
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Gatepass"],
                Code: [GatepassGeneralCtrl.currentGatepass.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "GAT",
                    // Code: "E0013"
                },
                EntityObject: GatepassGeneralCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
            errorWarningService.Modules.Gatepass.Entity[GatepassGeneralCtrl.currentGatepass.code]
        }

        function generalOperation() {
            // Sender
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode = "";
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName = "";
            GatepassGeneralCtrl.ePage.Masters.Organization = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode + ' - ' + GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName;
            if (GatepassGeneralCtrl.ePage.Masters.Organization == " - ")
                GatepassGeneralCtrl.ePage.Masters.Organization = "";

            // Transporter
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode = "";
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName = "";
            GatepassGeneralCtrl.ePage.Masters.Transporter = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode + ' - ' + GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName;
            if (GatepassGeneralCtrl.ePage.Masters.Transporter == " - ")
                GatepassGeneralCtrl.ePage.Masters.Transporter = "";

            // Client
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode = "";
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName = "";
            GatepassGeneralCtrl.ePage.Masters.Client = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode + ' - ' + GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName;
            if (GatepassGeneralCtrl.ePage.Masters.Client == " - ")
                GatepassGeneralCtrl.ePage.Masters.Client = "";
        }

        function SelectedLookupTransporter(item) {
            if (item.data) {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterFK = item.data.entity.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode = item.data.entity.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName = item.data.entity.FullName;
                GatepassGeneralCtrl.ePage.Masters.Transporter = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterFK = item.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode = item.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName = item.FullName;
                GatepassGeneralCtrl.ePage.Masters.Transporter = item.Code + '-' + item.FullName;
            }
            if (!GatepassGeneralCtrl.currentGatepass.isNew)
                OnFieldValueChange('E3532');
        }

        function SelectedLookupOrg(item) {
            if (item.data) {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK = item.data.entity.WAR_PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode = item.data.entity.WarehouseCode;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName = item.data.entity.WarehouseName;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK = item.data.entity.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_Code = item.data.entity.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_FullName = item.data.entity.FullName;
                GatepassGeneralCtrl.ePage.Masters.Organization = item.data.entity.WarehouseCode + '-' + item.data.entity.WarehouseName;
            }
            else {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK = item.WAR_PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode = item.WarehouseCode;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName = item.WarehouseName;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK = item.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_Code = item.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_FullName = item.FullName;
                GatepassGeneralCtrl.ePage.Masters.Organization = item.WarehouseCode + '-' + item.WarehouseName;
            }
            if (!GatepassGeneralCtrl.currentGatepass.isNew)
                OnFieldValueChange('E3531');

            var _filter = {
                "ORG_FK": GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GatepassGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", GatepassGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        angular.forEach(GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
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
                }
            });
        }

        function SelectedLookupClient(item) {            
            GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Client_FK = item.ORG_FK;
            GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode = item.ORG_Code;
            GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName = item.ORG_Name;
            GatepassGeneralCtrl.ePage.Masters.Client = item.ORG_Code + ' - ' + item.ORG_Name;
            OnFieldValueChange('E3545');
            var _filter = {
                "ORG_FK": GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Client_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GatepassGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", GatepassGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        angular.forEach(response.data.Response, function (value, key) {
                            angular.forEach(value.AddressCapability, function (value1, key1) {
                                if (value1.IsMainAddress) {
                                    GatepassGeneralCtrl.ePage.Masters.ClientMainAddress = value;
                                }
                            });
                        });
                        angular.forEach(GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                            if (value.AddressType == "REC") {
                                value.ORG_FK = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.ORG_FK;
                                value.ORG_Code = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientCode;
                                value.ORG_FullName = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ClientName;
                                value.OAD_Address_FK = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.PK;
                                value.Address1 = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.Address1;
                                value.Address2 = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.Address2;
                                value.State = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.State;
                                value.Postcode = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.PostCode;
                                value.City = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.City;
                                value.Email = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.Email;
                                value.Mobile = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.Mobile;
                                value.Phone = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.Phone;
                                value.RN_NKCountryCode = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.CountryCode;
                                value.Fax = GatepassGeneralCtrl.ePage.Masters.ClientMainAddress.Fax;
                            }
                        });
                    }
                }
            });
        }

        function GetNewAddress() {
            var myvalue = GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": GatepassGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TGP",
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
                GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": GatepassGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TGP",
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
                GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["GatepassPurpose"];
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
                        GatepassGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GatepassGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetAllVehicleType() {
            var _filter = {
                "SortColumn": "CNM_Code",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GatepassGeneralCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", GatepassGeneralCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    GatepassGeneralCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }


        Init();
    }

})();