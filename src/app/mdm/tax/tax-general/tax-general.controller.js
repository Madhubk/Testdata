(function () {
    "use strict";

    angular.module("Application")
        .controller("TaxGeneralController", TaxGeneralController);

    TaxGeneralController.$inject = ["helperService", "taxConfig", "appConfig", "authService", "apiService"];

    function TaxGeneralController(helperService, taxConfig, appConfig, authService, apiService) {
        var TaxGeneralCtrl = this;

        function Init() {
            var currentTax = TaxGeneralCtrl.currentTax[TaxGeneralCtrl.currentTax.code].ePage.Entities;

            TaxGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Tax",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTax
            };

            TaxGeneralCtrl.ePage.Masters.UITaxRate = TaxGeneralCtrl.ePage.Entities.Header.Data;
            TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = false;
            TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = false;
            TaxGeneralCtrl.ePage.Masters.Config = taxConfig;

            /* Function */
            TaxGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            TaxGeneralCtrl.ePage.Masters.SelectCheckBoxHierarchy = SelectCheckBoxHierarchy;
            TaxGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            /* DropDown List */
            TaxGeneralCtrl.ePage.Masters.DropDownMasterList = {
                "TaxClasification": {
                    "ListSource": []
                },
            };

            GetMastersDropDownList();
        }

        //#region GetDropDownList
        function GetMastersDropDownList() {
            var typeCodeList = ["TaxClasification"];
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
                        TaxGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        TaxGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region  OnChange, Selected Hierarchy
        function OnChangeValues($item) {
            if ($item == "TDS") {
                TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = true;
            }
            else {
                TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = false;
            }
        }

        function SelectCheckBoxHierarchy($item) {
            if ($item) {
                TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = true;
            } else {
                TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = false;
            }
        }
        //#endregion

        //#region SelectedLookup
        function SelectedLookupData($item) {
        }
        //#endregion

        Init();
    }
})();