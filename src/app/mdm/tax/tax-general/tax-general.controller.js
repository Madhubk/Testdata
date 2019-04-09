(function () {
    "use strict";

    angular.module("Application")
        .controller("TaxGeneralController", TaxGeneralController);

    TaxGeneralController.$inject = ["$timeout","helperService", "taxConfig", "appConfig", "authService", "apiService"];

    function TaxGeneralController($timeout, helperService, taxConfig, appConfig, authService, apiService) {
        var TaxGeneralCtrl = this;

        function Init() {
            var currentTax = TaxGeneralCtrl.currentTax[TaxGeneralCtrl.currentTax.code].ePage.Entities;

            console.log(TaxGeneralCtrl.currentTax);

            TaxGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Tax",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTax
            };

            console.log("Height", TaxGeneralCtrl.ePage.Entities.Header.TableProperties.UITaxHierarchy.TableHeight.height);

            TaxGeneralCtrl.ePage.Masters.UITaxRate = TaxGeneralCtrl.ePage.Entities.Header.Data;
            TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = false;
            TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = false;
            TaxGeneralCtrl.ePage.Masters.Config = taxConfig;

            TaxGeneralCtrl.ePage.Entities.Header.Data.UITaxHierarchy =[];

            /* Function */
            TaxGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            TaxGeneralCtrl.ePage.Masters.SelectCheckBoxHierarchy = SelectCheckBoxHierarchy;
            TaxGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            TaxGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            TaxGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            TaxGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            TaxGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;

            /*  For table */
            TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            TaxGeneralCtrl.ePage.Masters.Enable = true;
            TaxGeneralCtrl.ePage.Masters.selectedRow = -1;
            TaxGeneralCtrl.ePage.Masters.emptyText = '-';

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

        //#region  AddRow
        function AddNewRow(){
            var obj = {
                "PK": "",
                "TaxSubCode":"",
                "TaxSubCodeRate":"",
                "IsModified": false,
                "IsDeleted": false,
            };

            TaxGeneralCtrl.ePage.Entities.Header.Data.UITaxHierarchy.push(obj);
            TaxGeneralCtrl.ePage.Masters.selectedRow = TaxGeneralCtrl.ePage.Entities.Header.Data.UITaxHierarchy.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("TaxGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
        }

        function setSelectedRow($index) {
            TaxGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox(){
            // var Checked = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
            //     if (!value.SingleSelect)
            //         return true;
            // });
            // if (Checked) {
            //     FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            // } else {
            //     FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            // }

            // var Checked1 = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
            //     return value.SingleSelect == true;
            // });
            // if (Checked1 == true) {
            //     FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            //     FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            //     FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
            // } else {
            //     FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            //     FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            //     FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            // }
        }

        function SelectAllCheckBox(){
        }
        //#endregion

        Init();
    }
})();