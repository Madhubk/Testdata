(function () {
   "use strict";

   angular.module("Application")
      .controller("JobAccountingController", JobAccountingController);

   JobAccountingController.$inject = ["$uibModal", "$scope", "$timeout", "$document", "APP_CONSTANT", "apiService", "financeConfig", "appConfig", "helperService", "authService", "confirmation", "toastr", "errorWarningService"];

   function JobAccountingController($uibModal, $scope, $timeout, $document, APP_CONSTANT, apiService, financeConfig, appConfig, helperService, authService, confirmation, toastr, errorWarningService) {
      var JobAccountingCtrl = this;

      function Init() {
         var currentFinanceJob = JobAccountingCtrl.currentFinanceJob[JobAccountingCtrl.currentFinanceJob.code].ePage.Entities;
         JobAccountingCtrl.ePage = {
            "Title": "",
            "Prefix": "Freight_General",
            "Masters": {},
            "Meta": helperService.metaBase(),
            "Entities": currentFinanceJob
         };

         /* Static Field Values */
         JobAccountingCtrl.ePage.Masters.JobAddress = {
            Address1: "1 Richi Street",
            Address2: "Mount Road",
            State: "TN",
            PostCode: "600001",
            City: "Chennai",
            Email: "demma@demmaa.com",
            Mobile: "9790320488",
            Phone: "0452-35458"
         };

         JobAccountingCtrl.ePage.Masters.JobAddress1 = {
            Address1: "Office# 402, Wasl Building,",
            Address2: "Near Karama, P O BOX 34809",
            State: "Dubai ",
            PostCode: "600001",
            City: "UAE",
            Email: "20clogjea@clogjea.com",
            Mobile: "9714536480",
            Phone: "0478-178945"
         };

         JobAccountingCtrl.ePage.Masters.ExchangeRate = [{
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

         JobAccountingCtrl.ePage.Masters.DropDownMasterList = {};
         JobAccountingCtrl.ePage.Masters.UIJobDisabled = {};

         JobAccountingCtrl.ePage.Masters.ChargeDeatailsGrid = "No records found...";
         JobAccountingCtrl.ePage.Masters.SaveButtonText = "Save";
         JobAccountingCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
         JobAccountingCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
         JobAccountingCtrl.ePage.Masters.PostButtonText = "Post";
         JobAccountingCtrl.ePage.Masters.DisableSave = false;
         JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
         JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
         JobAccountingCtrl.ePage.Masters.DisablePost = true;

         JobAccountingCtrl.ePage.Masters.Cost = 0;
         JobAccountingCtrl.ePage.Masters.Revenue = 0;
         JobAccountingCtrl.ePage.Masters.ProfitAndLoss = 0;

         /* Function */
         JobAccountingCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
         JobAccountingCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

         JobAccountingCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
         JobAccountingCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
         JobAccountingCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
         JobAccountingCtrl.ePage.Masters.AddNewRow = AddNewRow;
         JobAccountingCtrl.ePage.Masters.CopyRow = CopyRow;
         JobAccountingCtrl.ePage.Masters.RemoveRow = RemoveRow;

         JobAccountingCtrl.ePage.Masters.OnEstimatedAmtChange = OnEstimatedAmtChange;
         JobAccountingCtrl.ePage.Masters.OnOSAmtChange = OnOSAmtChange;
         JobAccountingCtrl.ePage.Masters.OnLocalAmtChange = OnLocalAmtChange;
         JobAccountingCtrl.ePage.Masters.Validation = Validation;
         JobAccountingCtrl.ePage.Masters.Config = financeConfig;
         JobAccountingCtrl.ePage.Masters.Save = Save;
         JobAccountingCtrl.ePage.Masters.PostCost = PostCost;
         JobAccountingCtrl.ePage.Masters.PostRevenue = PostRevenue;

         /* DatePicker */
         JobAccountingCtrl.ePage.Masters.DatePicker = {};
         JobAccountingCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
         JobAccountingCtrl.ePage.Masters.DatePicker.isOpen = [];
         JobAccountingCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

         /*  For table */
         JobAccountingCtrl.ePage.Masters.SelectAll = false;
         JobAccountingCtrl.ePage.Masters.EnableDeleteButton = true;
         JobAccountingCtrl.ePage.Masters.EnableCopyButton = true;
         JobAccountingCtrl.ePage.Masters.Enable = true;
         JobAccountingCtrl.ePage.Masters.selectedRow = -1;
         JobAccountingCtrl.ePage.Masters.emptyText = '-';

         /* DropDown List */
         JobAccountingCtrl.ePage.Masters.DropDownMasterList = {
            "FinanceStatus": {
               "ListSource": []
            },
            "FinanceProfitLossReason": {
               "ListSource": []
            }
         };

         GetMastersDropDownList();
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
                  JobAccountingCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                  JobAccountingCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
               });
            }
         });
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
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ChargeType = $item.ChargeType;
               }
               else if ($item.ChargeType == "REV") {
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ChargeType = $item.ChargeType;
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].VendorCode = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APInvoiceNum = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APInvoiceDate = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RX_NKCostCurrency = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].EstimatedCost = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CostTaxCode = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostGSTAmt = "";

                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].RevenueTaxCode = "";
                  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellGSTAmt = "";
                  Cost();
                  Revenue();
                  ProfitAndLoss();
               }
               JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].CustomerCode = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_Code;
               JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ORG_SellAccount = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_FK;
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
         JobAccountingCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
      }
      //#endregion

      //#region Add,copy,delete,checkbox row 
      function setSelectedRow($index) {
         JobAccountingCtrl.ePage.Masters.selectedRow = $index;
      }

      function SelectAllCheckBox() {
         angular.forEach(JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge, function (value, key) {
            if (JobAccountingCtrl.ePage.Masters.SelectAll) {
               value.SingleSelect = true;
               JobAccountingCtrl.ePage.Masters.EnableDeleteButton = false;
               JobAccountingCtrl.ePage.Masters.EnableCopyButton = false;
               JobAccountingCtrl.ePage.Masters.DisablePostCost = false;
               JobAccountingCtrl.ePage.Masters.DisablePostRevenue = false;
               JobAccountingCtrl.ePage.Masters.DisablePost = false;
            }
            else {
               value.SingleSelect = false;
               JobAccountingCtrl.ePage.Masters.EnableDeleteButton = true;
               JobAccountingCtrl.ePage.Masters.EnableCopyButton = true;
               JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
               JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
               JobAccountingCtrl.ePage.Masters.DisablePost = true;
            }
         });
      }

      function SingleSelectCheckBox() {
         var Checked = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
            if (!value.SingleSelect)
               return true;
         });
         if (Checked) {
            JobAccountingCtrl.ePage.Masters.SelectAll = false;
         } else {
            JobAccountingCtrl.ePage.Masters.SelectAll = true;
         }

         var Checked1 = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.some(function (value, key) {
            return value.SingleSelect == true;
         });
         if (Checked1 == true) {
            JobAccountingCtrl.ePage.Masters.EnableDeleteButton = false;
            JobAccountingCtrl.ePage.Masters.EnableCopyButton = false;
            JobAccountingCtrl.ePage.Masters.DisablePostCost = false;
            JobAccountingCtrl.ePage.Masters.DisablePostRevenue = false;
            JobAccountingCtrl.ePage.Masters.DisablePost = false;
         } else {
            JobAccountingCtrl.ePage.Masters.EnableDeleteButton = true;
            JobAccountingCtrl.ePage.Masters.EnableCopyButton = true;
            JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
            JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
            JobAccountingCtrl.ePage.Masters.DisablePost = true;
         }
      }

      function AddNewRow() {
         JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
         var obj = {
            "PK": "",
            "JOB_FK": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.PK,
            "ACCCode": "",
            "ChargeType": "",
            "ACC_FK": "",
            "Desc": "",
            "JobNo": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.JobNo,
            "BranchCode": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.BranchCode,
            "BRN_FK": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.GB,
            "DeptCode": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.DeptCode,
            "DEP_FK": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobHeader.GE,

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
            "Source": "SHP",
            "TenantCode": "20CUB",
            "CostPostChecked": "",
            "Costpost": "",
            "Revenuepost": "",
            "IsModified": false,
            "IsDeleted": false,
            "LineNo": JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.length + 1
         };

         JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.push(obj);
         JobAccountingCtrl.ePage.Masters.selectedRow = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1;

         $timeout(function () {
            var objDiv = document.getElementById("JobAccountingCtrl.ePage.Masters.AddScroll");
            objDiv.scrollTop = objDiv.scrollHeight;
         }, 50);
         JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
         JobAccountingCtrl.ePage.Masters.SelectAll = false;
      }

      function CopyRow() {
         JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

         for (var i = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1; i >= 0; i--) {
            if (JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[i].SingleSelect) {
               var obj = angular.copy(JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[i]);
               obj.PK = "";
               obj.CreatedDateTime = "";
               obj.ModifiedDateTime = "";
               obj.SingleSelect = false
               obj.IsCopied = true;
               obj.LineNo = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.length + 1
               JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.splice(i + 1, 0, obj);
            }
         }

         JobAccountingCtrl.ePage.Masters.selectedRow = -1;
         JobAccountingCtrl.ePage.Masters.SelectAll = false;
         JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
            JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
               if (value.SingleSelect == true && value.Costpost || value.Revenuepost) {
                  value.IsDeleted = false;
               }
               else if (value.SingleSelect == true && !value.PK || value.PK) {
                  value.IsDeleted = true;
               }
            });


            JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
               if (value.IsDeleted) {
                  if (value.SingleSelect && value.PK && value.IsDeleted) {
                     apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.Delete.Url + value.PK).then(function (response) {
                        console.log("Success");
                     });
                  }
               }
               else {
                  _Count = _Count + 1;
               }
            });

            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
               for (var i = JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.length - 1; i >= 0; i--) {
                  if (JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[i].SingleSelect == true && value.IsDeleted)
                     JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.splice(i, 1);
               }
               JobAccountingCtrl.ePage.Masters.Config.GeneralValidation(JobAccountingCtrl.currentFinanceJob);
            }

            if (_Count > 0) {
               toastr.error('Please Check, Already Posted Record Could Not Delete.');
            }

            JobAccountingCtrl.ePage.Masters.selectedRow = -1;
            JobAccountingCtrl.ePage.Masters.SelectAll = false;
            JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            JobAccountingCtrl.ePage.Masters.EnableCopyButton = true;
            JobAccountingCtrl.ePage.Masters.EnableDeleteButton = true;
            JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
            JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
            JobAccountingCtrl.ePage.Masters.DisablePost = true;
         }, function () {
            console.log("Cancelled");
         });
      }
      //#endregion

      //#region AmountChange
      function OnEstimatedAmtChange($index, $item, type) {
         if (type == 'Cost') {
            // JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = $item;
            // JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = $item;
         }
         else if (type == 'Revenue') {
            //  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = $item;
            //  JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = $item;
         }
      }

      function OnOSAmtChange($index, ActualAmt, type) {
         if (type == 'CostActualAmt') {
            //JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].APVariance = ActAmt - EstAmt;
            JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt = ActualAmt;
            OnChangeValues(JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalCostAmt, 'E1308', true, $index);
            Cost();
            ProfitAndLoss();
         }
         else if (type == 'RevenueActualAmt') {
            //JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].ARVariance = ActAmt - EstAmt;
            JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt = ActualAmt;
            OnChangeValues(JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].LocalSellAmt, 'E1309', true, $index);
            Revenue();
            ProfitAndLoss();
         }
      }

      function OnLocalAmtChange($index, LocalAmt, type) {
         if (type == 'CostLocalAmt') {
            JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt = LocalAmt;
            OnChangeValues(JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSCostAmt, 'E1196', true, $index);
            Cost();
            ProfitAndLoss();
         }
         else if (type == 'RevenueLocalAmt') {
            JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt = LocalAmt;
            OnChangeValues(JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge[$index].OSSellAmt, 'E1197', true, $index);
            Revenue();
            ProfitAndLoss();
         }
      }

      function Cost() {
         var _LocalcostAmt = 0;
         JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
            if (value.LocalCostAmt) {
               _LocalcostAmt = _LocalcostAmt + parseFloat(value.LocalCostAmt);
            }
         });
         JobAccountingCtrl.ePage.Masters.Cost = parseFloat(_LocalcostAmt).toFixed(4);
      }

      function Revenue() {
         var _LocalSellAmt = 0;
         JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
            if (value.LocalSellAmt) {
               _LocalSellAmt = _LocalSellAmt + parseFloat(value.LocalSellAmt);
            }
         });
         JobAccountingCtrl.ePage.Masters.Revenue = parseFloat(_LocalSellAmt).toFixed(4);
      }

      function ProfitAndLoss() {
         var _ProfitAndLoss = 0;
         _ProfitAndLoss = parseFloat(JobAccountingCtrl.ePage.Masters.Revenue) - parseFloat(JobAccountingCtrl.ePage.Masters.Cost);
         JobAccountingCtrl.ePage.Masters.ProfitAndLoss = parseFloat(_ProfitAndLoss).toFixed(4);
      }
      //#endregion

      //#region Validation
      function Validation($item, type) {
         var _Data = $item[$item.code].ePage.Entities,
            _input = _Data.Header.Data,
            _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

         //Validation Call
         JobAccountingCtrl.ePage.Masters.Config.GeneralValidation($item, type);
         if (JobAccountingCtrl.ePage.Entities.Header.Validations) {
            JobAccountingCtrl.ePage.Masters.Config.RemoveApiErrors(JobAccountingCtrl.ePage.Entities.Header.Validations, $item.label);
         }

         if (_errorcount.length == 0) {
            if (type == "PostRevenue") {
               PostRevenue($item);
            }
            else if (type == "Post") {
               Post($item);
            }
            else {
               Save($item);
            }
         } else {
            JobAccountingCtrl.ePage.Masters.Config.ShowErrorWarningModal(JobAccountingCtrl.currentFinanceJob);
         }
      }

      function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
         angular.forEach(JobAccountingCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
            if (value.Code.trim() === code) {
               GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
            }
         });
      }

      function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
         if (!fieldvalue) {
            JobAccountingCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, JobAccountingCtrl.currentFinanceJob.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
         } else {
            JobAccountingCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, JobAccountingCtrl.currentFinanceJob.code, IsArray, RowIndex, value.ColIndex);
         }
      }

      function RemoveAllLineErrors() {
         for (var i = 0; i < JobAccountingCtrl.ePage.Entities.Header.Data.UIJobCharge.length; i++) {
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
      //#endregion Validation

      //#region Save
      function Save($item) {
         JobAccountingCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
         JobAccountingCtrl.ePage.Masters.DisableSave = true;
         JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

         var _Data = $item[$item.code].ePage.Entities,
            _input = _Data.Header.Data;

         _input.UIJobHeader.IsActive = true;

         if ($item.isNew) {
            //false
            //  _input.PK = _input.UIJobHeader.PK;
            //  _input.UIJobHeader.CreatedDateTime = new Date();

            //  //Converting into Upper Case
            //  _input.UIJobHeader.WarehouseCode = _input.UIJobHeader.WarehouseCode.toUpperCase();
            //  _input.UIJobHeader.WarehouseName = _input.UIJobHeader.WarehouseName.toUpperCase();

            //  _input.UIJobCharge.map(function(value,key){
            //      value.Name = value.Name.toUpperCase();
            //  });
         } else {
            $item = filterObjectUpdate($item, "IsModified");
            if ($item[$item.code].ePage.Entities.Header.Data.UIJobCharge.length > 0) {
               $item[$item.code].ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                  (value.PK) ? value.IsModified = true : value.IsModified = false;
               });
            }
         }

         helperService.SaveEntity($item, 'JobHeader').then(function (response) {
            JobAccountingCtrl.ePage.Masters.SelectAll = false;
            JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
            JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
            JobAccountingCtrl.ePage.Masters.DisablePost = true;
            JobAccountingCtrl.ePage.Masters.SaveButtonText = "Save";
            JobAccountingCtrl.ePage.Masters.DisableSave = false;
            JobAccountingCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

            if (response.Status === "success") {
               apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + JobAccountingCtrl.currentFinanceJob.code).then(function (response) {
                  if (response.data.Status == "Success") {
                     financeConfig.TabList.map(function (value, key) {
                        if (value.New) {
                           //undefined
                           //  if (value.code == '') {
                           //      value.label = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                           //      value[WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode] = value.New;
                           //      delete value.New;
                           //      value.code = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                           //  }
                        }
                     });

                     var _index = financeConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                     }).indexOf(JobAccountingCtrl.currentFinanceJob[JobAccountingCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);


                     if (_index !== -1) {
                        if (response.data.Response) {
                           financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                        }
                        else {
                           financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                        }
                        financeConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                     }
                     toastr.success("Saved Successfully...!");
                  }
                  else if (response.data.Status === "failed") {
                     console.log("GetById Failed");
                  }
               });
            } else if (response.Status === "failed") {
               toastr.error("Could not Save...!");
               JobAccountingCtrl.ePage.Entities.Header.Validations = response.Validations;
               angular.forEach(response.Validations, function (value, key) {
                  JobAccountingCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, JobAccountingCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
               });
               if (JobAccountingCtrl.ePage.Entities.Header.Validations != null) {
                  JobAccountingCtrl.ePage.Masters.Config.ShowErrorWarningModal(JobAccountingCtrl.currentFinanceJob);
               }
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

      //#region Post Cost, Post Revenue, Post 
      function PostCost($item) {
         var _Data = $item[$item.code].ePage.Entities,
            _input = _Data.Header.Data;

         _input.UIJobCharge.map(function (value, key) {
            if (value.SingleSelect == true && value.PK && value.ChargeType != "REV") {
               if (!value.Costpost) {
                  value.APPostDate = new Date().toUTCString();
                  value.Costpost = false;
               }
            }
         });

         var _PostCost1 = _input.UIJobCharge.some(function (value, key) {
            if (value.SingleSelect == true && !value.PK || value.ChargeType == "REV") {
               return false;
            }
            else {
               return true;
            }
         });

         var _PostCost2 = _input.UIJobCharge.some(function (value, key) {
            if (value.APPostDate) {
               return true;
            }
            else {
               return false;
            }
         });

         if (!_PostCost1) {
            var modalOptions = {
               closeButtonText: 'Cancel',
               actionButtonText: 'Ok',
               headerText: 'Post Cost?',
               bodyText: "Please save the job charge (OR) charge type not 'REV'  before posting charges"
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
               console.log(result);
               return false;

            }, function () {
               console.log("Cancelled");
               return false;
            });
         }
         else if (!_PostCost2) {
            toastr.error("Job charges already posted...!");
         }
         else if (_PostCost1 && _PostCost2) {
            JobAccountingCtrl.ePage.Masters.PostCostButtonText = "Please Wait...";
            if ($item.isNew) {
               /*  false */
            } else {
               $item = filterObjectUpdate($item, "IsModified");
               if ($item[$item.code].ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                  $item[$item.code].ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                     (value.PK) ? value.IsModified = true : value.IsModified = false;
                  });
               }
            }

            helperService.SaveEntity($item, 'JobHeader').then(function (response) {
               JobAccountingCtrl.ePage.Masters.SelectAll = false;
               JobAccountingCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
               JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
               JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
               JobAccountingCtrl.ePage.Masters.DisablePost = true;

               if (response.Status === "success") {
                  apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + JobAccountingCtrl.currentFinanceJob.code).then(function (response) {
                     if (response.data.Status == "Success") {
                        financeConfig.TabList.map(function (value, key) {
                           if (value.New) {
                              /*  undefined */
                           }
                        });

                        var _index = financeConfig.TabList.map(function (value, key) {
                           return value[value.code].ePage.Entities.Header.Data.PK;
                        }).indexOf(JobAccountingCtrl.currentFinanceJob[JobAccountingCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);


                        if (_index !== -1) {
                           if (response.data.Response) {
                              financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                           }
                           else {
                              financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                           }
                           financeConfig.TabList[_index].isNew = false;
                           helperService.refreshGrid();
                        }
                        toastr.success("Post Cost Successfully...!");
                     }
                     else if (response.data.Status === "failed") {
                        console.log("GetById Failed");
                     }
                  });
               } else if (response.Status === "failed") {
                  toastr.error("Could not Post Cost...!");
                  JobAccountingCtrl.ePage.Entities.Header.Validations = response.Validations;
                  angular.forEach(response.Validations, function (value, key) {
                     JobAccountingCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, JobAccountingCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                  });
                  if (JobAccountingCtrl.ePage.Entities.Header.Validations != null) {
                     JobAccountingCtrl.ePage.Masters.Config.ShowErrorWarningModal(JobAccountingCtrl.currentFinanceJob);
                  }
               }
            });
         }
      }

      function PostRevenue($item) {
         var _Data = $item[$item.code].ePage.Entities,
            _input = _Data.Header.Data;

         _input.UIJobCharge.map(function (value, key) {
            if (value.SingleSelect == true && value.PK) {
               if (!value.Revenuepost) {
                  value.ARPostDate = new Date().toUTCString();
                  value.Revenuepost = false;
               }
            }
         });

         var _PostRevenue1 = _input.UIJobCharge.some(function (value, key) {
            if (value.SingleSelect == true && !value.PK) {
               return false;
            }
            else {
               return true;
            }
         });

         var _PostRevenue2 = _input.UIJobCharge.some(function (value, key) {
            if (value.ARPostDate) {
               return true;
            }
            else {
               return false;
            }
         });

         if (!_PostRevenue1) {
            var modalOptions = {
               closeButtonText: 'Cancel',
               actionButtonText: 'Ok',
               headerText: 'Post Revenue?',
               bodyText: "Please save the job charge before posting charges"
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
               console.log(result);
               return false;

            }, function () {
               console.log("Cancelled");
               return false;
            });
         }
         else if (!_PostRevenue2) {
            toastr.error("Job charges already posted...!");
         }
         else if (_PostRevenue1 && _PostRevenue2) {
            JobAccountingCtrl.ePage.Masters.PostRevenueButtonText = "Please Wait...";
            if ($item.isNew) {
               /*  false */
            } else {
               $item = filterObjectUpdate($item, "IsModified");
               if ($item[$item.code].ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                  $item[$item.code].ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                     (value.PK) ? value.IsModified = true : value.IsModified = false;
                  });
               }
            }

            helperService.SaveEntity($item, 'JobHeader').then(function (response) {
               JobAccountingCtrl.ePage.Masters.SelectAll = false;
               JobAccountingCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
               JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
               JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
               JobAccountingCtrl.ePage.Masters.DisablePost = true;

               if (response.Status === "success") {
                  apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + JobAccountingCtrl.currentFinanceJob.code).then(function (response) {
                     if (response.data.Status == "Success") {
                        financeConfig.TabList.map(function (value, key) {
                           if (value.New) {
                              /*  undefined */
                           }
                        });

                        var _index = financeConfig.TabList.map(function (value, key) {
                           return value[value.code].ePage.Entities.Header.Data.PK;
                        }).indexOf(JobAccountingCtrl.currentFinanceJob[JobAccountingCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);


                        if (_index !== -1) {
                           if (response.data.Response) {
                              financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                           }
                           else {
                              financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                           }
                           financeConfig.TabList[_index].isNew = false;
                           helperService.refreshGrid();
                        }
                        toastr.success("Post Revenue Successfully...!");
                     }
                     else if (response.data.Status === "failed") {
                        console.log("GetById Failed");
                     }
                  });
               } else if (response.Status === "failed") {
                  toastr.error("Could not Post Revenue...!");
                  JobAccountingCtrl.ePage.Entities.Header.Validations = response.Validations;
                  angular.forEach(response.Validations, function (value, key) {
                     JobAccountingCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, JobAccountingCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                  });
                  if (JobAccountingCtrl.ePage.Entities.Header.Validations != null) {
                     JobAccountingCtrl.ePage.Masters.Config.ShowErrorWarningModal(JobAccountingCtrl.currentFinanceJob);
                  }
               }
            });
         }
      }

      function Post($item) {
         var _Data = $item[$item.code].ePage.Entities,
            _input = _Data.Header.Data;

         _input.UIJobCharge.map(function (value, key) {
            if (value.SingleSelect == true && value.PK && value.ChargeType != "REV") {
               if (!value.Costpost) {
                  value.APPostDate = new Date().toUTCString();
                  value.Costpost = false;
               }
            }
         });

         _input.UIJobCharge.map(function (value, key) {
            if (value.SingleSelect == true && value.PK) {
               if (!value.Revenuepost) {
                  value.ARPostDate = new Date().toUTCString();
                  value.Revenuepost = false;
               }
            }
         });

         var _PostCost1 = _input.UIJobCharge.some(function (value, key) {
            if (value.SingleSelect == true && !value.PK || value.ChargeType == "REV") {
               return false;
            }
            else {
               return true;
            }
         });

         var _PostCost2 = _input.UIJobCharge.some(function (value, key) {
            if (value.APPostDate) {
               return true;
            }
            else {
               return false;
            }
         });

         var _PostRevenue1 = _input.UIJobCharge.some(function (value, key) {
            if (value.SingleSelect == true && !value.PK) {
               return false;
            }
            else {
               return true;
            }
         });

         var _PostRevenue2 = _input.UIJobCharge.some(function (value, key) {
            if (value.ARPostDate) {
               return true;
            }
            else {
               return false;
            }
         });

         if (!_PostCost1 || !_PostRevenue1) {
            var modalOptions = {
               closeButtonText: 'Cancel',
               actionButtonText: 'Ok',
               headerText: 'Post Cost?',
               bodyText: "Please save the job charge (OR) charge type not 'REV'  before posting charges"
            };

            confirmation.showModal({}, modalOptions).then(function (result) {
               console.log(result);
               return false;

            }, function () {
               console.log("Cancelled");
               return false;
            });
         }
         else if (!_PostCost2 || !_PostRevenue2) {
            toastr.error("Job charges already posted...!");
         }
         else if (_PostCost1 && _PostCost2 && _PostRevenue1 && _PostRevenue2) {
            JobAccountingCtrl.ePage.Masters.PostCostButtonText = "Please Wait...";
            if ($item.isNew) {
               /*  false */
            } else {
               $item = filterObjectUpdate($item, "IsModified");
               if ($item[$item.code].ePage.Entities.Header.Data.UIJobCharge.length > 0) {
                  $item[$item.code].ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                     (value.PK) ? value.IsModified = true : value.IsModified = false;
                  });
               }
            }

            helperService.SaveEntity($item, 'JobHeader').then(function (response) {
               JobAccountingCtrl.ePage.Masters.SelectAll = false;
               JobAccountingCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
               JobAccountingCtrl.ePage.Masters.DisablePostCost = true;
               JobAccountingCtrl.ePage.Masters.DisablePostRevenue = true;
               JobAccountingCtrl.ePage.Masters.DisablePost = true;

               if (response.Status === "success") {
                  apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.GetById.Url + JobAccountingCtrl.currentFinanceJob.code).then(function (response) {
                     if (response.data.Status == "Success") {
                        financeConfig.TabList.map(function (value, key) {
                           if (value.New) {
                              /*  undefined */
                           }
                        });

                        var _index = financeConfig.TabList.map(function (value, key) {
                           return value[value.code].ePage.Entities.Header.Data.PK;
                        }).indexOf(JobAccountingCtrl.currentFinanceJob[JobAccountingCtrl.currentFinanceJob.code].ePage.Entities.Header.Data.PK);


                        if (_index !== -1) {
                           if (response.data.Response) {
                              financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data.Response;
                           }
                           else {
                              financeConfig.TabList[_index][financeConfig.TabList[_index].code].ePage.Entities.Header.Data = response.data;
                           }
                           financeConfig.TabList[_index].isNew = false;
                           helperService.refreshGrid();
                        }
                        toastr.success("Post Cost Successfully...!");
                     }
                     else if (response.data.Status === "failed") {
                        console.log("GetById Failed");
                     }
                  });
               } else if (response.Status === "failed") {
                  toastr.error("Could not Post Cost...!");
                  JobAccountingCtrl.ePage.Entities.Header.Validations = response.Validations;
                  angular.forEach(response.Validations, function (value, key) {
                     JobAccountingCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, JobAccountingCtrl.currentFinanceJob.code, false, undefined, undefined, undefined, undefined, undefined);
                  });
                  if (JobAccountingCtrl.ePage.Entities.Header.Validations != null) {
                     JobAccountingCtrl.ePage.Masters.Config.ShowErrorWarningModal(JobAccountingCtrl.currentFinanceJob);
                  }
               }
            });
         }
      }
      //#endregion

      Init();
   }

})();