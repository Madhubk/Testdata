(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountReceivableGeneralController", AccountReceivableGeneralController);

        AccountReceivableGeneralController.$inject = ["$timeout", "helperService", "apiService", "financeConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function AccountReceivableGeneralController($timeout, helperService, apiService, financeConfig, APP_CONSTANT, toastr, confirmation) {
        var AccountReceivableGeneralCtrl = this;

        function Init() {
            debugger;
            var currentAccountReceivable = AccountReceivableGeneralCtrl.currentAccountReceivable[AccountReceivableGeneralCtrl.currentAccountReceivable.code].ePage.Entities;

            AccountReceivableGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "AccountPayable_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAccountReceivable
            };

            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress = [];

            /* For Table */
            AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            AccountReceivableGeneralCtrl.ePage.Masters.Enable = true;
            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountReceivableGeneralCtrl.ePage.Masters.emptyText = '-';

            /* function */
            AccountReceivableGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            AccountReceivableGeneralCtrl.ePage.Masters.OnChangeExpectedTotal = OnChangeExpectedTotal;
            AccountReceivableGeneralCtrl.ePage.Masters.OnChangeTaxAmount = OnChangeTaxAmount;
            AccountReceivableGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            AccountReceivableGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            AccountReceivableGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AccountReceivableGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AccountReceivableGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            AccountReceivableGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            /* DatePicker */
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker = {};
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsAllDate = APP_CONSTANT.DatePicker;
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.Options['maxDate'] = new Date();
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitAccountReceivable();
            GetNewCompanyAddress();
            GetCreditorAddress();
        }

        //#region InitAccountReceivable
        function InitAccountReceivable() {
            if (AccountReceivableGeneralCtrl.currentAccountReceivable.isNew) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InvoiceDate = new Date();
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.PostDate = new Date();
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;
            }
        }
        //#endregion

        //#region GetNewCompanyAddress, GetNewCreditorAddress
        function GetNewCompanyAddress() {
            var myvalue = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress.some(function (value, key) {
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
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress.splice(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress.length + 1, 0, obj);
            }
        }

        function GetCreditorAddress() {
            var myvalue = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress.some(function (value, key) {
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
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress.splice(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress.length + 1, 0, obj);
            }
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if (type == "Company") {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CMP_Code) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency = $item.LocalCurrency;
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency = $item.LocalCurrency;
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = 1;
                }

                angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress, function (value, key) {
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
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ORG_Code = $item.Code;

                angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIARAddress, function (value, key) {
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
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency != AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency) {
                    var _filter = {
                        "FromCurrency": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency,
                        "NKExCurrency": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": financeConfig.Entities.API.MstRecentExchangeRate.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", financeConfig.Entities.API.MstRecentExchangeRate.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response.length > 0) {
                            if (response.data.Response[0].TodayBuyrate == 0) {
                                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = response.data.Response[0].BaseRate;
                            } else {
                                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = response.data.Response[0].TodayBuyrate;
                            }
                        } else {
                            toastr.warning("Not Avaliable ExchangeRate Currency");
                            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency;
                            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = 1;
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
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region OnChangeExpected, OnChangeTaxAmount
        function OnChangeExpectedTotal($item) {
            if (!$item) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            }
        }

        function OnChangeTaxAmount($item, type) {
            if (type == "Tax") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            }
            else if (type == "ExclTax") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            }
        }
        //#endregion

        //#region setSelectedRow, SelectAllCheckBox, SingleSelectCheckBox, 
        function setSelectedRow($index) {
            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata, function (value, key) {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                    AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = false;

                }
                else {
                    value.SingleSelect = false;
                    AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                    AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
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
                "TLSequence": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1,
                "JCDisplaySequence": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1,
                "LineNo": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1
            };

            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.push(obj);
            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("AccountReceivableGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1; i >= 0; i--) {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].SingleSelect) {
                    var obj = angular.copy(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length + 1
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.splice(i + 1, 0, obj);
                }
            }

            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        // apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                        //     console.log("Success");
                        // });
                    }
                });

                for (var i = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1; i >= 0; i--) {
                    if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].SingleSelect && AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].IsDeleted) {
                        AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.splice(i, 1);
                    }
                }

                AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = -1;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        Init();
    }
})();