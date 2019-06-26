(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableGeneralController", AccountPayableGeneralController);

    AccountPayableGeneralController.$inject = ["$timeout", "$filter", "helperService", "apiService", "accountPayableConfig", "APP_CONSTANT", "toastr", "confirmation"];

    function AccountPayableGeneralController($timeout, $filter, helperService, apiService, accountPayableConfig, APP_CONSTANT, toastr, confirmation) {
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

            /* For Table */
            AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.EnableImportButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.Enable = true;
            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountPayableGeneralCtrl.ePage.Masters.emptyText = '-';

            /* function */
            AccountPayableGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeExpectedTotal = OnChangeExpectedTotal;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeTaxAmount = OnChangeTaxAmount;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeGridDesc = OnChangeGridDesc;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeGridAmount = OnChangeGridAmount;
            AccountPayableGeneralCtrl.ePage.Masters.onChangeGridTax = onChangeGridTax;
            AccountPayableGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            AccountPayableGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            AccountPayableGeneralCtrl.ePage.Masters.SelectAllLineCharges = SelectAllLineCharges;
            AccountPayableGeneralCtrl.ePage.Masters.SingleSelectLineCharges = SingleSelectLineCharges;
            AccountPayableGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AccountPayableGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AccountPayableGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            AccountPayableGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            AccountPayableGeneralCtrl.ePage.Masters.Import = Import;

            /* DatePicker */
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker = {};
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsPastToday = angular.copy(APP_CONSTANT.DatePicker);
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsAllDate = angular.copy(APP_CONSTANT.DatePicker);
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsPastToday['maxDate'] = new Date();
            //AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsToday = angular.copy(APP_CONSTANT.DatePicker);
            // AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsToday['maxDate'] = new Date();
            // AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OptionsToday['minDate'] = new Date();
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            accountPayableConfig.InitBinding(AccountPayableGeneralCtrl.currentAccountPayable);
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

                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length > 0) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                        value.LocalTotal = (parseFloat(value.JCOSCostAmt * value.TLExchangeRate) + parseFloat(value.JCOSCostGSTAmt * value.TLExchangeRate)).toFixed(2);
                    });
                }
            }
        }
        //#endregion

        //#region GetNewCompanyAddress, GetNewCreditorAddress
        function GetNewCompanyAddress() {
            var myvalue = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
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
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }

        function GetCreditorAddress() {
            var myvalue = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
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
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if (type == "Company") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Company = $item.Code + '-' + $item.Name;

                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Company) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency = $item.LocalCurrency;
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency = $item.LocalCurrency;
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate = 1;

                    //#region Grid Amount, ExchangeRate Change
                    // if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length > 0) {
                    //     AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                    //         value.TLRX_NKTransactionCurrency = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency;
                    //         value.TLExchangeRate = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate;
                    //     });
                    // }
                    //#endregion
                }

                angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
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
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Creditor = $item.ORG_Code + '-' + $item.ORG_Name;

                apiService.get("eAxisAPI", accountPayableConfig.Entities.API.OrgHeader.API.GetById.Url + $item.ORG_FK).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
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
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.DueDate = new Date();
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.RequisitionDate = new Date();
                } else {
                    var _DueDate = new Date();
                    _DueDate.setDate(_DueDate.getDate() + $item.APPaymentTermDays);
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.DueDate = _DueDate;
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.RequisitionDate = _DueDate;
                }
            }
            else if (type == "Currency") {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency != AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency) {
                    var _filter = {
                        "FromCurrency": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency,
                        "NKExCurrency": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CompanyLocalCurrency
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": accountPayableConfig.Entities.API.MstRecentExchangeRate.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", accountPayableConfig.Entities.API.MstRecentExchangeRate.API.FindAll.Url, _input).then(function (response) {
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

                    //#region Grid Amount, ExchangeRate Change
                    if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length > 0) {
                        AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                            value.TLRX_NKTransactionCurrency = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency;
                            value.TLExchangeRate = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate;
                        });
                    }
                    //#endregion
                }
            }
            else if (type == "Charges") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLACCCode = $item.Code;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCACCCode = $item.Code;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLATCode = $item.TaxCode;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLATR_FK = $item.ATR_GSTRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TaxRate = $item.TaxRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLAGHAccountNum = $item.AGH_CostAccountNum;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLAGH_FK = $item.AGH_CostAccount;

                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLACC_FK && AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLJOB_FK) {
                    GetLineChargeDetail($index);
                }
            }
            else if (type == "Job") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLJOBJobNo = $item.JobNo;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJOBJobNo = $item.JobNo;

                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLACC_FK && AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLJOB_FK) {
                    GetLineChargeDetail($index);
                }
            }
            else if (type == "Branch") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRNCHBranchCode = $item.Code;
            }
            else if (type == "Department") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEPDeptCode = $item.Code;
            }
        }
        //#endregion 

        //#region GetLineChargeDetail
        function GetLineChargeDetail($index) {
            var _filter = {
                "CMP_FK": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CMP_FK,
                "ACC_FK": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLACC_FK,
                "JOB_FK": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJOB_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": accountPayableConfig.Entities.API.AccountpayableListdata.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", accountPayableConfig.Entities.API.AccountpayableListdata.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                            if (value.SequenceNo == $index + 1) {
                                value.IsDeleted = true;
                            }

                            if (AccountPayableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                                DeleteLineCharges();
                            }
                        });

                        AddLineCharges(response.data.Response, $index);
                    } else {
                        AddLineCharges(response.data.Response, $index);
                    }

                    AddAPLineDetails(response.data.Response, $index);
                } else if (response.data.Response.length == 0) {
                    if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                            if (value.SequenceNo == $index + 1) {
                                value.IsDeleted = true;
                            }

                            if (AccountPayableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
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
            AccountPayableGeneralCtrl.ePage.Masters.FilterLineCharges = $filter('filter')($item, { TLLineType: 'ACR' });

            angular.forEach(AccountPayableGeneralCtrl.ePage.Masters.FilterLineCharges, function (value, key) {
                value.SequenceNo = $index + 1;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.push(value);
            });

            angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (value.JCORG_CostAccount == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ORG_FK) {
                    value.SingleSelectDisabled = false;
                } else {
                    value.SingleSelectDisabled = true;
                }
            });
        }

        function DeleteLineCharges() {
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge = [];
            angular.forEach(AccountPayableGeneralCtrl.ePage.Masters.LineCharges, function (value, key) {
                if (!value.IsDeleted) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.push(value);
                }
            });
        }

        function RemoveLineCharges($index) {
            if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                AccountPayableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
                AccountPayableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                    if (value.SequenceNo == $index + 1) {
                        value.IsDeleted = true;
                    }

                    if (AccountPayableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                        DeleteLineCharges();
                    }
                });
            }
        }
        //#region 

        //#region AddAPLineDetails
        function AddAPLineDetails($item, $index) {
            AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges = $filter('filter')($item, { TLLineType: 'ACR' });

            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLLineDescription = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCDesc;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDesc = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCDesc;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRNCHBranchCode = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLBRNCHBranchCode;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRNCHBranchName = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLBRNCHBranchName;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRN_FK = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLBRN_FK;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEPDeptCode = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLDEPDeptCode;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEPDeptName = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLDEPDeptName;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEP_FK = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLDEP_FK;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLRX_NKTransactionCurrency = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLRX_NKTransactionCurrency;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLExchangeRate;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCOSCostAmt;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCOSCostGSTAmt
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLOSAmount = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLOSAmount;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLLineAmount = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLLineAmount;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCLocalCostAmt = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCLocalCostAmt;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLGSTVAT = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLGSTVAT;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLPK = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLPK;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJCG_PK = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].JCJCG_PK;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLORG_FK = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLORG_FK;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLCMP_FK = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLCMP_FK;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLCMP_Code = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLCMP_Code;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLEntitySource = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].TLEntitySource;
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].CMN_TenantCode = AccountPayableGeneralCtrl.ePage.Masters.FilterAPLineCharges[0].CMN_TenantCode;

            OnChangeGridAmount($index, AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt);
        }
        //#endregion

        //#region OpenDatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            AccountPayableGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region OnChangeExpected, OnChangeTaxAmount, OnChangeGridDesc, OnChangeGridAmount
        function OnChangeExpectedTotal($item) {
            if (!$item) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;
            } else {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            }
        }

        function OnChangeTaxAmount($item, type) {
            if (!$item && type == "InclTax") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax = "";
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = "";
            } else if ($item && type == "InclTax") {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat($item) - parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax)).toFixed(2);
                }
            }

            if ($item && type == "Tax") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            } else if (!$item && type == "Tax") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = "";
            }

            if ($item && type == "ExclTax") {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat($item)).toFixed(2);
            } else if (!$item && type == "ExclTax") {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExclTax = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InclTax) - parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.Tax)).toFixed(2);;
                }
            }
        }

        function OnChangeGridDesc($index, $item) {
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDesc = $item;
        }

        function OnChangeGridAmount($index, $item) {
            if ($item) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt = ($item * (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TaxRate / 100)).toFixed(2);

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLOSAmount = (parseFloat($item) + parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt)).toFixed(2);

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].LocalTotal = (parseFloat($item * AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate) + parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt * AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLLineAmount = (parseFloat($item) * parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCLocalCostAmt = (parseFloat($item) * parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLGSTVAT = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt) * parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);
            }
        }

        function onChangeGridTax($index, $item) {
            if ($item) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLGSTVAT = (parseFloat($item) * parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].LocalTotal = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt * AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate) + parseFloat($item * AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);
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

        //#region SingleSelectLineCharges, SelectAllLineCharges
        function SelectAllLineCharges() {
            angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAllLineCharges) {
                    if (!value.SingleSelectDisabled) {
                        value.SingleSelect = true;
                        AccountPayableGeneralCtrl.ePage.Masters.EnableImportButton = false;
                    }
                }
                else {
                    value.SingleSelect = false;
                    AccountPayableGeneralCtrl.ePage.Masters.EnableImportButton = true;
                }
            });
        }

        function SingleSelectLineCharges() {
            var Checked = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAllLineCharges = false;
            } else {
                AccountPayableGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAllLineCharges = true;
            }

            var Checked1 = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                AccountPayableGeneralCtrl.ePage.Masters.EnableImportButton = false;
            } else {
                AccountPayableGeneralCtrl.ePage.Masters.EnableImportButton = true;
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

                "TLRX_NKTransactionCurrency": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.CUR_NKTransactionCurrency,

                "TLExchangeRate": AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExchangeRate,

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
                        // apiService.get("eAxisAPI", accountPayableConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                        //     console.log("Success");
                        // });
                    }
                });

                for (var i = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length - 1; i >= 0; i--) {
                    if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].SingleSelect && AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[i].IsDeleted) {
                        RemoveLineCharges(i);
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

        //#region  Import
        function Import() {
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (value.SingleSelect && value.TLLineType == "ACR") {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata;
                }
            });
        }
        //#endregion

        Init();
    }
})();