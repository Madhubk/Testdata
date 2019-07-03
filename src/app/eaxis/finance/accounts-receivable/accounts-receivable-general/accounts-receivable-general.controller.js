(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountReceivableGeneralController", AccountReceivableGeneralController);

    AccountReceivableGeneralController.$inject = ["$timeout", "$filter", "helperService", "apiService", "accountReceivableConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function AccountReceivableGeneralController($timeout, $filter, helperService, apiService, accountReceivableConfig, APP_CONSTANT, toastr, confirmation) {
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

            /* For Table */
            AccountReceivableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            AccountReceivableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            AccountReceivableGeneralCtrl.ePage.Masters.EnableImportButton = true;
            AccountReceivableGeneralCtrl.ePage.Masters.Enable = true;
            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountReceivableGeneralCtrl.ePage.Masters.emptyText = '-';

            /* function */
            AccountReceivableGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            AccountReceivableGeneralCtrl.ePage.Masters.OnChangeExpectedTotal = OnChangeExpectedTotal;
            AccountReceivableGeneralCtrl.ePage.Masters.OnChangeTaxAmount = OnChangeTaxAmount;
            AccountReceivableGeneralCtrl.ePage.Masters.OnChangeGridDesc = OnChangeGridDesc;
            AccountReceivableGeneralCtrl.ePage.Masters.OnChangeGridAmount = OnChangeGridAmount;
            AccountReceivableGeneralCtrl.ePage.Masters.onChangeGridTax = onChangeGridTax;
            AccountReceivableGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            AccountReceivableGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            AccountReceivableGeneralCtrl.ePage.Masters.SelectAllLineCharges = SelectAllLineCharges;
            AccountReceivableGeneralCtrl.ePage.Masters.SingleSelectLineCharges = SingleSelectLineCharges;
            AccountReceivableGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AccountReceivableGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AccountReceivableGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            AccountReceivableGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            AccountReceivableGeneralCtrl.ePage.Masters.Import = Import;

            /* DatePicker */
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker = {};
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsPastToday = angular.copy(APP_CONSTANT.DatePicker);
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsAllDate = angular.copy(APP_CONSTANT.DatePicker);
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsPastToday['maxDate'] = new Date();
            //AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsToday = angular.copy(APP_CONSTANT.DatePicker);
            // AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsToday['maxDate'] = new Date();
            // AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OptionsToday['minDate'] = new Date();
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            accountReceivableConfig.InitBinding(AccountReceivableGeneralCtrl.currentAccountReceivable);
            InitAccountReceivable();
            GetNewCompanyAddress();
            GetDebtorAddress();
            console.log("Test",AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader);
        }

        //#region InitAccountReceivable
        function InitAccountReceivable() {
            if (AccountReceivableGeneralCtrl.currentAccountReceivable.isNew) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InvoiceDate = new Date();
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.PostDate = new Date();
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;

                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length > 0) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.map(function (value, key) {
                        value.LocalTotal = (parseFloat(value.JCOSCostAmt * value.TLExchangeRate) + parseFloat(value.JCOSCostGSTAmt * value.TLExchangeRate)).toFixed(2);
                    });
                }
            }
        }
        //#endregion

        //#region GetNewCompanyAddress, GetNewDebtorAddress
        function GetNewCompanyAddress() {
            var myvalue = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
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
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }

        function GetDebtorAddress() {
            var myvalue = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
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
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if (type == "Company") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Company = $item.Code + '-' + $item.Name;

                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Company) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency = $item.LocalCurrency;
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency = $item.LocalCurrency;
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = 1;

                    //#region Grid Amount, ExchangeRate Change
                    // if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length > 0) {
                    //     AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.map(function (value, key) {
                    //         value.TLRX_NKTransactionCurrency = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency;
                    //         value.TLExchangeRate = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate;
                    //     });
                    // }
                    //#endregion
                }

                angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
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
            else if (type == "Debtor") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Debtor = $item.ORG_Code + '-' + $item.ORG_Name;

                apiService.get("eAxisAPI", accountReceivableConfig.Entities.API.OrgHeader.API.GetById.Url + $item.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                            if (value.AddressType == "CRD") {
                                value.ORG_FK = response.data.Response.PK;
                                value.OAD_Address_FK = response.data.Response.OAD_PK;
                                value.Address1 = response.data.Response.OAD_Address1;
                                value.Address2 = response.data.Response.OAD_Address2;
                                value.State = response.data.Response.OAD_State;
                                value.PostCode = response.data.Response.OAD_PostCode;
                                value.City = response.data.Response.OAD_PostCode;
                                value.Email = response.data.Response.OAD_Email;
                                value.Mobile = response.data.Response.OAD_Mobile;
                                value.Phone = response.data.Response.OAD_Phone;
                                value.RN_NKCountryCode = response.data.Response.OAD_CountryCode;
                                value.Fax = response.data.Response.OAD_Fax;
                                value.TenantCode = "20CUB"
                            }
                        });
                    }
                });

                if ($item.APPaymentTermDays == 0) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.DueDate = new Date();
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.RequisitionDate = new Date();
                } else {
                    var _DueDate = new Date();
                    _DueDate.setDate(_DueDate.getDate() + $item.APPaymentTermDays);
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.DueDate = _DueDate;
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.RequisitionDate = _DueDate;
                }
            }
            else if (type == "Currency") {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency != AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency) {
                    var _filter = {
                        "FromCurrency": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency,
                        "NKExCurrency": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": accountReceivableConfig.Entities.API.MstRecentExchangeRate.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", accountReceivableConfig.Entities.API.MstRecentExchangeRate.API.FindAll.Url, _input).then(function (response) {
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

                    //#region Grid Amount, ExchangeRate Change
                    if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length > 0) {
                        AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.map(function (value, key) {
                            value.TLRX_NKTransactionCurrency = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency;
                            value.TLExchangeRate = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate;
                        });
                    }
                    //#endregion
                }
            }
            else if (type == "Charges") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLACCCode = $item.Code;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCACCCode = $item.Code;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLATCode = $item.TaxCode;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLATR_FK = $item.ATR_GSTRate;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TaxRate = $item.TaxRate;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLAGHAccountNum = $item.AGH_CostAccountNum;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLAGH_FK = $item.AGH_CostAccount;

                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLACC_FK && AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLJOB_FK) {
                    GetLineChargeDetail($index);
                }
            }
            else if (type == "Job") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLJOBJobNo = $item.JobNo;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCJOBJobNo = $item.JobNo;

                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLACC_FK && AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLJOB_FK) {
                    GetLineChargeDetail($index);
                }
            }
            else if (type == "Branch") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLBRNCHBranchCode = $item.Code;
            }
            else if (type == "Department") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLDEPDeptCode = $item.Code;
            }
        }
        //#endregion 

        //#region GetLineChargeDetail
        function GetLineChargeDetail($index) {
            var _filter = {
                "CMP_FK": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CMP_FK,
                "ACC_FK": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLACC_FK,
                "JOB_FK": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCJOB_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": accountReceivableConfig.Entities.API.AccountpayableListdata.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", accountReceivableConfig.Entities.API.AccountpayableListdata.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                        AccountReceivableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
                        AccountReceivableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                            if (value.SequenceNo == $index + 1) {
                                value.IsDeleted = true;
                            }

                            if (AccountReceivableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                                DeleteLineCharges();
                            }
                        });

                        AddLineCharges(response.data.Response, $index);
                    } else {
                        AddLineCharges(response.data.Response, $index);
                    }

                    AddAPLineDetails(response.data.Response, $index);
                } else if (response.data.Response.length == 0) {
                    if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                        AccountReceivableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
                        AccountReceivableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                            if (value.SequenceNo == $index + 1) {
                                value.IsDeleted = true;
                            }

                            if (AccountReceivableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                                DeleteLineCharges();
                            }
                        });
                    }
                }
            });
        }
        //#region 

        //#region AddLineCharges, DeleteLineCharges, RemoveLineCharges
        function AddLineCharges($item, $index) {
            AccountReceivableGeneralCtrl.ePage.Masters.FilterLineCharges = $filter('filter')($item, { TLLineType: 'ACR' });

            angular.forEach(AccountReceivableGeneralCtrl.ePage.Masters.FilterLineCharges, function (value, key) {
                value.SequenceNo = $index + 1;
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.push(value);
            });

            angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (value.JCORG_CostAccount == AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ORG_FK) {
                    value.SingleSelectDisabled = false;
                } else {
                    value.SingleSelectDisabled = true;
                }
            });
        }

        function DeleteLineCharges() {
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge = [];
            angular.forEach(AccountReceivableGeneralCtrl.ePage.Masters.LineCharges, function (value, key) {
                if (!value.IsDeleted) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.push(value);
                }
            });
        }

        function RemoveLineCharges($index) {
            if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                AccountReceivableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
                AccountReceivableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                    if (value.SequenceNo == $index + 1) {
                        value.IsDeleted = true;
                    }

                    if (AccountReceivableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                        DeleteLineCharges();
                    }
                });
            }
        }
        //#region 

        //#region AddAPLineDetails
        function AddAPLineDetails($item, $index) {
            AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges = $filter('filter')($item, { TLLineType: 'ACR' });

            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLLineDescription = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCDesc;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCDesc = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCDesc;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLBRNCHBranchCode = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLBRNCHBranchCode;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLBRNCHBranchName = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLBRNCHBranchName;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLBRN_FK = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLBRN_FK;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLDEPDeptCode = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLDEPDeptCode;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLDEPDeptName = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLDEPDeptName;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLDEP_FK = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLDEP_FK;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLRX_NKTransactionCurrency = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLRX_NKTransactionCurrency;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLExchangeRate;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostAmt = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCOSCostAmt;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostGSTAmt = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCOSCostGSTAmt
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLOSAmount = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLOSAmount;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLLineAmount = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLLineAmount;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCLocalCostAmt = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCLocalCostAmt;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLGSTVAT = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLGSTVAT;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLPK = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLPK;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCJCG_PK = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCJCG_PK;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLORG_FK = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLORG_FK;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLCMP_FK = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLCMP_FK;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLCMP_Code = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLCMP_Code;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLEntitySource = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLEntitySource;
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].CMN_TenantCode = AccountReceivableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].CMN_TenantCode;

            OnChangeGridAmount($index, AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostAmt);
        }
        //#endregion

        //#region OpenDatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            AccountReceivableGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region OnChangeExpected, OnChangeTaxAmount, OnChangeGridDesc, OnChangeGridAmount
        function OnChangeExpectedTotal($item) {
            if (!$item) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            }
        }

        function OnChangeTaxAmount($item, type) {
            if (!$item && type == "InclTax") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax = "";
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = "";
            } else if ($item && type == "InclTax") {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat($item) - parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax)).toFixed(2);
                }
            }

            if ($item && type == "Tax") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            } else if (!$item && type == "Tax") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = "";
            }

            if ($item && type == "ExclTax") {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            } else if (!$item && type == "ExclTax") {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax) {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax)).toFixed(2);;
                }
            }
        }

        function OnChangeGridDesc($index, $item) {
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCDesc = $item;
        }

        function OnChangeGridAmount($index, $item) {
            if ($item) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostGSTAmt = ($item * (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TaxRate / 100)).toFixed(2);

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLOSAmount = (parseFloat($item) + parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostGSTAmt)).toFixed(2);

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].LocalTotal = (parseFloat($item * AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate) + parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostGSTAmt * AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate)).toFixed(2);

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLLineAmount = (parseFloat($item) * parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate)).toFixed(2);
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCLocalCostAmt = (parseFloat($item) * parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate)).toFixed(2);

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLGSTVAT = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostGSTAmt) * parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate)).toFixed(2);
            }
        }

        function onChangeGridTax($index, $item) {
            if ($item) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLGSTVAT = (parseFloat($item) * parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate)).toFixed(2);

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].LocalTotal = (parseFloat(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].JCOSCostAmt * AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate) + parseFloat($item * AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[$index].TLExchangeRate)).toFixed(2);
            }
        }
        //#endregion

        //#region setSelectedRow, SelectAllCheckBox, SingleSelectCheckBox, 
        function setSelectedRow($index) {
            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.some(function (value, key) {
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
            angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata, function (value, key) {
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

        //#region SingleSelectLineCharges, SelectAllLineCharges
        function SelectAllLineCharges() {
            angular.forEach(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAllLineCharges) {
                    if (!value.SingleSelectDisabled) {
                        value.SingleSelect = true;
                        AccountReceivableGeneralCtrl.ePage.Masters.EnableImportButton = false;
                    }
                }
                else {
                    value.SingleSelect = false;
                    AccountReceivableGeneralCtrl.ePage.Masters.EnableImportButton = true;
                }
            });
        }

        function SingleSelectLineCharges() {
            var Checked = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAllLineCharges = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAllLineCharges = true;
            }

            var Checked1 = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                AccountReceivableGeneralCtrl.ePage.Masters.EnableImportButton = false;
            } else {
                AccountReceivableGeneralCtrl.ePage.Masters.EnableImportButton = true;
            }
        }
        //#endregion

        //#region AddNewRow,CopyRow,RemoveRow
        function AddNewRow() {
            var obj = {
                "PK": "",

                "TLACCCode": "",
                "TLACCDesc": "",
                "JCACCCode": "",
                "JCACCDesc": "",
                "TLACC_FK": "",
                "JCACC_FK": "",

                "JCChargeType": "",

                "TLJOBJobNo": "",
                "JCJOBJobNo": "",
                "TLJOB_FK": "",
                "JCJOB_FK": "",

                "TLLineDescription": "",
                "JCDesc": "",

                "TLBRNCHBranchCode": "",
                "TLBRNCHBranchName": "",
                "TLBRN_FK": "",

                "TLDEPDeptCode": "",
                "TLDEPDeptName": "",
                "TLDEP_FK": "",

                "TLRX_NKTransactionCurrency": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency,

                "TLExchangeRate": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate,

                "JCOSCostAmt": "",

                "TLATCode": "",
                "TLATDescription": "",
                "TLATR_FK": "",

                "TaxRate": "",
                "JCOSCostGSTAmt": "",

                "TLOSAmount": "",

                "LocalTotal": "",

                "TLLineAmount": "",
                "JCLocalCostAmt": "",

                "TLGSTVAT": "",

                "TLIsFinalCharge": true,

                "TLAGHAccountNum": "",
                "TLAGHDescription": "",
                "TLAGH_FK": "",

                "TLEntitySource": "AP",
                "CMN_TenantCode": "20CUB",
                "IsModified": false,
                "IsDeleted": false,
                "TLSequence": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length + 1,
                "JCDisplaySequence": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length + 1,
                "LineNo": AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length + 1
            };

            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.push(obj);
            AccountReceivableGeneralCtrl.ePage.Masters.selectedRow = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("AccountReceivableGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            AccountReceivableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length - 1; i >= 0; i--) {
                if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[i].SingleSelect) {
                    var obj = angular.copy(AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length + 1
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.splice(i + 1, 0, obj);
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
                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        // apiService.get("eAxisAPI", accountReceivableConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                        //     console.log("Success");
                        // });
                    }
                });

                for (var i = AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.length - 1; i >= 0; i--) {
                    if (AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[i].SingleSelect && AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata[i].IsDeleted) {
                        RemoveLineCharges(i);
                        AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata.splice(i, 1);
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

        //#region  Import
        function Import() {
            AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (value.SingleSelect && value.TLLineType == "ACR") {
                    AccountReceivableGeneralCtrl.ePage.Entities.Header.Data.UIAccountreceivablelistdata;
                }
            });
        }
        //#endregion

        Init();
    }
})();