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

            AccountPayableGeneralCtrl.ePage.Masters.InvoiceTotalText = "Invoice Total:";
            AccountPayableGeneralCtrl.ePage.Masters.TaxText = "Tax:";

            /* For Table */
            AccountPayableGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.EnableImportButton = true;
            AccountPayableGeneralCtrl.ePage.Masters.Enable = true;
            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = -1;
            AccountPayableGeneralCtrl.ePage.Masters.emptyText = '-';
            AccountPayableGeneralCtrl.ePage.Masters.SelectedIsReverseDate = [];
            AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate = [];
            AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource = [];

            /* function */
            AccountPayableGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeExpectedTotal = OnChangeExpectedTotal;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeTaxAmount = OnChangeTaxAmount;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeGridDesc = OnChangeGridDesc;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeGridAmount = OnChangeGridAmount;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeGridTax = OnChangeGridTax;
            AccountPayableGeneralCtrl.ePage.Masters.OnChangeGirdLocalTotal = OnChangeGirdLocalTotal;
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
            GetNewCompanyAddress();
            GetCreditorAddress();
            InitAccountPayable();
            CalculationMode();

            AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource = angular.copy(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge);
        }

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

        //#region InitAccountPayable
        function InitAccountPayable() {
            if (AccountPayableGeneralCtrl.currentAccountPayable.isNew) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.InvoiceDate = new Date();
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.PostDate = new Date();
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = true;
            } else {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ExpectedTotal = false;

                if (AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.length > 0) {
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata = $filter('filter')(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata, { TLLineType: 'ACR' });
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                        value.LocalTotal = (parseFloat(value.JCOSCostAmt * value.TLExchangeRate) + parseFloat(value.JCOSCostGSTAmt * value.TLExchangeRate)).toFixed(2);
                    });
                }
            }
        }
        //#endregion

        //#region CalculationMode
        function CalculationMode() {
            var _InvoiceAmount = 0,
                _TaxAmount = 0;

            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata.map(function (value, key) {
                if (value.LocalTotal) {
                    _InvoiceAmount = _InvoiceAmount + parseFloat(value.LocalTotal);
                }

                if (value.JCOSCostGSTAmt) {
                    _TaxAmount = _TaxAmount + parseFloat(value.JCOSCostGSTAmt);
                }
            });
            AccountPayableGeneralCtrl.ePage.Masters.InvoiceTotal = _InvoiceAmount;
            AccountPayableGeneralCtrl.ePage.Masters.Tax = _TaxAmount;
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
                        value.TenantCode = "20CUB";
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
                                value.TenantCode = "20CUB";
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
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLLineDescription = $item.Desc;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDesc = $item.Desc;
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
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.JOB_FK = $item.PK;
                AccountPayableGeneralCtrl.ePage.Masters.SelectedJobNo = AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLJOBJobNo;

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
                "FilterID": accountPayableConfig.Entities.API.AccountPayableListdata.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", accountPayableConfig.Entities.API.AccountPayableListdata.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    if (AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource.length > 0) {
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource);
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                            if (value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence) {
                                value.IsDeleted = true;
                            }

                            if (AccountPayableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                                DeleteLineCharges($index);

                            }
                        });
                        AddLineCharges(response.data.Response, $index);
                    } else {
                        AddLineCharges(response.data.Response, $index);
                    }

                    AddAPLineDetails(response.data.Response, $index);
                } else if (response.data.Response.length == 0) {
                    if (AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource.length > 0) {
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource);
                        AccountPayableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                            if (value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence) {
                                value.IsDeleted = true;
                            }

                            if (AccountPayableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                                DeleteLineCharges($index);
                            }
                        });
                    }
                }
            });
        }
        //#region 

        //#region AddLineCharges, DeleteLineCharges, RemoveLineCharges
        function AddLineCharges($item, $index) {
            AccountPayableGeneralCtrl.ePage.Masters.SelectedACRLineCharges = $filter('filter')($item, { TLLineType: 'ACR' });
            AccountPayableGeneralCtrl.ePage.Masters.SelectedIsReverseDate = $filter('filter')(AccountPayableGeneralCtrl.ePage.Masters.SelectedACRLineCharges, function (value, key) {
                return value.TLReverseDate != null;
            });

            angular.forEach(AccountPayableGeneralCtrl.ePage.Masters.SelectedIsReverseDate, function (value, key) {
                value.SequenceNo = $index + 1;
                AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource.push(value);
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge = $filter('filter')(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource, function (value, key) {
                    return value.JCJOBJobNo == AccountPayableGeneralCtrl.ePage.Masters.SelectedJobNo && value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence;
                });
            });

            angular.forEach(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (value.JCORG_CostAccount == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccTransactionHeader.ORG_FK) {
                    value.SingleSelectDisabled = false;
                } else {
                    value.SingleSelectDisabled = true;
                }
            });
        }

        function DeleteLineCharges($index) {
            AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource = [];
            AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge = $filter('filter')(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource, { JCJOBJobNo: AccountPayableGeneralCtrl.ePage.Masters.SelectedJobNo });

            angular.forEach(AccountPayableGeneralCtrl.ePage.Masters.LineCharges, function (value, key) {
                if (!value.IsDeleted) {
                    AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource.push(value);
                    AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge = $filter('filter')(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource, function (value, key) {
                        return value.JCJOBJobNo == AccountPayableGeneralCtrl.ePage.Masters.SelectedJobNo && value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence;
                    });
                }
            });
        }

        function RemoveLineCharges($index) {
            if (AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource.length > 0) {
                AccountPayableGeneralCtrl.ePage.Masters.LineCharges = angular.copy(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource);
                AccountPayableGeneralCtrl.ePage.Masters.LineCharges.map(function (value, key) {
                    if (value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence) {
                        value.IsDeleted = true;
                    }

                    if (AccountPayableGeneralCtrl.ePage.Masters.LineCharges.length - 1 == key) {
                        DeleteLineCharges($index);
                    }
                });
            }
        }
        //#region 

        //#region AddAPLineDetails
        function AddAPLineDetails($item, $index) {
            AccountPayableGeneralCtrl.ePage.Masters.SelectedACRLineCharges = $filter('filter')($item, { TLLineType: 'ACR' });
            AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate = $filter('filter')(AccountPayableGeneralCtrl.ePage.Masters.SelectedACRLineCharges, function (value, key) {
                return value.TLReverseDate == null;
            });

            if (AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate.length > 0) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLLineDescription = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCDesc;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDesc = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCDesc;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRNCHBranchCode = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLBRNCHBranchCode;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRNCHBranchName = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLBRNCHBranchName;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLBRN_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLBRN_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEPDeptCode = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLDEPDeptCode;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEPDeptName = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLDEPDeptName;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLDEP_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLDEP_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLRX_NKTransactionCurrency = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLRX_NKTransactionCurrency;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLExchangeRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSCostAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSCostGSTAmt
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLOSAmount = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLOSAmount;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLLineAmount = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLLineAmount;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCLocalCostAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCLocalCostAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLGSTVAT = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLGSTVAT;

                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLPK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLPK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLORG_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLORG_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLCMP_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLCMP_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLCMP_Code = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLCMP_Code;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLEntitySource = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].TLEntitySource;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].CMN_TenantCode = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].CMN_TenantCode;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCABA_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCABA_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCACB_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCACB_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAIM_CostVATClass = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAIM_CostVATClass;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAIM_SellVATClass = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAIM_SellVATClass;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAPInvoiceDate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAPInvoiceDate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAPInvoiceNum = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAPInvoiceNum;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAPLinePostingStatus = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAPLinePostingStatus;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAPNumberOfSupportingDocuments = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAPNumberOfSupportingDocuments;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCARLinePostingStatus = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCARLinePostingStatus;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCARNumberOfSupportingDocuments = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCARNumberOfSupportingDocuments;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCATL_APLine = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCATL_APLine;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCATL_ARLine = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCATL_ARLine;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCATL_CFXLine = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCATL_CFXLine;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCATR_CostGSTRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCATR_CostGSTRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCATR_SellGSTRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCATR_SellGSTRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAWH_CostWHTRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAWH_CostWHTRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAWH_SellWHTRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAWH_SellWHTRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAgentDeclaredCostAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAgentDeclaredCostAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCAgentDeclaredSellAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCAgentDeclaredSellAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCBRN_InternalBranch = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCBRN_InternalBranch;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCChargeType = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCChargeType;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCChequeNo = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCChequeNo;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCCostRated = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCCostRated;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCCostRatingOverride = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCCostRatingOverride;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCCostRatingOverrideComment = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCCostRatingOverrideComment;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCCostReference = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCCostReference;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCCostpost = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCCostpost;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDEP_InternalDept = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCDEP_InternalDept;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDeclaredOSCostAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCDeclaredOSCostAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDesc = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCDesc;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCDisplaySequence = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCDisplaySequence;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCEstimatedCost = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCEstimatedCost;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCEstimatedRevenue = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCEstimatedRevenue;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCInvoiceType = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCInvoiceType;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCIsIncludedInProfitShare = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCIsIncludedInProfitShare;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCIsValid = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCIsValid;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJCC_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCJCC_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJCC_GatewaySellHeader = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCJCC_GatewaySellHeader;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJCG_PK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCJCG_PK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJOBJobNo = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCJOBJobNo;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJOB_FK = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCJOB_FK;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCJOB_InternalJob = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCJOB_InternalJob;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCLineCFX = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCLineCFX;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCLocalCostAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCLocalCostAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCLocalSellAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCLocalSellAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCMarginPercentage = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCMarginPercentage;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOAD_SellInvoiceAddress = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOAD_SellInvoiceAddress;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOCT_SellInvoiceContact = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOCT_SellInvoiceContact;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCORG_CostAccount = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCORG_CostAccount;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCORG_SellAccount = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCORG_SellAccount;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSCostAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostExRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSCostExRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostGSTAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSCostGSTAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostWHTAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSCostWHTAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSP_Product = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSP_Product;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSSellAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSSellAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSSellExRate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSSellExRate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSSellGSTAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSSellGSTAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSSellWHTAmt = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOSSellWHTAmt;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOrderReference = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCOrderReference;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCPaymentDate = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCPaymentDate;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCPaymentType = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCPaymentType;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCPreventInvoicePrintGrouping = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCPreventInvoicePrintGrouping;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCProFormaCost = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCProFormaCost;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCProFormaRevenue = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCProFormaRevenue;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCProductQuantity = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCProductQuantity;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCRX_NKCostCurrency = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCRX_NKCostCurrency;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCRX_NKSellCurrency = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCRX_NKSellCurrency;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCRevenuepost = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCRevenuepost;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCSellRated = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCSellRated;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCSellRatingOverride = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCSellRatingOverride;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCSellRatingOverrideComment = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCSellRatingOverrideComment;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCSellReference = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCSellReference;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCSource = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCSource;
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCStateId = AccountPayableGeneralCtrl.ePage.Masters.SelectedReverseDate[0].JCStateId

                OnChangeGridAmount($index, AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt);
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

            CalculationMode();
        }

        function OnChangeGridTax($index, $item) {
            if ($item && AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLGSTVAT = (parseFloat($item) * parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);
            }

            if ($item) {
                AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].LocalTotal = (parseFloat(AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].JCOSCostAmt * AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate) + parseFloat($item * AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLExchangeRate)).toFixed(2);
            }

            CalculationMode();
        }

        function OnChangeGirdLocalTotal($indx, $item) {
            CalculationMode();
        }
        //#endregion

        //#region setSelectedRow, SelectAllCheckBox, SingleSelectCheckBox, 
        function setSelectedRow($index, JobNo) {
            AccountPayableGeneralCtrl.ePage.Masters.selectedRow = $index;
            AccountPayableGeneralCtrl.ePage.Masters.SelectedJobNo = JobNo;

            if (AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource.length > 0) {
                angular.forEach(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource, function (value, key) {
                    if (value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence) {
                        AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge = $filter('filter')(AccountPayableGeneralCtrl.ePage.Masters.UIJobChargeMainSource, function (value, key) {
                            return value.JCJOBJobNo == AccountPayableGeneralCtrl.ePage.Masters.SelectedJobNo && value.SequenceNo == AccountPayableGeneralCtrl.ePage.Entities.Header.Data.UIAccountpayablelistdata[$index].TLSequence;
                        });
                    }
                });
            }
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
                        /* apiService.get("eAxisAPI", accountPayableConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        }); */
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