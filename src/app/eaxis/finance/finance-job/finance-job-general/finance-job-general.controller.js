(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobGeneralController", FinanceJobGeneralController);

    FinanceJobGeneralController.$inject = ["$uibModal", "$scope", "$timeout", "$document", "APP_CONSTANT", "apiService", "financeConfig", "appConfig", "helperService", "authService", "confirmation", "toastr", "errorWarningService"];

    function FinanceJobGeneralController($uibModal, $scope, $timeout, $document, APP_CONSTANT, apiService, financeConfig, appConfig, helperService, authService, confirmation, toastr, errorWarningService) {
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

            /* Static Field Values */
            FinanceJobGeneralCtrl.ePage.Masters.JobAddress = {
                Address1: "1 Richi Street",
                Address2: "Mount Road",
                State: "TN",
                PostCode: "600001",
                City: "Chennai",
                Email: "demma@demmaa.com",
                Mobile: "9790320488",
                Phone: "0452-35458"
            };

            FinanceJobGeneralCtrl.ePage.Masters.JobAddress1 = {
                Address1: "Office# 402, Wasl Building,",
                Address2: "Near Karama, P O BOX 34809",
                State: "Dubai ",
                PostCode: "600001",
                City: "UAE",
                Email: "20clogjea@clogjea.com",
                Mobile: "9714536480",
                Phone: "0478-178945"
            };

            FinanceJobGeneralCtrl.ePage.Masters.ExchangeRate = [{
                Currency: "INR",
                CostRate: 2500.50,
                RateDate: "29/11/2018",
                SallRate: 3000,
                TodayRate: 71.28
            }, {
                Currency: "USD",
                CostRate: 3500.50,
                RateDate: "18/11/2018",
                SallRate: 4500,
                TodayRate: 0.014
            }, {
                Currency: "POUND",
                CostRate: 2100.5000,
                RateDate: "22/11/2018",
                SallRate: 2500,
                TodayRate: 90.88
            },
            {
                Currency: "INR",
                CostRate: 2500.50,
                RateDate: "29/11/2018",
                SallRate: 3000,
                TodayRate: 71.28
            }, {
                Currency: "USD",
                CostRate: 3500.50,
                RateDate: "18/11/2018",
                SallRate: 4500,
                TodayRate: 0.014
            }, {
                Currency: "POUND",
                CostRate: 2100.5000,
                RateDate: "22/11/2018",
                SallRate: 2500,
                TodayRate: 90.88
            }, {
                Currency: "INR",
                CostRate: 2500.50,
                RateDate: "29/11/2018",
                SallRate: 3000,
                TodayRate: 71.28
            }, {
                Currency: "USD",
                CostRate: 3500.50,
                RateDate: "18/11/2018",
                SallRate: 4500,
                TodayRate: 0.014
            }, {
                Currency: "POUND",
                CostRate: 2100.5000,
                RateDate: "22/11/2018",
                SallRate: 2500,
                TodayRate: 90.88
            }];

            FinanceJobGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            FinanceJobGeneralCtrl.ePage.Masters.UIJobDisabled = {};

            FinanceJobGeneralCtrl.ePage.Masters.ChargeDeatailsGrid = "No records found...";
            FinanceJobGeneralCtrl.ePage.Masters.Cost = 0;
            FinanceJobGeneralCtrl.ePage.Masters.Revenue = 0;
            FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLoss = 0;
            FinanceJobGeneralCtrl.ePage.Masters.Config = financeConfig;

            /* Function */
            FinanceJobGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            FinanceJobGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            FinanceJobGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            FinanceJobGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            FinanceJobGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            FinanceJobGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            FinanceJobGeneralCtrl.ePage.Masters.MoreRecords = MoreRecords;
            FinanceJobGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            FinanceJobGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            FinanceJobGeneralCtrl.ePage.Masters.OnEstimatedAmtChange = OnEstimatedAmtChange;
            FinanceJobGeneralCtrl.ePage.Masters.OnOSAmtChange = OnOSAmtChange;
            FinanceJobGeneralCtrl.ePage.Masters.OnLocalAmtChange = OnLocalAmtChange;

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

            GetMastersDropDownList();
            GetExchageRateList();
            Cost();
            Revenue();
            ProfitAndLoss();
        }

        //#region  DropDown 
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
                    });
                }
            });
        }
        //#endregion

        //#region Exchange Rate
        function GetExchageRateList() {
            var _input = {
                "searchInput": [],
                "FilterID": financeConfig.Entities.API.ExchangeRate.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", financeConfig.Entities.API.ExchangeRate.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {

                }
            });

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("FinanceJobGeneralCtrl.ePage.Masters.AddScrollExRate");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
        }

        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item, type) {
            if ($item) {
                if (type == 'Local') {
                    OnChangeValues($item.Code, 'E1300');
                }
                else if (type == 'Agent') {
                    OnChangeValues($item.Code, 'E1301');
                }
                else if (type == 'Branch') {
                    OnChangeValues($item.Code, 'E1302');
                }
                else if (type == 'Department') {
                    OnChangeValues($item.Code, 'E1303');
                }
                else if (type == 'ChargeCode') {
                    OnChangeValues($item.Code, 'E1191');

                    if ($item.ChargeType == "MRG") {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ChargeType = $item.ChargeType;
                    }
                    else if ($item.ChargeType == "REV") {
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ChargeType = $item.ChargeType;
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APInvoiceNum = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APInvoiceDate = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CostTaxCode = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostGSTAmt = "";

                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RevenueTaxCode = "";
                        FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellGSTAmt = "";
                        Cost();
                        Revenue();
                        ProfitAndLoss();
                    }
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_Code;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_FK;
                }
                else if (type == 'ServiceBranch') {
                    OnChangeValues($item.Code, 'E1305');
                }
                else if (type == 'ServiceDept') {
                    OnChangeValues($item.Code, 'E1306');
                }
                else if (type == 'Creditor') {
                    OnChangeValues($item.Code, 'E1310');
                }
                else if (type == 'Debeitor') {
                    OnChangeValues($item.Code, 'E1311');
                }
                else if (type == 'CostCurrency') {
                    OnChangeValues($item.Code, 'E1307');
                }
                else if (type == 'RevenueCurrency') {
                    OnChangeValues($item.Code, 'E1193');
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

        //#region Add,copy,delete,checkbox row 
        function AddNewRow() {
            var obj = {
                "PK": "",
                "JOB_FK": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.PK,
                "ACCCode": "",
                "ChargeType": "",
                "ACC_FK": "",
                "Desc": "",
                "JobNo": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.JobNo,
                "BranchCode": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.BranchCode,
                "BRN_FK": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.GB,
                "DeptCode": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.DeptCode,
                "DEP_FK": FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.GE,

                "ORG_CostAccount": "",
                "APInvoiceNum": "",
                "APInvoiceDate": "",
                "APPostDate": "",
                "CostReference": "",
                "RX_NKCostCurrency": "",
                "EstimatedCost": "",
                "OSCostAmt": "",
                "APVarience": "",
                "LocalCostAmt": "",
                "CostTaxCode": "",
                "OSCostGSTAmt": "",

                "ORG_SellAccount": "",
                "RevenueInvoiceNo": "",
                "InvoiceType": "",
                "ARInvoiceDate": "",
                "ARPostDate": "",
                "SellReference": "",
                "RX_NKSellCurrency": "",
                "EstimatedRevenue": "",
                "OSSellAmt": "",
                "ARVarience": "",
                "LocalSellAmt": "",
                "RevenueTaxCode": "",
                "OSSellGSTAmt": "",

                "ATL_APLine": "",
                "ATL_ARLine": "",
                "Source": "WMS",
                "TenantCode": "20CUB",
                "CostPostChecked": "",
                "Costpost": "",
                "Revenuepost": "",
                "IsModified": false,
                "IsDeleted": false,
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

        function MoreRecords($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "Finance right",
                scope: $scope,
                size: "xl",
                templateUrl: "app/eaxis/finance/finance-job/finance-job-general/finance-job-general-popup.html",
                controller: "FinanceJobGeneralPopupController",
                controllerAs: "FinanceJobGeneralPopupCtrl",
                bindToController: true,
                resolve: {
                    CurrentFinanceJob: function () {
                        return FinanceJobGeneralCtrl.currentFinanceJob;
                    },
                    Index: function () {
                        return $item;
                    }
                }
            }).result.then(
                function (response) {
                    console.log("Success");
                },
                function () {
                    console.log("Cancelled");
                }
            );
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
                    else if (value.SingleSelect == true && !value.PK || value.PK) {
                        value.IsDeleted = true;
                    }
                });


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

                var ReturnValue = RemoveAllLineErrors();
                if (ReturnValue) {
                    for (var i = FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1; i >= 0; i--) {
                        if (FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[i].SingleSelect == true && FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[i].IsDeleted)
                            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.splice(i, 1);
                    }
                    FinanceJobGeneralCtrl.ePage.Masters.Config.GeneralValidation(FinanceJobGeneralCtrl.currentFinanceJob);
                }

                if (_Count > 0) {
                    toastr.error('Please Check, Already Posted Record Could Not Delete.');
                }

                FinanceJobGeneralCtrl.ePage.Masters.selectedRow = -1;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
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
            } else {
                FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
                if (FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = false;
                }
                else {
                    value.SingleSelect = false;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    FinanceJobGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                    FinanceJobGeneralCtrl.ePage.Entities.Header.GlobalVariables.IsDisablePost = true;
                }
            });
        }
        //#endregion

        //#region AmountChange
        function OnEstimatedAmtChange($index, $item, type) {
            if (type == 'Cost') {
            }
            else if (type == 'Revenue') {
            }
        }

        function OnOSAmtChange($index, ActualAmt, type) {
            if (type == 'CostActualAmt') {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = ActualAmt;
                OnChangeValues(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt, 'E1308', true, $index);
                Cost();
                ProfitAndLoss();
            }
            else if (type == 'RevenueActualAmt') {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = ActualAmt;
                OnChangeValues(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt, 'E1309', true, $index);
                Revenue();
                ProfitAndLoss();
            }
        }

        function OnLocalAmtChange($index, LocalAmt, type) {
            if (type == 'CostLocalAmt') {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = LocalAmt;
                OnChangeValues(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt, 'E1196', true, $index);
                Cost();
                ProfitAndLoss();
            }
            else if (type == 'RevenueLocalAmt') {
                FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = LocalAmt;
                OnChangeValues(FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt, 'E1197', true, $index);
                Revenue();
                ProfitAndLoss();
            }
        }

        function Cost() {
            var _LocalcostAmt = 0;
            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (value.LocalCostAmt) {
                    _LocalcostAmt = _LocalcostAmt + parseFloat(value.LocalCostAmt);
                }
            });
            FinanceJobGeneralCtrl.ePage.Masters.Cost = parseFloat(_LocalcostAmt).toFixed(4);
        }

        function Revenue() {
            var _LocalSellAmt = 0;
            FinanceJobGeneralCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (value.LocalSellAmt) {
                    _LocalSellAmt = _LocalSellAmt + parseFloat(value.LocalSellAmt);
                }
            });
            FinanceJobGeneralCtrl.ePage.Masters.Revenue = parseFloat(_LocalSellAmt).toFixed(4);
        }

        function ProfitAndLoss() {
            var _ProfitAndLoss = 0;
            _ProfitAndLoss = parseFloat(FinanceJobGeneralCtrl.ePage.Masters.Revenue) - parseFloat(FinanceJobGeneralCtrl.ePage.Masters.Cost);
            FinanceJobGeneralCtrl.ePage.Masters.ProfitAndLoss = parseFloat(_ProfitAndLoss).toFixed(4);
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
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
                OnChangeValues('value', 'E1191', true, i);
                OnChangeValues('value', 'E1305', true, i);
                OnChangeValues('value', 'E1306', true, i);
                OnChangeValues('value', 'E1307', true, i);
                OnChangeValues('value', 'E1194', true, i);
                OnChangeValues('value', 'E1196', true, i);
                OnChangeValues('value', 'E1308', true, i);
                OnChangeValues('value', 'E1193', true, i);
                OnChangeValues('value', 'E1195', true, i);
                OnChangeValues('value', 'E1197', true, i);
                OnChangeValues('value', 'E1309', true, i);
                OnChangeValues('value', 'E1310', true, i);
                OnChangeValues('value', 'E1311', true, i);
                OnChangeValues('value', 'E1312', true, i);
                OnChangeValues('value', 'E1313', true, i);
            }
            return true;
        }
        //#endregion 

        Init();
    }
})();