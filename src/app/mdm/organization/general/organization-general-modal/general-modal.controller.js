(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgGeneralModalController", OrgGeneralModalController);

    OrgGeneralModalController.$inject = ["$timeout", "$filter", "$uibModalInstance", "apiService", "helperService", "toastr", "organizationConfig", "param", "authService", "errorWarningService"];

    function OrgGeneralModalController($timeout, $filter, $uibModalInstance, apiService, helperService, toastr, organizationConfig, param, authService, errorWarningService) {
        var OrgGeneralModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgGeneralModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgGeneralModalCtrl.ePage.Masters.param = angular.copy(param);
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
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView = {};

            if (OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader) {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView = angular.copy(OrgGeneralModalCtrl.ePage);
            }

            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.OnBlurFullName = OnBlurFullName;
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.OnZoneSelect = OnZoneSelect;
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.OnUnlocoSelect = OnUnlocoSelect;
            OrgGeneralModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;

            OrgGeneralModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrgGeneralModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[param.Entity.code].GlobalErrorWarningList;
            OrgGeneralModalCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[param.Entity.code];

            GetDataList();
        }

        function GetDataList() {
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.DataList = [{
                "DispName": "Consignor",
                "Value": "IsConsignor"
            }, {
                "DispName": "Consignee",
                "Value": "IsConsignee"
            }, {
                "DispName": "Forwarder",
                "Value": "IsForwarder"
            }, {
                "DispName": "Transport Client",
                "Value": "IsTransportClient"
            }, {
                "DispName": "Warehouse Client",
                "Value": "IsWarehouseClient"
            }, {
                "DispName": "Broker",
                "Value": "IsBroker"
            }, {
                "DispName": "Road Freight Depot",
                "Value": "IsRoadFreightDepot"
            }, {
                "DispName": "Store",
                "Value": "IsStore"
            }, {
                "DispName": "Carrier",
                "Value": "IsShippingProvider"
            }];
        }

        function OnBlurFullName() {
            if (OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.FullName) {
                GenerateOrganizationCode();
            }
        }

        function OnZoneSelect($item) {
            if ($item.data) {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_FK = $item.data.entity.PK;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_Name = $item.data.entity.Name;
            } else {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_FK = $item.PK;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_Name = $item.Name;
            }
        }

        function OnUnlocoSelect($item) {
            if ($item.data) {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode = $item.data.entity.Code;

                if ($item.data.entity.CountryCode) {
                    var _item = {
                        Code: $item.data.entity.CountryCode
                    };
                }
            } else {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode = $item.Code;

                if ($item.CountryCode) {
                    var _item = {
                        Code: $item.CountryCode
                    };
                }
            }

            if (_item.Code) {
                OnCountryChange(_item);
            } else {
                OnCountryChange();
            }

            if (OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode) {
                GenerateOrganizationCode();
            }
        }

        function OnCountryChange($item) {
            if ($item) {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = $item.Code;
                GetStateList($item);
            } else {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = undefined;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].ListSource = undefined;
            }
        }

        function GetStateList($item) {
            OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            var _filter = {
                "CountryCode": $item.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CountryState.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CountryState.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }

        function GenerateOrganizationCode() {
            if (OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.FullName && OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode) {
                var _prefixCode = angular.copy(OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.FullName).replace(/\s/g, '').substring(0, 3);
                var _suffixCode = angular.copy(OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode).replace(/\s/g, '').substring(2, OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode.length);

                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.Code = (_prefixCode + _suffixCode).toUpperCase();
            }
        }

        function ValidateOrganization() {
            OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = true;
            var _errorCode = [];
            // if (param.Entity.isNew) {
            //     _errorCode = ["E9101", "E9102", "E9103", "E9104", "E9105", "E9106", "E9107", "E9108", "E9109", "E9110", "E9111", "E9112", "E9113"];
            // } else {
            //     _errorCode = ["E9101", "E9102"];
            // }

            var _code = param.Entity.code;
            var _groupCode = param.Entity.isNew ? "ORG_GENERAL_ADDRESS" : "ORG_GENERAL";
            var _obj = {
                ModuleName: ["Organization"],
                Code: [_code],
                API: "Group",
                GroupCode: _groupCode,
                RelatedBasicDetails: [],
                EntityObject: OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data,
                ErrorCode: _errorCode
            };
            errorWarningService.ValidateValue(_obj);

            $timeout(function () {
                var _errorCount = $filter("listCount")(OrgGeneralModalCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList, 'MessageType', 'E');

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
            var _input = angular.copy(OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data);
            _input.OrgHeader.IsModified = true;
            _input.OrgHeader.Code = _input.OrgHeader.Code.replace(/\s/g, '').toUpperCase();
            _input.OrgHeader.FullName = _input.OrgHeader.FullName.toUpperCase();
            _input.OrgHeader.TenantCode = authService.getUserInfo().TenantCode;

            if (OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew == true) {
                _input.OrgAddress[0].IsModified = true;
                _input.OrgAddress[0].TenantCode = authService.getUserInfo().TenantCode;
                _input.OrgAddress[0].ORG_FK = _input.OrgHeader.PK;

                if (!_input.OrgAddress[0].AddressCapability) {
                    _input.OrgAddress[0].AddressCapability = [];
                }
                _input.OrgAddress[0].AddressCapability[0].IsModified = true;
                _input.OrgAddress[0].AddressCapability[0].IsMapped = true;
                _input.OrgAddress[0].AddressCapability[0].IsValid = true;
                _input.OrgAddress[0].AddressCapability[0].IsMainAddress = true;
                _input.OrgAddress[0].AddressCapability[0].AddressType = "OFC";
                _input.OrgAddress[0].AddressCapability[0].AddressTypeDes = "Office Address";
                _input.OrgAddress[0].AddressCapability[0].OAD_FK = _input.OrgAddress[0].PK;
                _input.OrgAddress[0].AddressCapability[0].ORG_FK = _input.OrgHeader.PK;
                _input.OrgAddress[0].AddressCapability[0].TenantCode = authService.getUserInfo().TenantCode;
            }

            OrgGeneralModalCtrl.ePage.Masters.param.Entity[OrgGeneralModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgGeneralModalCtrl.ePage.Masters.param.Entity, "Organization").then(function (response) {
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
