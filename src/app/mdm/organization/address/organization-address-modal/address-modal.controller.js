(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgAddressModalController", OrgAddressModalController);

    OrgAddressModalController.$inject = ["$uibModalInstance", "apiService", "authService", "helperService", "toastr", "organizationConfig", "param"];

    function OrgAddressModalController($uibModalInstance, apiService, authService, helperService, toastr, organizationConfig, param) {
        let OrgAddressModalCtrl = this;

        function Init() {
            let currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgAddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgAddressModalCtrl.ePage.Masters.param = param;

            try {
                OrgAddressModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);
                OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();

                OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgAddressModalCtrl.ePage.Masters.OnZoneSelect = OnZoneSelect;
                OrgAddressModalCtrl.ePage.Masters.OnRelatedPortSelect = OnRelatedPortSelect;
                OrgAddressModalCtrl.ePage.Masters.OnMappedAddressChange = OnMappedAddressChange;
                OrgAddressModalCtrl.ePage.Masters.OnMainAddressChange = OnMainAddressChange;
                OrgAddressModalCtrl.ePage.Masters.SaveAddress = ValidateAddress;
                OrgAddressModalCtrl.ePage.Masters.Cancel = Cancel;

                GetAddressCapabilityList();
                InitOrgAddress();
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetAddressCapabilityList() {
            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability = helperService.metaBase();

            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.ADDRTYPE.ListSource.map(value => {
                let _obj = {
                    AddressType: value.Key,
                    AddressTypeDes: value.Value,
                    IsMainAddress: false,
                    IsMapped: false,
                    IsModified: false,
                    IsValid: false
                };
                OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.push(_obj);
            });

            GetCapbilityAddressMapping();
        }

        function GetCapbilityAddressMapping() {
            if (!OrgAddressModalCtrl.ePage.Masters.param.Item) {
                OrgAddressModalCtrl.ePage.Masters.param.Item = {
                    AddressCapability: OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource
                };
            } else {
                if (OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability) {
                    OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.map(value => {
                        let _isExist = OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability.some(val => {
                            if (val.AddressType == value.AddressType) {
                                val.IsMapped = true;
                            }
                            return val.AddressType == value.AddressType;
                        });

                        if (!_isExist) {
                            OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability.push(value);
                        }
                    });
                } else {
                    OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
                }
            }
        }

        function InitOrgAddress() {
            OrgAddressModalCtrl.ePage.Masters.OrgAddress = {
                FormView: {}
            };

            if (OrgAddressModalCtrl.ePage.Masters.param.Item && OrgAddressModalCtrl.ePage.Masters.param.Item.PK) {
                let _index = OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress.findIndex(x => x.PK === OrgAddressModalCtrl.ePage.Masters.param.Item.PK);

                if (_index !== -1) {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress[_index];
                }

                if (OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode) {
                    let _item = {
                        Code: OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode
                    };
                    OnCountryChange(_item);
                }
            } else {
                let _obj = {
                    AddressCapability: OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability,
                    TenantCode: authService.getUserInfo().TenantCode,
                    ORG_FK: OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                    IsModified: true
                };

                OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress = [...[_obj], ...OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress];

                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress[0];
            }

            OrgAddressModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;
        }

        function OnZoneSelect($item) {
            if ($item.data) {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_FK = $item.data.entity.PK;
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_Name = $item.data.entity.Name;
            } else {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_FK = $item.PK;
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_Name = $item.Name;
            }
        }

        function OnRelatedPortSelect($item) {
            if ($item.data) {
                if ($item.data.entity.CountryCode) {
                    let _item = {
                        Code: $item.data.entity.CountryCode
                    };
                    OnCountryChange(_item);
                } else {
                    OnCountryChange();
                }
            } else {
                if ($item.CountryCode) {
                    let _item = {
                        Code: $item.CountryCode
                    };
                    OnCountryChange(_item);
                } else {
                    OnCountryChange();
                }
            }
        }

        function OnCountryChange($item) {
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = undefined;
            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;

            if ($item) {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = $item.Code;
                GetStateList($item);
            }
        }

        function GetStateList($item) {
            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            let _filter = {
                "CountryCode": $item.Code
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CountryState.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CountryState.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }

        function OnMappedAddressChange($event, $item, $index) {
            let _checkbox = $event.target,
                _isChecked = _checkbox.checked;
            let _index = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability.findIndex(x => x.AddressType === $item.AddressType);

            if (_index != -1) {
                if (_isChecked) {
                    let _obj = {
                        IsModified: true,
                        IsValid: true,
                        IsMapped: true,
                        OAD_FK: OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.PK,
                        ORG_FK: OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                        TenantCode: authService.getUserInfo().TenantCode
                    };
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index] = {
                        ...OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index],
                        ..._obj
                    };
                } else {
                    let _obj = {
                        IsValid: false,
                        IsMapped: false,
                        IsMainAddress: false,
                        OAD_FK: undefined,
                        ORG_FK: undefined,
                        IsModified: $item.PK ? true : false
                    };
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index] = {
                        ...OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index],
                        ..._obj
                    };
                }
            }
        }

        function OnMainAddressChange($event, $item, $index) {
            let _checkbox = $event.target,
                _isChecked = _checkbox.checked;
            let _index = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability.findIndex(x => x.AddressType === $item.AddressType);

            if (_index != -1) {
                if ($item.PK) {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsModified = true;
                }
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsMainAddress = _isChecked ? true : false;
            }
        }

        function ValidateAddress() {
            OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: param.Entity.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: "ORG_ADDRESS",
                Entity: OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView,
                ValidateAPI: "Group",
                ErrorCode: [],
                EntityCode: param.Entity.label,
                EntityPK: param.Entity.pk
            };

            OrgAddressModalCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

                if (_errorCount > 0) {
                    OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    SaveAddress();
                }
            });
        }

        function SaveAddress() {
            OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...!";
            OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;

            let _AddressList = OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress;
            let _addressCapablitiesList = [];
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability.map(value => {
                if (value.IsModified == true || value.PK) {
                    _addressCapablitiesList.push(value);
                }
            });

            let _formView = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView;
            _formView.AddressCapability = _addressCapablitiesList;
            _formView.IsModified = true;

            if (_formView.PK) {
                let _index = _AddressList.findIndex(x => x.PK === _formView.PK);
                if (_index != -1) {
                    _AddressList[_index] = _formView;
                }
            }

            let _input = OrgAddressModalCtrl.ePage.Entities.Header.Data;
            _input.OrgAddress = _AddressList;
            _input.IsModified = true;

            OrgAddressModalCtrl.ePage.Masters.param.Entity[OrgAddressModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgAddressModalCtrl.ePage.Masters.param.Entity, 'Organization').then(response => {
                if (response.Status == "success" && response.Data) {
                    let _exports = {
                        data: response.Data
                    };
                    $uibModalInstance.close(_exports);
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(value => toastr.error(value.Message)): toastr.warning("Failed to Save...!");
                }

                OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
