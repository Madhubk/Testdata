(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgAddressModalController", OrgAddressModalController);

    OrgAddressModalController.$inject = ["$uibModalInstance", "apiService", "helperService", "toastr", "organizationConfig", "param", "appConfig"];

    function OrgAddressModalController($uibModalInstance, apiService, helperService, toastr, organizationConfig, param, appConfig) {
        var OrgAddressModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgAddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgAddressModalCtrl.ePage.Masters.param = angular.copy(param);
            OrgAddressModalCtrl.ePage.Masters.Config=organizationConfig;

            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);
            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();

            OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgAddressModalCtrl.ePage.Masters.OnAutocompleteRelatedPort = OnAutocompleteRelatedPort;
            OrgAddressModalCtrl.ePage.Masters.OnSelectRelatedPort = OnSelectRelatedPort;
            OrgAddressModalCtrl.ePage.Masters.OnMappedAddressChange = OnMappedAddressChange;
            OrgAddressModalCtrl.ePage.Masters.OnMainAddressChange = OnMainAddressChange;
            OrgAddressModalCtrl.ePage.Masters.SaveAddress = SaveAddress;
            OrgAddressModalCtrl.ePage.Masters.Cancel = Cancel;

            GetAddressCapabilityList();
            InitOrgAddress();
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
            }

            OrgAddressModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;
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

        function OnAutocompleteRelatedPort($item) {
            if ($item.CountryCode) {
                var _item = {
                    Code: $item.CountryCode
                };
                OnCountryChange(_item);
            } else {
                OnCountryChange();
            }
        }

        function OnSelectRelatedPort($item) {
            if ($item.data.entity.CountryCode) {
                var _item = {
                    Code: $item.data.entity.CountryCode
                };
                OnCountryChange(_item);
            } else {
                OnCountryChange();
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
                "FilterID": appConfig.Entities.OrgAddress.API.CountryState.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.CountryState.Url, _input).then(function (response) {
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

            OrgAddressModalCtrl.ePage.Masters.param.Entity[OrgAddressModalCtrl.ePage.Masters.param.Entity.label].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgAddressModalCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status == "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        $uibModalInstance.close(_exports);
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    toastr.warning("Failed to Save...!");
                    if (response.Validations && response.Validations.length > 0) {
                        OrgAddressModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            OrgAddressModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgAddressModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        $uibModalInstance.close(_exports);
                        if (OrgAddressModalCtrl.ePage.Entities.Header.Validations != null) {
                            OrgAddressModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgAddressModalCtrl.ePage.Masters.param.Entity);
                        }
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
