(function () {
    "use strict";

    angular.module("Application")
        .controller("APConfigurationController", APConfigurationController);

    APConfigurationController.$inject = ["$uibModalInstance", "helperService", "organizationConfig", "param", "CompanyDataIndex", "appConfig", "apiService", "authService", "toastr"];

    function APConfigurationController($uibModalInstance, helperService, organizationConfig, param, CompanyDataIndex, appConfig, apiService, authService, toastr) {
        var APConfigurationCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            APConfigurationCtrl.ePage = {
                "Title": "",
                "Prefix": "ApConfiguratino",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": angular.copy(currentOrganization)
            };

            APConfigurationCtrl.ePage.Masters.param = angular.copy(param);
            APConfigurationCtrl.ePage.Masters.CompanyDataIndex = angular.copy(CompanyDataIndex);

            APConfigurationCtrl.ePage.Masters.CloseButtonText = "Close";
            APConfigurationCtrl.ePage.Masters.SaveButtonText = "Save";
            APConfigurationCtrl.ePage.Masters.IsDisableSave = false;

            /* Function */
            APConfigurationCtrl.ePage.Masters.Close = Close;
            APConfigurationCtrl.ePage.Masters.Validation = Validation;
            APConfigurationCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            /* DropDown List */
            APConfigurationCtrl.ePage.Masters.DropDownMasterList = {
                "AP_PAYMENT": {
                    "ListSource": []
                },
                "GSTRecognition": {
                    "ListSource": []
                }
            };

            BindAPConfiguration();
            GetDropDownList();
        }

        //#region BindAPConfiguration
        function BindAPConfiguration() {
            if (APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].PK) {
                if (APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].CreditorCode && APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].CreditorDesc) {
                    APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].OCG_APCreditorGroupCodeDesc = APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].CreditorCode + ' - ' + APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].CreditorDesc;
                }
                if (APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountCode && APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountDesc) {
                    APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].FBN_APDefaultBankAccountCodeDesc = APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountCode + ' - ' + APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultBankAccountDesc;
                }
                if (APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeCode && APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeDesc) {
                    APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].FCC_APDefaultChargeCodeDesc = APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeCode + ' - ' + APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].APDefaultChargeDesc;
                }
            }
        }
        //#region 

        //#region GetDropDownList
        function GetDropDownList() {
            var typeCodeList = ["AP_PAYMENT", "GSTRecognition"];
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
                        APConfigurationCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        APConfigurationCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if (type == 'AccountGroup') {
                APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].OCG_APCreditorGroupCodeDesc = $item.Code + ' - ' + $item.Desc;
            }
            else if (type == 'BankAccount') {
                APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].FBN_APDefaultBankAccountCodeDesc = $item.Code + ' - ' + $item.Desc;
            }
            else if (type == 'ChargeAccount') {
                APConfigurationCtrl.ePage.Entities.Header.Data.OrgCompanyData[APConfigurationCtrl.ePage.Masters.CompanyDataIndex].FCC_APDefaultChargeCodeDesc = $item.Code + ' - ' + $item.Desc;
            }
        }
        //#endregion

        //#region Close, Validation With Save
        function Close() {
            $uibModalInstance.close();
        }

        function Validation(CurrentEntity) {
            APConfigurationCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            APConfigurationCtrl.ePage.Masters.IsDisableSave = true;

            APConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntity] = filterObjectUpdate(APConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntity], "IsModified");

            APConfigurationCtrl.ePage.Masters.param.Entity[APConfigurationCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = APConfigurationCtrl.ePage.Entities.Header.Data;

            helperService.SaveEntity(APConfigurationCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status === "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        toastr.success("Saved Successfully...!");
                        $uibModalInstance.close(_exports);
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    toastr.warning("Failed to Save...!");
                    ConfigurationCtrl.ePage.Masters.SaveButtonText = "Save";
                    ConfigurationCtrl.ePage.Masters.IsDisableSave = false;
                    $uibModalInstance.close();
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        //#endregion

        Init();
    }
})();