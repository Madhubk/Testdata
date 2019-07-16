(function () {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyDetailsController", CompanyDetailsController);

    CompanyDetailsController.$inject = ["$timeout", "appConfig", "authService", "apiService", "companyConfig", "helperService", "confirmation"];

    function CompanyDetailsController($timeout, appConfig, authService, apiService, companyConfig, helperService, confirmation) {
        var CompanyDetailsCtrl = this;

        function Init() {
            var currentCompany = CompanyDetailsCtrl.currentCompany[CompanyDetailsCtrl.currentCompany.code].ePage.Entities;

            CompanyDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCompany
            };

            CompanyDetailsCtrl.ePage.Masters.TaxRegNoIsDisabled = true;
            CompanyDetailsCtrl.ePage.Masters.Config = companyConfig;

            /* Function */
            CompanyDetailsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            CompanyDetailsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            CompanyDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CompanyDetailsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CompanyDetailsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CompanyDetailsCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            CompanyDetailsCtrl.ePage.Masters.GSTOnChange = GSTOnChange;
            CompanyDetailsCtrl.ePage.Masters.OnChangeValidations = OnChangeValidations;

            CompanyDetailsCtrl.ePage.Masters.DropDownMasterList = {
                "ExRateType": {
                    "ListSource": []
                },
                "ExRateSubType": {
                    "ListSource": []
                },
                "JobType": {
                    "ListSource": []
                },
                "BussType": {
                    "ListSource": []
                },
                "ModeofTransport": {
                    "ListSource": []
                }
            };
            GetMastersDropDownList();
        }

        //#region GetMastersDropDownList 
        function GetMastersDropDownList() {
            var typeCodeList = ["EXRATETYPE", "EXSUBRATE", "MODEOFTRANSPORT", "JOBTYPE", "BUSSTYPE"];
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
                        CompanyDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CompanyDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region AddNewRow, RemoveRow
        function AddNewRow() {
            var obj = {
                "PK":"",
                "JobType": "",
                "BusinessType": "",
                "ModeOfTransport": "",
                "Currency": "",
                "CfxPercentage": "",
                "CfxMin": "",
                "CompanyFK": "",
                "IsModified": false,
                "IsDeleted": false,
                "LineNo": CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length + 1
            };

            CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.push(obj);
            CompanyDetailsCtrl.ePage.Masters.selectedRow = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("CompanyDetailsCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", companyConfig.Entities.API.Company.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
                    }
                });

                for (var i = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.length - 1; i >= 0; i--) {
                    if (CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift[i].SingleSelect && CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift[i].IsDeleted) {
                        CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.splice(i, 1);
                    }
                }

                CompanyDetailsCtrl.ePage.Masters.selectedRow = -1;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        //#region setSelectedRow, SingleSelectCheckBox, SelectAllCheckBox    
        function setSelectedRow($index) {
            CompanyDetailsCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
            } else {
                CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(CompanyDetailsCtrl.ePage.Entities.Header.Data.UICurrencyUplift, function (value, key) {
                if (CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                    CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                    CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                }
                else {
                    value.SingleSelect = false;
                    CompanyDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                    CompanyDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                    CompanyDetailsCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                }
            });
        }
        //#endregion

        //#region SelectedLookupData 
        function SelectedLookupData($index, $item, type) {
            if ($item) {
                if(type=='Country'){
                    OnChangeValidations($item.Code, 'E1335');
                }
                else if(type=='DefaultCurrency'){
                    OnChangeValidations($item.Code, 'E1336');
                }
                else if(type=='ReportingCurrency'){
                    OnChangeValidations($item.Code, 'E1338');
                }
            }
        }
        //#endregion

        //#region GSTOnChange 
        function GSTOnChange($item) {
            if ($item) {
                CompanyDetailsCtrl.ePage.Masters.TaxRegNoIsDisabled = false;
            }
            else {
                CompanyDetailsCtrl.ePage.Masters.TaxRegNoIsDisabled = true;
            }
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValidations(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(CompanyDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                CompanyDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CompanyDetailsCtrl.currentCompany.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                CompanyDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CompanyDetailsCtrl.currentCompany.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init();
    }
})();
