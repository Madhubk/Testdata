(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgGeneralModalController", OrgGeneralModalController);

    OrgGeneralModalController.$inject = ["$uibModalInstance", "apiService", "helperService", "toastr", "organizationConfig", "param", "authService"];

    function OrgGeneralModalController($uibModalInstance, apiService, helperService, toastr, organizationConfig, param, authService) {
        let OrgGeneralModalCtrl = this;

        function Init() {
            let currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgGeneralModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgGeneralModalCtrl.ePage.Masters.param = param;
                OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);
                OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();
                OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgGeneralModalCtrl.ePage.Masters.SaveOrganization = ValidateOrganization;
                OrgGeneralModalCtrl.ePage.Masters.Cancel = Cancel;

                InitOrgHeader();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitOrgHeader() {
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader = {};

            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.DataList = OrgGeneralModalCtrl.ePage.Entities.Header.DataList;

            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.OnBlurFullName = OnBlurFullName;
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.OnZoneSelect = OnZoneSelect;
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.OnUnlocoSelect = OnUnlocoSelect;
            OrgGeneralModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;
        }

        function OnBlurFullName() {
            if (OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName) {
                GenerateOrganizationCode();
            }
        }

        function OnZoneSelect($item) {
            if ($item.data) {
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.TMZ_FK = $item.data.entity.PK;
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.TMZ_Name = $item.data.entity.Name;
            } else {
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.TMZ_FK = $item.PK;
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.TMZ_Name = $item.Name;
            }
        }

        function OnUnlocoSelect($item) {
            let _item = {
                Code: null
            };
            if ($item.data) {
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0].RelatedPortCode = $item.data.entity.Code;
                if ($item.data.entity.CountryCode) {
                    _item.Code = $item.data.entity.CountryCode;
                }
            } else {
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0].RelatedPortCode = $item.Code;
                if ($item.CountryCode) {
                    _item.Code = $item.CountryCode;
                }
            }

            _item.Code ? OnCountryChange(_item) : OnCountryChange();

            if (OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0].RelatedPortCode) {
                GenerateOrganizationCode();
            }
        }

        function OnCountryChange($item) {
            OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0].CountryCode = undefined;
            OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0].ListSource = undefined;

            if ($item) {
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0].CountryCode = $item.Code;
                GetStateList($item);
            }
        }

        function GetStateList($item) {
            OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            let _filter = {
                "CountryCode": $item.Code
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CountryState.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CountryState.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }

        function GenerateOrganizationCode() {
            let _header = OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader;
            let _address = OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0];
            if (_header.FullName && _address.RelatedPortCode) {
                let _prefixCode = angular.copy(_header.FullName).replace(/\s/g, '').substring(0, 3);
                let _suffixCode = angular.copy(_address.RelatedPortCode).replace(/\s/g, '').substring(2, _address.RelatedPortCode.length);
                let _code = (_prefixCode + _suffixCode).toUpperCase();

                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code = _code;
            }
        }

        function ValidateOrganization() {
            OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: param.Entity.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: param.Entity.isNew ? "ORG_GENERAL_ADDRESS" : "ORG_GENERAL",
                Entity: OrgGeneralModalCtrl.ePage.Entities.Header.Data,
                ValidateAPI: "Group",
                ErrorCode: [],
                EntityCode: param.Entity.label,
                EntityPK: param.Entity.pk
            };

            OrgGeneralModalCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

                if (_errorCount > 0) {
                    OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    SaveOrganization();
                }
            });
        }

        function SaveOrganization() {
            let _input = angular.copy(OrgGeneralModalCtrl.ePage.Entities.Header.Data);
            let _header = {
                Code: _input.OrgHeader.Code.replace(/\s/g, '').toUpperCase(),
                FullName: _input.OrgHeader.FullName.toUpperCase(),
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };
            _input.OrgHeader = {
                ..._input.OrgHeader,
                ..._header
            };

            if (OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew == true) {
                let _addressCapability = {
                    IsMapped: true,
                    IsValid: true,
                    IsMainAddress: true,
                    AddressType: "OFC",
                    AddressTypeDes: "Office Address",
                    OAD_FK: _input.OrgAddress[0].PK,
                    ORG_FK: _input.OrgHeader.PK,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };
                let _address = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    ORG_FK: _input.OrgHeader.PK,
                    AddressCapability: [_addressCapability],
                    IsModified: true
                };

                _input.OrgAddress[0] = {
                    ..._input.OrgAddress[0],
                    ..._address
                };
            }

            OrgGeneralModalCtrl.ePage.Masters.param.Entity[OrgGeneralModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgGeneralModalCtrl.ePage.Masters.param.Entity, "Organization").then(response => {
                if (response.Status == "success" && response.Data) {
                    let _exports = {
                        data: response.Data
                    };
                    $uibModalInstance.close(_exports);
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(value => toastr.error(value.Message)): toastr.warning("Failed to Save...!");
                }

                OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
