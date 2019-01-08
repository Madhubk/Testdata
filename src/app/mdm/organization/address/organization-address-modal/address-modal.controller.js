(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgAddressModalController", OrgAddressModalController);

    OrgAddressModalController.$inject = ["$timeout", "$filter", "$uibModalInstance", "apiService", "authService", "helperService", "toastr", "organizationConfig", "param", "errorWarningService"];

    function OrgAddressModalController($timeout, $filter, $uibModalInstance, apiService, authService, helperService, toastr, organizationConfig, param, errorWarningService) {
        var OrgAddressModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgAddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgAddressModalCtrl.ePage.Masters.param = angular.copy(param);

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

        function InitOrgAddress() {
            OrgAddressModalCtrl.ePage.Masters.OrgAddress = {};
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = {};

            if (OrgAddressModalCtrl.ePage.Masters.param.Item) {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = OrgAddressModalCtrl.ePage.Masters.param.Item;

                if (OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode) {
                    var _item = {
                        Code: OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode
                    };
                    OnCountryChange(_item);
                }
            } else {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    ORG_FK: OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                    IsModified: true
                };
            }

            OrgAddressModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;

            OrgAddressModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrgAddressModalCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[param.Entity.code].GlobalErrorWarningList;
            OrgAddressModalCtrl.ePage.Masters.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[param.Entity.code];
        }

        function GetAddressCapabilityList() {
            if (!OrgAddressModalCtrl.ePage.Masters.param.Item) {
                OrgAddressModalCtrl.ePage.Masters.param.Item = {};
                OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
            } else {
                if (OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability) {
                    OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.map(function (value1, key1) {
                        var _isExist = OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability.some(function (val, index) {
                            if (val.AddressType == value1.AddressType) {
                                val.IsMapped = true;
                            }
                            return val.AddressType == value1.AddressType;
                        });

                        if (!_isExist) {
                            OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability.push(value1);
                        }
                    });
                } else {
                    OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
                }
            }
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

        function OnCountryChange($item) {
            if ($item) {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = $item.Code;
                GetStateList($item);
            } else {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = undefined;
                OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            }
        }

        function GetStateList($item) {
            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            var _filter = {
                "CountryCode": $item.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CountryState.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CountryState.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }

        function OnMappedAddressChange($event, $item, $index) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;
            var _index = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability.map(function (value, key) {
                return value.AddressType;
            }).indexOf($item.AddressType);

            if (_index != -1) {
                if (_isChecked) {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsModified = true;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsValid = true;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsMapped = true;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].OAD_FK = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.PK;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].ORG_FK = OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].TenantCode = authService.getUserInfo().TenantCode;
                } else {
                    if ($item.PK) {
                        OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsModified = true;
                    } else {
                        OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsModified = false;
                    }
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsValid = false;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsMapped = false;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsMainAddress = false;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].OAD_FK = undefined;
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].ORG_FK = undefined;
                }
            }
        }

        function OnMainAddressChange($event, $item, $index) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;
            var _index = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability.map(function (value, key) {
                return value.AddressType;
            }).indexOf($item.AddressType);

            if (_index != -1) {
                if ($item.PK) {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsModified = true;
                }

                if (_isChecked) {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsMainAddress = true;
                } else {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[_index].IsMainAddress = false;
                }
            }
        }

        function ValidateAddress() {
            OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
            var _errorCode = [];

            var _code = param.Entity.code;
            var _obj = {
                ModuleName: ["Organization"],
                Code: [_code],
                API: "Group",
                GroupCode: "ORG_ADDRESS",
                RelatedBasicDetails: [],
                EntityObject: OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView,
                ErrorCode: _errorCode
            };
            errorWarningService.ValidateValue(_obj);

            $timeout(function () {
                var _errorCount = $filter("listCount")(OrgAddressModalCtrl.ePage.Masters.GlobalErrorWarningList, 'MessageType', 'E');

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

            var _AddressList = angular.copy(OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress);
            var _addressCapablitiesList = [];
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability.map(function (value, key) {
                if (value.IsModified == true || value.PK) {
                    _addressCapablitiesList.push(value);
                }
            });

            var _formView = angular.copy(OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView);
            var _input = angular.copy(OrgAddressModalCtrl.ePage.Entities.Header.Data);

            _formView.AddressCapability = _addressCapablitiesList;
            _formView.IsModified = true;

            if (_formView.PK) {
                var _index = _AddressList.map(function (value, key) {
                    return value.PK;
                }).indexOf(_formView.PK);

                if (_index != -1) {
                    _AddressList[_index] = _formView;
                }
            } else {
                _AddressList = _AddressList.concat(_formView);
            }
            _input.OrgAddress = _AddressList;
            _input.IsModified = true;

            OrgAddressModalCtrl.ePage.Masters.param.Entity[OrgAddressModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgAddressModalCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status == "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        $uibModalInstance.close(_exports);
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    if (response.Validations && response.Validations.length > 0) {
                        response.Validations.map(function (value, key) {
                            toastr.error(value.Message);
                        });
                    } else {
                        toastr.warning("Failed to Save...!");
                    }
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
