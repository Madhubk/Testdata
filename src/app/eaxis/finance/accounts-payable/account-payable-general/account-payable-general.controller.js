(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableGeneralController", AccountPayableGeneralController);

    AccountPayableGeneralController.$inject = ["$timeout", "helperService", "apiService", "financeConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function AccountPayableGeneralController($timeout, helperService, apiService, financeConfig, APP_CONSTANT, toastr, confirmation) {
        var AccountPayableGeneralCtrl = this;

        function Init() {
            var currentAccountPayable = AccountPayableGeneralCtrl.currentAccountPayable[AccountPayableGeneralCtrl.currentAccountPayable.code].ePage.Entities;

            AccountPayableGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountPayable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountPayable
            };

            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress = [];

            /* For Table */
            AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.Enable = true;
            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountPayableGeneralCtrl.ePage.Masters.emptyText = '-';

            /* function */
            AccountPayableGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeExpectedTotal = OnChangeExpectedTotal;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeTaxAmount = OnChangeTaxAmount;
            AccountPayableGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            AccountPayableGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            AccountPayableGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AccountPayableGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AccountPayableGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            AccountPayableGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            /* DatePicker */
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker = {};
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsAllDate = APP_CONSTANT.DatePicker;
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.Options['maxDate'] = new Date();
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitAccountPayable();
            GetNewCompanyAddress();
            GetCreditorAddress();
        }

        //#region InitAccountPayable
        function InitAccountPayable() {
            if (AccountPayableGeneralCtrl.currentAccountPayable.isNew) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InvoiceDate = new Date();
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.PostDate = new Date();
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            } else {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;
            }
        }
        //#endregion

        //#region GetNewCompanyAddress, GetNewCreditorAddress
        function GetNewCompanyAddress() {
            var myvalue = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress.some(function (value, key) {
                return value.AddressType == "CMP";
            });

            if (!myvalue) {
                var obj = {
                    "AddressType": "CMP",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress.splice(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress.length + 1, 0, obj);
            }
        }

        function GetCreditorAddress() {
            var myvalue = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress.some(function (value, key) {
                return value.AddressType == "CRD";
            });

            if (!myvalue) {
                var obj = {
                    "AddressType": "CRD",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress.splice(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress.length + 1, 0, obj);
            }
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if (type == "Company") {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CMP_Code) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency = $item.LocalCurrency;
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency = $item.LocalCurrency;
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = 1;
                }

                angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress, function (value, key) {
                    if (value.AddressType == "CMP") {
                        value.ORG_FK = $item.PK;
                        value.OAD_Address_FK = $item.ORG_Organization_FK;
                        value.Address1 = $item.Address1;
                        value.Address2 = $item.Address2;
                        value.State = $item.State;
                        value.PostCode = $item.PostCode;
                        value.City = $item.City;
                        value.Email = $item.Email;
                        value.Mobile = $item.Mobile;
                        value.Phone = $item.Phone;
                        value.RN_NKCountryCode = $item.CountryCode;
                        value.Fax = $item.Fax;
                        value.TenantCode = "20CUB"
                    }
                });
            }
            else if (type == "Creditor") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ORG_Code = $item.Code;

                angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAPAddress, function (value, key) {
                    if (value.AddressType == "CRD") {
                        value.ORG_FK = $item.PK;
                        value.OAD_Address_FK = $item.OAD_PK;
                        value.Address1 = $item.OAD_Address1;
                        value.Address2 = $item.OAD_Address2;
                        value.State = $item.OAD_State;
                        value.PostCode = $item.OAD_PostCode;
                        value.City = $item.OAD_PostCode;
                        value.Email = $item.OAD_Email;
                        value.Mobile = $item.OAD_Mobile;
                        value.Phone = $item.OAD_Phone;
                        value.RN_NKCountryCode = $item.OAD_CountryCode;
                        value.Fax = $item.OAD_Fax;
                        value.TenantCode = "20CUB"
                    }
                });
            }
            else if (type == "Currency") {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency != AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency) {
                    var _filter = {
                        "FromCurrency": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency,
                        "NKExCurrency": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": financeConfig.Entities.API.MstRecentExchangeRate.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", financeConfig.Entities.API.MstRecentExchangeRate.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response.length > 0) {
                            if (response.data.Response[0].TodayBuyrate == 0) {
                                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = response.data.Response[0].BaseRate;
                            } else {
                                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = response.data.Response[0].TodayBuyrate;
                            }
                        } else {
                            toastr.warning("Not Avaliable ExchangeRate Currency");
                            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency;
                            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = 1;
                        }
                    });
                }
            }
        }
        //#endregion 

        //#region OpenDatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region OnChangeExpected, OnChangeTaxAmount
        function OnChangeExpectedTotal($item) {
            if (!$item) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;
            } else {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            }
        }

        function OnChangeTaxAmount($item, type) {
            if (type == "Tax") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            }
            else if (type == "ExclTax") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            }
        }
        //#endregion

        //#region setSelectedRow, SelectAllCheckBox, SingleSelectCheckBox, 
        function setSelectedRow($index) {
            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            } else {
                AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata, function (value, key) {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                    AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = false;

                }
                else {
                    value.SingleSelect = false;
                    AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                    AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                }
            });
        }
        //#endregion 

        //#region AddNewRow,CopyRow,RemoveRow
        function AddNewRow() {
            var obj = {
                "PK": "",

                "TLCharges": "",
                "TLACC_FK": "",
                "JCACC_FK": "",

                "TLChargeType": "",
                "JCChargeType": "",

                "TLJob": "",
                "TLJOB_FK": "",
                "JCJOB_FK": "",

                "TLLineDescription": "",
                "JCDesc": "",

                "TLBRN_Code": "",
                "TLBRN_FK": "",

                "TLDEP_Code": "",
                "TLDEP_FK": "",

                "TLRX_NKTransactionCurrency": "",

                "TLExchangeRate": "",

                "TLLineAmount": "",

                "TLTaxID": "",
                "TLATR_FK": "",

                "TL_OSTaxAmount": "",

                "TLOSAmount": "",

                "TLLocalTotal": "",

                "TLLocalAmount": "",

                "TLGSTVAT": "",

                "IsFinalCharge": "",

                "TLGLAccount": "",
                "TLAGH_FK": "",

                "TLJobLocalRef": "",

                "TLLineType": "CST",

                "Source": "AP",
                "TenantCode": "20CUB",
                "IsModified": false,
                "IsDeleted": false,
                "TLSequence": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1,
                "JCDisplaySequence": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1,
                "LineNo": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1
            };

            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.push(obj);
            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("AccountPayableGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1; i >= 0; i--) {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].SingleSelect) {
                    var obj = angular.copy(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.splice(i + 1, 0, obj);
                }
            }

            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        // apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                        //     console.log("Success");
                        // });
                    }
                });

                for (var i = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1; i >= 0; i--) {
                    if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].SingleSelect && AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].IsDeleted) {
                        AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.splice(i, 1);
                    }
                }

                AccountPayableGeneralCtrl.ePage.Masters.selectedRow = -1;
                AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        Init();
    }
})();