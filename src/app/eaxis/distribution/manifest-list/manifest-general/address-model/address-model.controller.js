(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AddressModelController", AddressModelController);

    AddressModelController.$inject = ["$timeout", "$filter", "$uibModalInstance", "apiService", "authService", "helperService", "toastr", "dmsManifestConfig", "param", "errorWarningService", "appConfig"];

    function AddressModelController($timeout, $filter, $uibModalInstance, apiService, authService, helperService, toastr, dmsManifestConfig, param, errorWarningService, appConfig) {
        var AddressModelCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            AddressModelCtrl.ePage = {
                "Title": "",
                "Prefix": "Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            AddressModelCtrl.ePage.Masters.param = angular.copy(param);
            AddressModelCtrl.ePage.Masters.Config = dmsManifestConfig;
            AddressModelCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            AddressModelCtrl.ePage.Masters.DropDownMasterList = angular.copy(dmsManifestConfig.Entities.Header.Meta);
            AddressModelCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();

            AddressModelCtrl.ePage.Masters.SaveButtonText = "Save";
            AddressModelCtrl.ePage.Masters.IsDisableSave = false;
            AddressModelCtrl.ePage.Masters.OnRelatedPortSelect = OnRelatedPortSelect;
            AddressModelCtrl.ePage.Masters.Cancel = Cancel;
            AddressModelCtrl.ePage.Masters.SaveAddress = SaveAddress;
            AddressModelCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            InitOrgAddress();
            CountryList();
            LanguageList();
        }

        //#region general function
        function InitOrgAddress() {
            AddressModelCtrl.ePage.Masters.AddressList = {};
            // AddressModelCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            if (AddressModelCtrl.ePage.Masters.param) {
                AddressModelCtrl.ePage.Masters.AddressList =
                    {
                        "Language": AddressModelCtrl.ePage.Masters.AddressList.Language,
                        "Address1": AddressModelCtrl.ePage.Masters.AddressList.Address1,
                        "Address2": AddressModelCtrl.ePage.Masters.AddressList.Address2,
                        "City": AddressModelCtrl.ePage.Masters.AddressList.City,
                        "State": AddressModelCtrl.ePage.Masters.AddressList.State,
                        "PostCode": AddressModelCtrl.ePage.Masters.AddressList.PostCode,
                        "Mobile": AddressModelCtrl.ePage.Masters.AddressList.Mobile,
                        "Email": AddressModelCtrl.ePage.Masters.AddressList.Email,
                        "RelatedPortCode": AddressModelCtrl.ePage.Masters.AddressList.RelatedPortCode,
                        "ORG_FK": AddressModelCtrl.ePage.Entities.Header.Data.OrgReceiver.PK,
                        "IsModified": true,
                        "CountryCode": AddressModelCtrl.ePage.Masters.AddressList.CountryCode,
                        "IsMainAddress": false,
                    }

                if (AddressModelCtrl.ePage.Masters.AddressList.CountryCode) {
                    var _item = {
                        Code: AddressModelCtrl.ePage.Masters.AddressList.CountryCode
                    };
                    OnCountryChange(_item);
                }
            } else {
                AddressModelCtrl.ePage.Masters.AddressList = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    ORG_FK: AddressModelCtrl.ePage.Entities.Header.Data.OrgReceiver.PK,
                    IsModified: true
                };
            }

            AddressModelCtrl.ePage.Masters.OnCountryChange = OnCountryChange;

            // errorWarningService.Modules = {};
            // var _obj = {
            //     ModuleName: ["Manifest"],
            //     Code: [param.Entity.label],
            //     API: "Validation",
            //     FilterInput: {
            //         ModuleCode: "DMS",
            //         SubModuleCode: "MAN"
            //     },
            //     EntityObject: AddressModelCtrl.ePage.Entities.Header.Data
            // };

            // errorWarningService.GetErrorCodeList(_obj);
            // AddressModelCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            if (errorWarningService.Modules.Manifest) {
                AddressModelCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Manifest.Entity[param.Entity.label];
            }
             errorWarningService.Modules.Manifest.Entity[param.Entity.label].GlobalErrorWarningList = [];
        }
        function CountryList() {
            AddressModelCtrl.ePage.Masters.DropDownMasterList.Country = {};
            AddressModelCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": dmsManifestConfig.Entities.Header.API.CountryList.FilterID,
            };
            apiService.post("eAxisAPI", dmsManifestConfig.Entities.Header.API.CountryList.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AddressModelCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;
                }
            });
        }
        function LanguageList() {
            var typeCodeList = ["LANGUAGE"];
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
                        AddressModelCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AddressModelCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region Related Part Code
        function OnRelatedPortSelect($item) {
            AddressModelCtrl.ePage.Masters.OnFieldValueChange(AddressModelCtrl.ePage.Masters.AddressList.RelatedPortCode, "E5585", false, undefined)
            if ($item.data) {
                if ($item.data.entity.CountryCode) {
                    var _item = {
                        Code: $item.data.entity.CountryCode
                    };
                    OnCountryChange(_item);
                } else {
                    OnCountryChange();
                }
            } else {
                if ($item.CountryCode) {
                    var _item = {
                        Code: $item.CountryCode
                    };
                    OnCountryChange(_item);
                } else {
                    OnCountryChange();
                }
            }
        }
        //#endregion

        //#region Country and State
        function OnCountryChange($item) {
            if ($item) {
                AddressModelCtrl.ePage.Masters.AddressList.CountryCode = $item.Code;
                GetStateList($item);
            } else {
                AddressModelCtrl.ePage.Masters.AddressList.CountryCode = undefined;
                AddressModelCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            }
        }

        function GetStateList($item) {
            AddressModelCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            var _filter = {
                "CountryCode": $item.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dmsManifestConfig.Entities.Header.API.CountryState.FilterID,
            };

            apiService.post("eAxisAPI", dmsManifestConfig.Entities.Header.API.CountryState.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AddressModelCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }
        //#endregion

        //#region Save and Close Function 
        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Manifest"],
                Code: [param.Entity.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "MAN",
                    // Code: "E0013"
                },
                EntityObject: AddressModelCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function SaveAddress() {
            AddressModelCtrl.ePage.Entities.Header.AddressList = AddressModelCtrl.ePage.Masters.AddressList
            Validation(param.Entity);
        }
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            AddressModelCtrl.ePage.Entities.Header.Data.AddressList = AddressModelCtrl.ePage.Masters.AddressList;

            //Validation Call

            var _obj = {
                ModuleName: ["Manifest"],
                Code: [param.Entity.label],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "MAN"
                },
                EntityObject: AddressModelCtrl.ePage.Entities.Header.Data,
                ErrorCode: ["E5578", "E5579", "E5580", "E5581", "E5582", "E5583", "E5584", "E5585", "E5586"]
            };
            errorWarningService.ValidateValue(_obj);
            var _errorcount = errorWarningService.Modules.Manifest.Entity[param.Entity.label].GlobalErrorWarningList;

            if (_errorcount.length == 0) {
                AddressModelCtrl.ePage.Masters.Config.ShowErrorWarningModal(param.Entity);
                Save();
            } else {
                toastr.warning("Fill all mandatory fields...!");
                AddressModelCtrl.ePage.Masters.Config.ShowErrorWarningModal(param.Entity);
            }
        }
        function Save() {
            AddressModelCtrl.ePage.Masters.SaveButtonText = "Please Wait...!";
            AddressModelCtrl.ePage.Masters.IsDisableSave = true;

            AddressModelCtrl.ePage.Masters.AddressList.AddressCapability = {};

            var _input = angular.copy(AddressModelCtrl.ePage.Masters.AddressList);
            _input.IsModified = true;

            var _filter = {
                "PK": "",
                "IsValid": true,
                "IsActive": true,
                "Language": AddressModelCtrl.ePage.Masters.AddressList.Language,
                "Address1": AddressModelCtrl.ePage.Masters.AddressList.Address1,
                "Address2": AddressModelCtrl.ePage.Masters.AddressList.Address2,
                "City": AddressModelCtrl.ePage.Masters.AddressList.City,
                "State": AddressModelCtrl.ePage.Masters.AddressList.State,
                "PostCode": AddressModelCtrl.ePage.Masters.AddressList.PostCode,
                "Mobile": AddressModelCtrl.ePage.Masters.AddressList.Mobile,
                "Email": AddressModelCtrl.ePage.Masters.AddressList.Email,
                "RelatedPortCode": AddressModelCtrl.ePage.Masters.AddressList.RelatedPortCode,
                "ORG_FK": AddressModelCtrl.ePage.Entities.Header.Data.OrgReceiver.PK,
                "IsModified": true,
                "AddressCapability": [
                    {
                        "PK": "",
                        "IsValid": true,
                        "AddressType": "",
                        "IsMainAddress": false,
                        "OAD_FK": "",
                        "IsModified": true,
                        "AddressTypeDes": "",
                        "IsMapped": true,
                        "TenantCode": "",
                        "ORG_FK": AddressModelCtrl.ePage.Entities.Header.Data.OrgReceiver.PK
                    }
                ],
                "Latitude": 1,
                "Longitude": 1,
                "CountryCode": AddressModelCtrl.ePage.Masters.AddressList.CountryCode,
                "TenantCode": "",
                "IsMainAddress": false,
                "Capabilities": {},

            };

            apiService.post("eAxisAPI", AddressModelCtrl.ePage.Entities.Header.API.InsertAddress.Url, [_filter]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully");
                    Cancel();
                } else {
                    toastr.error("save failed");
                }
            });

            AddressModelCtrl.ePage.Masters.SaveButtonText = "Save";
            AddressModelCtrl.ePage.Masters.IsDisableSave = false;

        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
            errorWarningService.Modules.Manifest.Entity[param.Entity.label].GlobalErrorWarningList = [];
            AddressModelCtrl.ePage.Entities.Header.AddressList = undefined;
            AddressModelCtrl.ePage.Masters.Config.ShowErrorWarningModal(param.Entity);
        }
        //#endregion

        Init();
    }
})();
