(function () {
    "use strict";

    angular.module("Application")
        .controller("CreditControlController", CreditControlController);

    CreditControlController.$inject = ["$uibModalInstance", "$timeout", "apiService", "appConfig", "organizationConfig", "authService", "helperService", "param", "CompanyDataIndex", "APP_CONSTANT", "confirmation", "toastr"];

    function CreditControlController($uibModalInstance, $timeout, apiService, appConfig, organizationConfig, authService, helperService, param, CompanyDataIndex, APP_CONSTANT, confirmation, toastr) {
        var CreditControlCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            CreditControlCtrl.ePage = {
                "Title": "",
                "Prefix": "CreditControll",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": angular.copy(currentOrganization)
            };
            
            CreditControlCtrl.ePage.Masters.param = angular.copy(param);
            CreditControlCtrl.ePage.Masters.CompanyDataIndex = angular.copy(CompanyDataIndex);

            CreditControlCtrl.ePage.Masters.CloseButtonText = "Close";
            CreditControlCtrl.ePage.Masters.SaveButtonText = "Save";

            /* Function */
            CreditControlCtrl.ePage.Masters.Close = Close;
            CreditControlCtrl.ePage.Masters.Validation = Validation;
            CreditControlCtrl.ePage.Masters.AddNewRow = AddNewRow;
            CreditControlCtrl.ePage.Masters.CopyRow = CopyRow;
            CreditControlCtrl.ePage.Masters.RemoveRow = RemoveRow;
            CreditControlCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            CreditControlCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            CreditControlCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            CreditControlCtrl.ePage.Masters.CreditLimitCalculation = CreditLimitCalculation;

            /* For Table */
            CreditControlCtrl.ePage.Masters.SelectAll = false;
            CreditControlCtrl.ePage.Masters.EnableCopyButton = true;
            CreditControlCtrl.ePage.Masters.EnableDeleteButton = true;
            CreditControlCtrl.ePage.Masters.Enable = true;
            CreditControlCtrl.ePage.Masters.selectedRow = -1;
            CreditControlCtrl.ePage.Masters.emptyText = '-';

            /* DatePicker */
            CreditControlCtrl.ePage.Masters.DatePicker = {};
            CreditControlCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CreditControlCtrl.ePage.Masters.DatePicker.isOpen = [];
            CreditControlCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            /* DropDown List */
            CreditControlCtrl.ePage.Masters.DropDownMasterList = {
                "CreditRating": {
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
                },
                "InvoiceType": {
                    "ListSource": []
                },
                "InvoiceTerms":{
                    "ListSource": []
                }
            };

            GetDropDownList();
            CreditLimitCalculation(CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].ARCreditLimit, CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].ARTemporaryCreditLimitIncrease);
        }

        //#region GetDropDownList
        function GetDropDownList() {
            var typeCodeList = ["CreditRating", "JobType", "BussType", "ModeofTransport", "InvoiceType", "InvoiceTerms"];
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
                        CreditControlCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CreditControlCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region DatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            CreditControlCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region CreditLimitCalculation
        function CreditLimitCalculation(Val1, Val2) {
            var _SumValue = 0;
            if (Val1 && !Val2) {
                CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].TempCreditLimit = parseFloat(Val1).toFixed(2);
            }
            else if (!Val1) {
                CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].ARTemporaryCreditLimitIncrease = "";
                CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].TempCreditLimit = "";
            }
            else if (Val1 && Val2) {
                _SumValue = parseFloat(Val1) + parseFloat(Val2);
                CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].TempCreditLimit = parseFloat(_SumValue).toFixed(2);
            }
        }
        //#endregion

        //#region AddNewRow, CopyRow, RemoveRow
        function AddNewRow() {
            var obj = {
                "PK": "",
                "JobType": "",
                "Direction": "",
                "TransportMode": "",
                "InvoiceType": "",
                "InvoiceTerm": "",
                "InvoiceDays": "",
                "InvoiceClass": "",
                "OCD_FK ": "",
                "AgreedPaymentMethod": "",
                "IsValid": false,
                "StateId": 0,
                "Source": "",
                "TenantCode": "20CUB",
                "IsModified": false,
                "IsDeleted": false,
            };
            CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.push(obj);
            CreditControlCtrl.ePage.Masters.selectedRow = CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("CreditControlCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
        }

        function CopyRow() {
            for (var i = CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.length - 1; i >= 0; i--) {
                if (CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms[i].SingleSelect) {
                    var obj = angular.copy(CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect = false;
                    obj.IsCopied = true;
                    CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.splice(i + 1, 0, obj);
                }
            }
            CreditControlCtrl.ePage.Masters.selectedRow = -1;
            CreditControlCtrl.ePage.Masters.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    angular.forEach(CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgARTerms.API.Delete.Url + value.PK).then(function (response) { });
                        }
                    });

                    for (var i = CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.length - 1; i >= 0; i--) {
                        if (CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms[i].SingleSelect == true)
                            CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.splice(i, 1);
                    }
                    toastr.success('Record Removed Successfully');
                    CreditControlCtrl.ePage.Masters.selectedRow = -1;
                    CreditControlCtrl.ePage.Masters.SelectAll = false;
                    CreditControlCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion

        function setSelectedRow(index) {
            CreditControlCtrl.ePage.Masters.selectedRow = index;
        }

        //#region Checkbox SingleSelectCheckBox, SelectAllCheckBox
        function SingleSelectCheckBox() {
            var Checked = CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                CreditControlCtrl.ePage.Masters.SelectAll = false;
            } else {
                CreditControlCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                CreditControlCtrl.ePage.Masters.EnableCopyButton = false;
                CreditControlCtrl.ePage.Masters.EnableDeleteButton = false;
            } else {
                CreditControlCtrl.ePage.Masters.EnableCopyButton = true;
                CreditControlCtrl.ePage.Masters.EnableDeleteButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(CreditControlCtrl.ePage.Entities.Header.Data.OrgCompanyData[CreditControlCtrl.ePage.Masters.CompanyDataIndex].OrgARTerms, function (value, key) {
                if (CreditControlCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    CreditControlCtrl.ePage.Masters.EnableCopyButton = false;
                    CreditControlCtrl.ePage.Masters.EnableDeleteButton = false;
                } else {
                    value.SingleSelect = false;
                    CreditControlCtrl.ePage.Masters.EnableCopyButton = true;
                    CreditControlCtrl.ePage.Masters.EnableDeleteButton = true;
                }
            });
        }
        //#endregion

        //#region Close , Validation With Save
        function Close() {
            $uibModalInstance.close();
        }

        function Validation(CurrentEntity) {
            CreditControlCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CreditControlCtrl.ePage.Masters.IsDisableSave = true;

            CreditControlCtrl.ePage.Entities.Header.Data[CurrentEntity] = filterObjectUpdate(CreditControlCtrl.ePage.Entities.Header.Data[CurrentEntity], "IsModified");

            CreditControlCtrl.ePage.Masters.param.Entity[CreditControlCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = CreditControlCtrl.ePage.Entities.Header.Data;

            helperService.SaveEntity(CreditControlCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status === "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        toastr.success("Saved Successfully...!");
                        $uibModalInstance.close(_exports);
                    }
                }
                else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    toastr.warning("Failed to Save...!");
                    CreditControlCtrl.ePage.Masters.SaveButtonText = "Save";
                    CreditControlCtrl.ePage.Masters.IsDisableSave = false;
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