(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AddressModalController", AddressModalController);

    AddressModalController.$inject = ["$timeout", "$filter", "$uibModalInstance", "apiService", "authService", "helperService", "toastr", "dmsconsignmentConfig", "param", "errorWarningService"];

    function AddressModalController($timeout, $filter, $uibModalInstance, apiService, authService, helperService, toastr, dmsconsignmentConfig, param, errorWarningService) {
        var AddressModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            AddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            AddressModalCtrl.ePage.Masters.param = angular.copy(param);

            AddressModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(dmsconsignmentConfig.Entities.Header.Meta);
            AddressModalCtrl.ePage.Masters.DropDownMasterList.State = helperService.metaBase();

            AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            AddressModalCtrl.ePage.Masters.IsDisableSave = false;

            AddressModalCtrl.ePage.Masters.OnZoneSelect = OnZoneSelect;
            AddressModalCtrl.ePage.Masters.SaveAddress = SaveAddress;
            AddressModalCtrl.ePage.Masters.Cancel = Cancel;

            InitOrgAddress();
        }

        function InitOrgAddress() {
            AddressModalCtrl.ePage.Masters.OrgAddress = {};
            AddressModalCtrl.ePage.Masters.OrgAddress.FormView = {};

            if (AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.Pk) {
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView = AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.Pk;

                if (AddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode) {
                    var _item = {
                        Code: AddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode
                    };
                    OnCountryChange(_item);
                }
            } else {
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    ORG_FK: AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.Pk,
                    IsModified: true
                };
            }

            AddressModalCtrl.ePage.Masters.OnCountryChange = OnCountryChange;

            // AddressModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // AddressModalCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[param.Entity.code].GlobalErrorWarningList;
            // AddressModalCtrl.ePage.Masters.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[param.Entity.code];
        }

        function OnZoneSelect($item) {
            if ($item.data) {
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_FK = $item.data.entity.PK;
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_Name = $item.data.entity.Name;
            } else {
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_FK = $item.PK;
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView.TMZ_Name = $item.Name;
            }
        }

        function OnCountryChange($item) {
            if ($item) {
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = $item.Code;
                GetStateList($item);
            } else {
                AddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = undefined;
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

            apiService.post("eAxisAPI", dmsconsignmentConfig.Entities.API.CountryState.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource = response.data.Response;
                }
            });
        }

        function SaveAddress() {
            AddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...!";
            AddressModalCtrl.ePage.Masters.IsDisableSave = true;

            var _filter = {
                PK: AddressModalCtrl.ePage.Entities.Header.Data.OrgReceiver.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
            };
            apiService.post("eAxisAPI", AddressModalCtrl.ePage.Entities.Header.API.InsertOrganization.Url, _input).then(function (response) {
                if (response.data.Response == "Success") {
                    toastr.success("Saved Successfully");
                } else if (response.data.Response == "failed") {
                    toastr.error("save failed");
                }
            });
            AddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            AddressModalCtrl.ePage.Masters.IsDisableSave = false;
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
