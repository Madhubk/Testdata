(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobGeneralController", FinanceJobGeneralController);

    FinanceJobGeneralController.$inject = ["$uibModal", "$scope", "$filter", "$timeout", "APP_CONSTANT", "apiService", "financeConfig", "appConfig", "helperService", "authService", "confirmation", "toastr"];

    function FinanceJobGeneralController($uibModal, $scope, $filter, $timeout, APP_CONSTANT, apiService, financeConfig, appConfig, helperService, authService, confirmation, toastr) {
        var FinanceJobGeneralCtrl = this;

        function Init() {
            var currentFinanceJob = FinanceJobGeneralCtrl.currentFinanceJob[FinanceJobGeneralCtrl.currentFinanceJob.code].ePage.Entities;

            FinanceJobGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFinanceJob
            };

            FinanceJobGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            FinanceJobGeneralCtrl.ePage.Masters.UIJobDisabled = {};

            FinanceJobGeneralCtrl.ePage.Masters.ChargeDeatailsGrid = "No records found...";
            FinanceJobGeneralCtrl.ePage.Masters.Cost = 0;
            FinanceJobGeneralCtrl.ePage.Masters.Revenue = 0;
            FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLoss = 0;
            FinanceJobGeneralCtrl.ePage.Masters.Config = financeConfig;

            FinanceJobGeneralCtrl.ePage.Masters.CloseButtonText = "Close";
            FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLossText = "Profit:";

            /* Function */
            FinanceJobGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            FinanceJobGeneralCtrl.ePage.Masters.OnChangeStatus = OnChangeStatus;
            FinanceJobGeneralCtrl.ePage.Masters.OnChangeValidation = OnChangeValidation;

            FinanceJobGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            FinanceJobGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            FinanceJobGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            FinanceJobGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            FinanceJobGeneralCtrl.ePage.Masters.MoreRecords = MoreRecords;
            FinanceJobGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            FinanceJobGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            FinanceJobGeneralCtrl.ePage.Masters.OnAmtChange = OnAmtChange;

            /* Function popup */
            FinanceJobGeneralCtrl.ePage.Masters.Close = Close;

            /* DatePicker */
            FinanceJobGeneralCtrl.ePage.Masters.DatePicker = {};
            FinanceJobGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            FinanceJobGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            FinanceJobGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            /*  For table */
            FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            FinanceJobGeneralCtrl.ePage.Masters.Enable = true;
            FinanceJobGeneralCtrl.ePage.Masters.selectedRow = -1;
            FinanceJobGeneralCtrl.ePage.Masters.emptyText = '-';

            /* DropDown List */
            FinanceJobGeneralCtrl.ePage.Masters.DropDownMasterList = {
                "FinanceStatus": {
                    "ListSource": []
                },
                "FinanceProfitLossReason": {
                    "ListSource": []
                }
            };

            financeConfig.InitBinding(FinanceJobGeneralCtrl.currentFinanceJob);
            InitBindFinanceJob();
            GetMastersDropDownList();
            GetNewLocalClientAddress();
            GetNewOverseasAgentAddress();
            CostCalculation();
            RevenueCalculation();
            ProfitAndLossCalculation();
        }

        //#region InitFinaceJob
        function InitBindFinanceJob() {
            if (FinanceJobGeneralCtrl.currentFinanceJob.isNew) {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.JobOpenDate = new Date();
            }
        }
        //#endregion

        //#region  DropDown List
        function GetMastersDropDownList() {
            var typeCodeList = ["FinanceStatus", "FinanceProfitLossReason"];
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
                        FinanceJobGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        FinanceJobGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];

                        if (FinanceJobGeneralCtrl.currentFinanceJob.isNew) {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.Status = "WRK";
                        }
                    });
                }
            });
        }
        //#endregion

        //#region GetNewLocalClientAddress, GetNewOverseasAgentAddress

        function GetNewLocalClientAddress() {
            var myvalue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == "LOC";
            });

            if (!myvalue) {
                var obj = {
                    "AddressType": "LOC",
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
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }

        function GetNewOverseasAgentAddress() {
            var myvalue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == "OSA";
            });

            if (!myvalue) {
                var obj = {
                    "AddressType": "OSA",
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
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if ($item) {
                if (type == 'Local') {
                    OnChangeValidation($item.Code, 'E1300');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalClient = $item.Code + ' - ' + $item.FullName;

                    angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                        if (value.AddressType == "LOC") {
                            value.ORG_FK = $item.PK;
                            value.OAD_Address_FK = $item.OAD_PK;
                            value.Address1 = $item.OAD_Address1;
                            value.Address2 = $item.OAD_Address2;
                            value.State = $item.OAD_State;
                            value.PostCode = $item.OAD_PostCode;
                            value.City = $item.OAD_City;
                            value.Email = $item.OAD_Email;
                            value.Mobile = $item.OAD_Mobile;
                            value.Phone = $item.OAD_Phone;
                            value.RN_NKCountryCode = $item.OAD_CountryCode;
                            value.Fax = $item.OAD_Fax;
                            value.TenantCode = "20CUB"
                        }
                    });
                }
                else if (type == 'Agent') {
                    OnChangeValidation($item.Code, 'E1301');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.OverseasAgent = $item.Code + ' - ' + $item.FullName;

                    angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                        if (value.AddressType == "OSA") {
                            value.ORG_FK = $item.PK;
                            value.OAD_Address_FK = $item.OAD_PK;
                            value.Address1 = $item.OAD_Address1;
                            value.Address2 = $item.OAD_Address2;
                            value.State = $item.OAD_State;
                            value.PostCode = $item.OAD_PostCode;
                            value.City = $item.OAD_City;
                            value.Email = $item.OAD_Email;
                            value.Mobile = $item.OAD_Mobile;
                            value.Phone = $item.OAD_Phone;
                            value.RN_NKCountryCode = $item.OAD_CountryCode;
                            value.Fax = $item.OAD_Fax;
                            value.TenantCode = "20CUB"
                        }
                    });
                }
                else if (type == 'Company') {
                    OnChangeValidation($item.Code, 'E1323');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.Company = $item.Code + ' - ' + $item.Name;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.GC = $item.PK;
                }
                else if (type == 'Branch') {
                    OnChangeValidation($item.Code, 'E1302');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.Branch = $item.Code + ' - ' + $item.BranchName;
                }
                else if (type == 'Department') {
                    OnChangeValidation($item.Code, 'E1303');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.Department = $item.Code + ' - ' + $item.Desc;
                }
                else if (type == 'ChargeCode') {
                    OnChangeValidation($item.Code, 'E1191');

                    if ($item.ChargeType == "REV") {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ChargeType = $item.ChargeType;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].TaxRate = $item.TaxRate;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APInvoiceNum = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APInvoiceDate = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedCost = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CostTaxCode = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostGSTAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostExRate = "";

                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RevenueTaxCode = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellGSTAmt = "";

                        CostCalculation();
                        RevenueCalculation();
                        ProfitAndLossCalculation();
                    } else {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ChargeType = $item.ChargeType;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].TaxRate = $item.TaxRate;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_Code;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_FK;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency;

                        //#region JobCharge OSExchangeRate Assign
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostExRate = 1;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellExRate = 1;
                        //#endregion

                        //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                        if ($item.MarginPercentage == 100 && $item.ChargeType == 'MRG') {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage = 100;
                        }
                        //#endregion
                    }

                    JobExchangeRateDelete($index, "CRD");
                    JobExchangeRateDelete($index, "DEB");
                }
                else if (type == 'ServiceBranch') {
                    OnChangeValidation($item.Code, 'E1305');
                }
                else if (type == 'ServiceDept') {
                    OnChangeValidation($item.Code, 'E1306');
                }
                else if (type == 'Creditor') {
                    OnChangeValidation($item.Code, 'E1310');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency;

                    JobExchangeRateDelete($index, "CRD");
                }
                else if (type == 'Debitor') {
                    OnChangeValidation($item.Code, 'E1311');

                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency;

                    JobExchangeRateDelete($index, "DEB");
                }
                else if (type == 'CostCurrency') {
                    OnChangeValidation($item.Code, 'E1307');

                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency) {
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.length > 0) {
                            //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                            if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100) {
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency
                            }
                            //#endregion

                            CalculateCost($index);

                            //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                            if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100) {
                                CalculateRevenue($index);
                            }
                            //#endregion
                        } else {
                            GetExchageRate($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode, "CRD", FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_CostAccount);
                        }

                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100) {
                            JobExchangeRateDelete($index, "CRD");
                            JobExchangeRateDelete($index, "DEB");
                        } else {
                            JobExchangeRateDelete($index, "CRD");
                        }
                    }
                    else if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency) {

                        //#region JobCharge OSExchangeRate Assign
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostExRate = 1;
                        //#endregion

                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt > 0) {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt;
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt;

                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt;
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt;
                        }

                        //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100) {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency;

                            if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt > 0) {
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt;

                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt;
                            }
                        }
                        //#endregion

                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100) {
                            JobExchangeRateDelete($index, "CRD");
                            JobExchangeRateDelete($index, "DEB");
                        } else {
                            JobExchangeRateDelete($index, "CRD");
                        }
                    }
                }
                else if (type == 'RevenueCurrency') {
                    OnChangeValidation($item.Code, 'E1193');

                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency) {
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.length > 0) {
                            CalculateRevenue($index);
                        } else {
                            GetExchageRate($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode, "DEB", FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount);
                        }

                        JobExchangeRateDelete($index, "DEB");
                    }
                    else if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency) {

                        //#region JobCharge OSExchangeRate Assign
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellExRate = 1;
                        //#endregion

                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt > 0) {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt;
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt;

                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt;
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt;
                        }
                    }

                    JobExchangeRateDelete($index, "DEB");
                }
            }
        }
        //#endregion

        //#region DatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            FinanceJobGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region  CalculateCost, CalculateRevenue
        function CalculateCost($index) {
            var obj;
            var _Available = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.some(function (value, key) {
                return value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_CostAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode;
            });

            var _AvailableExchangeRate = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.some(function (value, key) {
                return value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode;
            });

            if (_Available) {
                angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (value, key) {
                    if (value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_CostAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode) {

                        //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100 && !_AvailableExchangeRate) {
                            obj = {
                                "PK": "",
                                "FromCurrency": value.FromCurrency,
                                "RX_NKRateCurrency": value.RX_NKRateCurrency,
                                "BaseRate": value.BaseRate,
                                "TodayBuyrate": value.TodayBuyrate,
                                "Code": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode,
                                "OrgType": "DEB",
                                "OH_Org": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount,
                                "DisplaySeqNo": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DisplaySequence,
                                "EntitySource": "ERP",
                                "CreatedDateTime": new Date(),
                                "StateId": 0,
                                "IsModified": false,
                                "IsDeleted": false
                            };
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.push(obj);
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency;

                            CalculateRevenue($index);
                        }
                        //#endregion
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt) {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt / value.BaseRate;
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt / value.BaseRate;

                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost.toString();
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt.toString();

                            financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost, 'DuplicateEstimatedCost', 'EstimatedCost', FinanceJobGeneralCtrl.currentFinanceJob);
                            financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt, 'DuplicateOSCostAmt', 'OSCostAmt', FinanceJobGeneralCtrl.currentFinanceJob);

                            OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedCost, 'E1194', true, $index);
                            OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt, 'E1196', true, $index);
                        }

                        //#region JobCharge OSExchangeRate Assign
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostExRate = value.BaseRate;
                        //#endregion
                    }
                });
            } else {
                GetExchageRate($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode, "CRD", FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_CostAccount)
            }
        }

        function CalculateRevenue($index) {
            var _Available = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.some(function (value, key) {
                return value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode;
            });

            if (_Available) {
                angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (value, key) {
                    if (value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode) {
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt) {
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt / value.BaseRate;
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt / value.BaseRate;

                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue.toString();
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt.toString();

                            financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue, 'DuplicateEstimatedRevenue', 'EstimatedRevenue', FinanceJobGeneralCtrl.currentFinanceJob);
                            financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt, 'DuplicateOSSellAmt', 'OSSellAmt', FinanceJobGeneralCtrl.currentFinanceJob);

                            OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue, 'E1195', true, $index);
                            OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt, 'E1197', true, $index);
                        }

                        //#region JobCharge OSExchangeRate Assign
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellExRate = value.BaseRate;
                        //#endregion
                    }
                });
            } else {
                GetExchageRate($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode, "DEB", FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount)
            }
        }
        //#endregion

        //#region GetExchangeRateTable
        function GetExchageRate($index, ToCurrency, FromCurrency, Org_Name, type, Org_PK) {
            if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.length > 0) {
                var _ExchangeRate = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.some(function (value, key) {
                    if (value.OH_Org == Org_PK && value.FromCurrency == FromCurrency) {
                        return true;
                    } else {
                        return false;
                    }
                });

                if (_ExchangeRate) {
                    if (type == 'CRD' && FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt) {
                        CalculateCost($index);
                    } else if (type == 'DEB' && FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt) {
                        CalculateRevenue($index);
                    }
                }
                else if (!_ExchangeRate) {
                    GetMstRecentExchageRate($index, ToCurrency, FromCurrency, Org_Name, type, Org_PK);
                }
            } else {
                GetMstRecentExchageRate($index, ToCurrency, FromCurrency, Org_Name, type, Org_PK);
            }
        }

        function GetMstRecentExchageRate($index, ToCurrency, FromCurrency, Org_Name, type, Org_PK) {
            var obj;
            var _filter = {
                "FromCurrency": FromCurrency,
                "NKExCurrency": ToCurrency,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": financeConfig.Entities.API.MstRecentExchangeRate.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", financeConfig.Entities.API.MstRecentExchangeRate.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    response.data.Response.map(function (value, key) {
                        if (value.FromCurrency == FromCurrency && value.RX_NKExCurrency == ToCurrency) {
                            obj = {
                                "PK": "",
                                "FromCurrency": value.FromCurrency,
                                "RX_NKRateCurrency": value.RX_NKExCurrency,
                                "BaseRate": value.BaseRate,
                                "TodayBuyrate": value.TodayBuyrate,
                                "Code": Org_Name,
                                "OrgType": type,
                                "OH_Org": Org_PK,
                                "DisplaySeqNo": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DisplaySequence,
                                "EntitySource": "ERP",
                                "CreatedDateTime": new Date(),
                                "StateId": 0,
                                "IsModified": false,
                                "IsDeleted": false,
                            };
                        }
                    });
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.push(obj);

                    if (type == "CRD") {
                        CalculateCost($index);
                    } else if (type == "DEB") {
                        CalculateRevenue($index);
                    }
                } else {
                    toastr.warning("Not Avaliable ExchangeRate Currency");

                    //#region JobCharge OSExchangeRate Assign
                    if (type == "CRD") {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostExRate = 0;
                    } else if (type == "DEB") {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellExRate = 0;
                    }
                    //#endregion
                }
            });
        }
        //#endregion

        //#region JobExchangeRateDelete Functionality
        function JobExchangeRateDelete($index, OrgRole) {
            if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.length > 0) {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.map(function (value, key) {
                    if (value.DisplaySeqNo == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DisplaySequence && value.OrgType == OrgRole) {
                        if (OrgRole == "CRD") {
                            var _isExistCRD = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (val1, key1) {
                                return val1.RX_NKCostCurrency == value.FromCurrency && val1.VendorCode == value.Code;
                            });

                            if (!_isExistCRD) {
                                if (value.PK) {
                                    apiService.get("eAxisAPI", financeConfig.Entities.API.JobExchangeRate.API.Delete.Url + value.PK).then(function (response) {
                                        console.log("Success");
                                    });
                                }
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key, 1);
                            }
                        } else if (OrgRole == "DEB") {
                            var _isExistDEB = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (val1, key1) {
                                return val1.RX_NKSellCurrency == value.FromCurrency && val1.CustomerCode == value.Code;
                            });

                            if (!_isExistDEB) {
                                if (value.PK) {
                                    apiService.get("eAxisAPI", financeConfig.Entities.API.JobExchangeRate.API.Delete.Url + value.PK).then(function (response) {
                                        console.log("Success");
                                    });
                                }

                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key, 1);
                            }
                        }
                    }
                });
            }
        }
        //#endregion

        //#region Add,copy,delete,checkbox row 
        function AddNewRow() {
            var obj = {
                "PK": "",
                "ACCCode": "",
                "ChargeType": "",
                "MarginPercentage": "",
                "TaxRate": "",
                "ACC_FK": "",
                "Desc": "",
                "JobNo": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.JobNo,
                "BranchCode": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.BranchCode,
                "BRN_FK": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.GB,
                "DeptCode": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.DeptCode,
                "DEP_FK": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.GE,
                "JCC_FK": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.GC,
                "ORG_CostAccount": "",
                "APInvoiceNum": "",
                "APInvoiceDate": "",
                "APPostDate": "",
                "CostReference": "",
                "RX_NKCostCurrency": "",
                "EstimatedCost": "",
                "DuplicateEstimatedCost": "",
                "OSCostAmt": "",
                "DuplicateOSCostAmt": "",
                "APVarience": "",
                "LocalCostAmt": "",
                "DuplicateLocalCostAmt": "",
                "CostTaxCode": "",
                "OSCostGSTAmt": "",
                "OSCostExRate": "",
                "ORG_SellAccount": "",
                "RevenueInvoiceNo": "",
                "InvoiceType": "",
                "ARInvoiceDate": "",
                "ARPostDate": "",
                "SellReference": "",
                "RX_NKSellCurrency": "",
                "EstimatedRevenue": "",
                "DuplicateEstimatedRevenue": "",
                "OSSellAmt": "",
                "DuplicateOSSellAmt": "",
                "ARVarience": "",
                "LocalSellAmt": "",
                "DuplicateLocalSellAmt": "",
                "RevenueTaxCode": "",
                "OSSellGSTAmt": "",
                "OSSellExRate": "",
                "ATL_APLine": "",
                "ATL_ARLine": "",
                "Source": "WMS",
                "TenantCode": "20CUB",
                "CostPostChecked": "",
                "Costpost": false,
                "Revenuepost": false,
                "IsModified": false,
                "IsDeleted": false,
                "DisplaySequence": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length + 1,
                "LineNo": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length + 1
            };

            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.push(obj);
            FinanceJobGeneralCtrl.ePage.Masters.selectedRow = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("FinanceJobGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function MoreRecords() {
            FinanceJobGeneralCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "Finance right",
                scope: $scope,
                size: "xl",
                templateUrl: "app/eaxis/finance/finance-job/finance-job-general/finance-job-general-popup.html",
            });
        }

        function CopyRow() {
            for (var i = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1; i >= 0; i--) {
                if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[i].SingleSelect) {
                    var obj = angular.copy(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length + 1
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.splice(i + 1, 0, obj);
                }
            }

            FinanceJobGeneralCtrl.ePage.Masters.selectedRow = -1;
            FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var _Count = 0;
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect == true && value.Costpost || value.Revenuepost) {
                        value.IsDeleted = false;
                    }
                    else if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                FinanceJobGeneralCtrl.ePage.Masters.SelectedDeletion = $filter('filter')(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, { IsDeleted: true })

                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", financeConfig.Entities.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
                    }
                    else if (value.SingleSelect && value.PK && !value.IsDeleted) {
                        _Count = _Count + 1;
                    }
                });

                if (_Count > 0) {
                    toastr.error('Please Check, Already Posted Record Could Not Delete.');
                }

                var ReturnValue = RemoveAllLineErrors();
                if (ReturnValue) {
                    angular.forEach(FinanceJobGeneralCtrl.ePage.Masters.SelectedDeletion, function (val1, key1) {
                        angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (val2, key2) {
                            // Creditor Deletion 
                            if (val2.VendorCode == val1.VendorCode && val2.RX_NKCostCurrency == val1.RX_NKCostCurrency && !val1.SingleSelect) {
                                // if same creditor Available, No deletion against Exchange Rate(CRD only)
                            } else {
                                // if same creditor not Available, deletion against Exchange Rate(CRD only) 
                                angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (val3, key3) {
                                    if (val1.VendorCode == val3.Code && val1.RX_NKCostCurrency == val3.FromCurrency && val3.OrgType == "CRD") {
                                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key3, 1)
                                    }
                                });
                            }
                            // need to change by below format  !important
                            // var _Exist = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (val, key) {
                            //     return val2.VendorCode == val1.VendorCode && val2.RX_NKCostCurrency == val1.RX_NKCostCurrency && !val1.SingleSelect
                            // })
                            // if (!_Exist) {
                            //     angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (val3, key3) {
                            //         if (val1.VendorCode == val3.Code && val1.RX_NKCostCurrency == val3.RX_NKRateCurrency && val3.OrgType == "CRD") {
                            //             FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key3, 1)
                            //         }
                            //     })
                            // }
                            // Debtor Deletion 
                            if (val2.CustomerCode == val1.CustomerCode && val2.RX_NKSellCurrency == val1.RX_NKSellCurrency && !val1.SingleSelect) {
                                // if same debtor Available, No deletion against Exchange Rate(deb)
                            } else {
                                // if same debtor not Available, deletion against Exchange Rate(CRD only) 
                                angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (val3, key3) {
                                    if (val1.CustomerCode == val3.Code && val1.RX_NKSellCurrency == val3.FromCurrency && val3.OrgType == "DEB") {
                                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.splice(key3, 1)
                                    }
                                });
                            }
                        });
                        if (key1 == FinanceJobGeneralCtrl.ePage.Masters.SelectedDeletion.length - 1) {
                            for (var i = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1; i >= 0; i--) {
                                if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[i].SingleSelect && FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[i].IsDeleted) {
                                    JobExchangeRateDelete(i, "CRD");
                                    JobExchangeRateDelete(i, "DEB");

                                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.splice(i, 1);
                                    CostCalculation();
                                    RevenueCalculation();
                                    ProfitAndLossCalculation();
                                }
                            }
                        }
                    });
                    FinanceJobGeneralCtrl.ePage.Masters.Config.GeneralValidation(FinanceJobGeneralCtrl.currentFinanceJob);
                }

                FinanceJobGeneralCtrl.ePage.Masters.selectedRow = -1;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisableBookCost = true;
            }, function () {
                console.log("Cancelled");
            });
        }

        function setSelectedRow($index) {
            FinanceJobGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisableBookCost = false;
            } else {
                FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisableBookCost = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisableBookCost = false;
                }
                else {
                    value.SingleSelect = false;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisableBookCost = true;
                }
            });
        }
        //#endregion

        //#region AmountChange
        function OnAmtChange($index, Amt, Cost, type, duplicatetype, originaltype) {
            financeConfig.DotArea($index, Amt, duplicatetype, originaltype, FinanceJobGeneralCtrl.currentFinanceJob);

            if (type == 'CRD') {
                if (Cost == 'EST') {
                }
                else if (Cost == 'OS') {
                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency) {
                        ExchangeRateCalculatation($index, Cost, type);
                    } else {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;

                        OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt, 'E1308', true, $index);
                    }

                    //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100 && FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency) {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt;

                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;
                    }
                    else if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100 && FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency) {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt;

                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt;
                    }
                    //#endregion
                } else if (Cost == 'LOC') {
                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency) {
                        ExchangeRateCalculatation($index, Cost, type);
                    } else {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt;

                        OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt, 'E1196', true, $index);
                    }

                    //#region ChargeCode MarginPercentage 100 Based Revenue Entry
                    // if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].MarginPercentage == 100) {
                    //     FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = Amt;

                    //     if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt) {
                    //         FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt;
                    //     }
                    // }
                    //#endregion
                }
            } else if (type == 'DEB') {
                if (Cost == 'EST') {
                }
                else if (Cost == 'OS') {
                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency) {
                        ExchangeRateCalculatation($index, Cost, type);
                    } else {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt;

                        OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt, 'E1309', true, $index);
                    }
                } else if (Cost == 'LOC') {
                    if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.CompanyLocalCurrency != FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency) {
                        ExchangeRateCalculatation($index, Cost, type);
                    } else {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt;

                        OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt, 'E1197', true, $index);
                    }
                }
            }
            CostCalculation();
            RevenueCalculation();
            ProfitAndLossCalculation();
        }
        //#endregion

        //#region  CostCalculation, RevenueCalculation, ProfitAndLossCalculation, TaxCalculation
        function CostCalculation() {
            var _LocalcostAmt = 0;
            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (value.DuplicateLocalCostAmt) {
                    _LocalcostAmt = _LocalcostAmt + parseFloat(value.DuplicateLocalCostAmt);
                }
            });
            FinanceJobGeneralCtrl.ePage.Masters.Cost = _LocalcostAmt;

            TaxCalculation('Cost');
        }

        function RevenueCalculation() {
            var _LocalSellAmt = 0;
            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (value.DuplicateLocalSellAmt) {
                    _LocalSellAmt = _LocalSellAmt + parseFloat(value.DuplicateLocalSellAmt);
                }
            });
            FinanceJobGeneralCtrl.ePage.Masters.Revenue = _LocalSellAmt;

            TaxCalculation('Revenue');
        }

        function ProfitAndLossCalculation() {
            var _ProfitAndLoss = 0;
            _ProfitAndLoss = parseFloat(FinanceJobGeneralCtrl.ePage.Masters.Revenue) - parseFloat(FinanceJobGeneralCtrl.ePage.Masters.Cost);
            if (_ProfitAndLoss >= 0) {
                FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLossText = "Profit:";
                FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLoss = _ProfitAndLoss;
            }
            else if (_ProfitAndLoss < 0) {
                FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLossText = "Loss:";
                FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLoss = Math.abs(_ProfitAndLoss);
            }
        }

        function TaxCalculation(type) {
            if (type == 'Cost' && FinanceJobGeneralCtrl.ePage.Masters.selectedRow != -1) {
                if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].DuplicateLocalCostAmt) {
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].OSCostGSTAmt = (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].DuplicateLocalCostAmt * (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].TaxRate / 100)).toFixed(2);
                }
            }
            else if (type == 'Revenue' && FinanceJobGeneralCtrl.ePage.Masters.selectedRow != -1) {
                if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].DuplicateLocalSellAmt) {
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].OSSellGSTAmt = (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].DuplicateLocalSellAmt * (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[FinanceJobGeneralCtrl.ePage.Masters.selectedRow].TaxRate / 100)).toFixed(2);
                }
            }
        }
        //#endregion



        //#region ExchangeRateCalculation
        function ExchangeRateCalculatation($index, Cost, type) {
            if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates.length > 0) {
                angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobExchangeRates, function (value, key) {
                    if (type == 'CRD') {
                        if (value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_CostAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode) {
                            if (Cost == 'OS') {
                                //FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt / value.BaseRate;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt * value.BaseRate;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt.toString();

                                financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt, 'DuplicateLocalCostAmt', 'LocalCostAmt', FinanceJobGeneralCtrl.currentFinanceJob);
                                OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalCostAmt, 'E1308', true, $index);
                            } else if (Cost == 'LOC') {
                                // if(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].IsPosted){
                                //     FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt / value.BaseRate;
                                // }
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt / value.BaseRate;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt / value.BaseRate;

                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost.toString();
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt.toString();

                                financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost, 'DuplicateEstimatedCost', 'EstimatedCost');
                                financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt, 'DuplicateOSCostAmt', 'OSCostAmt');

                                OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedCost, 'E1194', true, $index);
                                OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSCostAmt, 'E1196', true, $index);
                            }
                        }
                    } else if (type == 'DEB') {
                        if (value.OH_Org == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount && value.FromCurrency == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKSellCurrency && value.Code == FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode) {
                            if (Cost == 'OS') {
                                // FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt / value.BaseRate;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt * value.BaseRate;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt.toString();

                                financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt, 'DuplicateLocalSellAmt', 'LocalSellAmt', FinanceJobGeneralCtrl.currentFinanceJob);
                                OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateLocalSellAmt, 'E1309', true, $index);
                            } else if (Cost == 'LOC') {
                                //if(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].IsPosted){
                                // FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt / value.BaseRate;
                                //}
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt / value.BaseRate;
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt / value.BaseRate;

                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue.toString();
                                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt.toString();

                                financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedRevenue, 'DuplicateEstimatedRevenue', 'EstimatedRevenue', FinanceJobGeneralCtrl.currentFinanceJob);
                                financeConfig.DotArea($index, FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt, 'DuplicateOSSellAmt', 'OSSellAmt', FinanceJobGeneralCtrl.currentFinanceJob);

                                OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateEstimatedRevenue, 'E1195', true, $index);
                                OnChangeValidation(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].DuplicateOSSellAmt, 'E1197', true, $index);
                            }
                        }
                    }
                });
            }
        }
        //#endregion

        //#region OnChangeStatus
        function OnChangeStatus(fieldvalue, code, IsArray, RowIndex) {
            if (fieldvalue == "CLS") {
                if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                    var _isExist = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
                        if (!value.Costpost && !value.Revenuepost) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (_isExist) {
                        toastr.error("Charge Details Record not posted all so unable to close this job");
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.Status = "";
                    } else {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.JobClosedDate = new Date();
                    }
                } else {
                    toastr.error("No record found Charge Details so unable to close the job");
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.Status = "";
                }
            }
            OnChangeValidation(fieldvalue, code, IsArray, RowIndex)
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValidation(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(FinanceJobGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                FinanceJobGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, FinanceJobGeneralCtrl.currentFinanceJob.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                FinanceJobGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, FinanceJobGeneralCtrl.currentFinanceJob.code, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length; i++) {
                OnChangeValidation('value', 'E1191', true, i);
                OnChangeValidation('value', 'E1305', true, i);
                OnChangeValidation('value', 'E1306', true, i);
                OnChangeValidation('value', 'E1307', true, i);
                OnChangeValidation('value', 'E1194', true, i);
                OnChangeValidation('value', 'E1196', true, i);
                OnChangeValidation('value', 'E1308', true, i);
                OnChangeValidation('value', 'E1193', true, i);
                OnChangeValidation('value', 'E1195', true, i);
                OnChangeValidation('value', 'E1197', true, i);
                OnChangeValidation('value', 'E1309', true, i);
                OnChangeValidation('value', 'E1310', true, i);
                OnChangeValidation('value', 'E1311', true, i);
                OnChangeValidation('value', 'E1312', true, i);
                OnChangeValidation('value', 'E1313', true, i);
            }
            return true;
        }
        //#endregion 

        //#region popup close 
        function Close() {
            FinanceJobGeneralCtrl.ePage.Masters.modalInstance.dismiss('close');
        }
        //#endregion

        Init();
    }
})();