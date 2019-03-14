(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AddressModalController", AddressModalController);

    AddressModalController.$inject = ["$timeout", "$filter", "$uibModalInstance", "apiService", "authService", "helperService", "toastr", "dmsconsignmentConfig", "param", "errorWarningService", "appConfig"];

    function AddressModalController($timeout, $filter, $uibModalInstance, apiService, authService, helperService, toastr, dmsconsignmentConfig, param, errorWarningService, appConfig) {
        var AddressModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            AddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            AddressModalCtrl.ePage.Masters.param = angular.copy(param);
            AddressModalCtrl.ePage.Masters.Config = dmsconsignmentConfig;
            AddressModalCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            AddressModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(dmsconsignmentConfig.Entities.Header.Meta);
            AddressModalCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();

            AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            AddressModalCtrl.ePage.Masters.IsDisableSave = false;
            AddressModalCtrl.ePage.Masters.OnRelatedPortSelect = OnRelatedPortSelect;
            AddressModalCtrl.ePage.Masters.Cancel = Cancel;
            AddressModalCtrl.ePage.Masters.SaveAddress = SaveAddress;

            InitOrgAddress();
            CountryList();
            LanguageList();
        }

        //#region general function
        function InitOrgAddress() {
            AddressModalCtrl.ePage.Masters.AddressList = {};

            if (AddressModalCtrl.ePage.Masters.param) {
                AddressModalCtrl.ePage.Masters.AddressList =
                    {
                        "Language": AddressModalCtrl.ePage.Masters.AddressList.Language,
                        "Address1": AddressModalCtrl.ePage.Masters.AddressList.Address1,
                        "Address2": AddressModalCtrl.ePage.Masters.AddressList.Address2,
                        "City": AddressModalCtrl.ePage.Masters.AddressList.City,
                        "State": AddressModalCtrl.ePage.Masters.AddressList.State,
                        "PostCode": AddressModalCtrl.ePage.Masters.AddressList.PostCode,
                        "Mobile": AddressModalCtrl.ePage.Masters.AddressList.Mobile,
                        "Email": AddressModalCtrl.ePage.Masters.AddressList.Email,
                        "RelatedPortCode": AddressModalCtrl.ePage.Masters.AddressList.RelatedPortCode,
                        "ORG_FK": AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.PK,
                        "IsModified": true,
                        "CountryCode": AddressModalCtrl.ePage.Masters.AddressList.CountryCode,
                        "IsMainAddress": false,
                    }

                if (AddressModalCtrl.ePage.Masters.AddressList.CountryCode) {
                    var _item = {
                        Code: AddressModalCtrl.ePage.Masters.AddressList.CountryCode
                    };
                    OnCountryChange(_item);
                }
            } else {
                AddressModalCtrl.ePage.Masters.AddressList = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    ORG_FK: AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.PK,
                    IsModified: true
                };
            }

            AddressModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;
        }
        function CountryList() {
            AddressModalCtrl.ePage.Masters.DropDownMasterList.Country = {};
            AddressModalCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": dmsconsignmentConfig.Entities.Header.API.CountryList.FilterID,
            };
            apiService.post("eAxisAPI", dmsconsignmentConfig.Entities.Header.API.CountryList.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AddressModalCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;
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
                        AddressModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AddressModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region Related Part Code
        function OnRelatedPortSelect($item) {
            AddressModalCtrl.ePage.Masters.OnChangeValues(AddressModalCtrl.ePage.Masters.AddressList.RelatedPortCode,"E5577",false,undefined)
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
                AddressModalCtrl.ePage.Masters.AddressList.CountryCode = $item.Code;
                GetStateList($item);
            } else {
                AddressModalCtrl.ePage.Masters.AddressList.CountryCode = undefined;
                AddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            }
        }

        function GetStateList($item) {
            AddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = undefined;
            var _filter = {
                "CountryCode": $item.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dmsconsignmentConfig.Entities.Header.API.CountryState.FilterID,
            };

            apiService.post("eAxisAPI", dmsconsignmentConfig.Entities.Header.API.CountryState.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }
        //#endregion

        //#region Save and Close Function 
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(AddressModalCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    AddressModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, param.Entity.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    AddressModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, param.Entity.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    AddressModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    AddressModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, param.Entity.label);
                }
            }
        }
        function SaveAddress() {
            AddressModalCtrl.ePage.Entities.Header.AddressList = AddressModalCtrl.ePage.Masters.AddressList
            Validation(param.Entity);
        }
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            //Validation Call
            AddressModalCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AddressModalCtrl.ePage.Entities.Header.Validations) {
                AddressModalCtrl.ePage.Masters.Config.RemoveApiErrors(AddressModalCtrl.ePage.Entities.Header.Validations, $item.label);
            }
            if (_errorcount.length == 0) {
                AddressModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(param.Entity);
                Save();
            } else {
                toastr.warning("Fill all mandatory fields...!");
                AddressModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(param.Entity);
            }
        }
        function Save() {
            AddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...!";
            AddressModalCtrl.ePage.Masters.IsDisableSave = true;

            AddressModalCtrl.ePage.Masters.AddressList.AddressCapability = {};

            var _input = angular.copy(AddressModalCtrl.ePage.Masters.AddressList);
            _input.IsModified = true;

            var _filter = {
                "PK": "",
                "IsValid": true,
                "IsActive": true,
                "Language": AddressModalCtrl.ePage.Masters.AddressList.Language,
                "Address1": AddressModalCtrl.ePage.Masters.AddressList.Address1,
                "Address2": AddressModalCtrl.ePage.Masters.AddressList.Address2,
                "City": AddressModalCtrl.ePage.Masters.AddressList.City,
                "State": AddressModalCtrl.ePage.Masters.AddressList.State,
                "PostCode": AddressModalCtrl.ePage.Masters.AddressList.PostCode,
                "Mobile": AddressModalCtrl.ePage.Masters.AddressList.Mobile,
                "Email": AddressModalCtrl.ePage.Masters.AddressList.Email,
                "RelatedPortCode": AddressModalCtrl.ePage.Masters.AddressList.RelatedPortCode,
                "ORG_FK": AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.PK,
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
                        "ORG_FK": AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.PK
                    }
                ],
                "Latitude": 1,
                "Longitude": 1,
                "CountryCode": AddressModalCtrl.ePage.Masters.AddressList.CountryCode,
                "TenantCode": "",
                "IsMainAddress": false,
                "Capabilities": {},

            };

            apiService.post("eAxisAPI", AddressModalCtrl.ePage.Entities.Header.API.InsertAddress.Url, [_filter]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully");
                    Cancel();
                } else {
                    toastr.error("save failed");
                }
            });

            AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            AddressModalCtrl.ePage.Masters.IsDisableSave = false;

        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
            AddressModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            AddressModalCtrl.ePage.Entities.Header.AddressList = undefined;
            AddressModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(param.Entity);
        }
        //#endregion

        Init();
    }
})();
