(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobGeneralPopupController", FinanceJobGeneralPopupController);

    FinanceJobGeneralPopupController.$inject = ["$uibModalInstance", "helperService", "apiService", "APP_CONSTANT", "financeConfig", "CurrentFinanceJob", "Index", "toastr"];

    function FinanceJobGeneralPopupController($uibModalInstance, helperService, apiService, APP_CONSTANT, financeConfig, CurrentFinanceJob, Index, toastr) {
        var FinanceJobGeneralPopupCtrl = this;

        function Init() {
            var currentFinanceJob = CurrentFinanceJob[CurrentFinanceJob.code].ePage.Entities;

            FinanceJobGeneralPopupCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job_General_Popup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFinanceJob
            };

            FinanceJobGeneralPopupCtrl.ePage.Masters.CloseButtonText = "Close";

            /* Function  */
            FinanceJobGeneralPopupCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            FinanceJobGeneralPopupCtrl.ePage.Masters.OnOSAmtChange = OnOSAmtChange;
            FinanceJobGeneralPopupCtrl.ePage.Masters.OnLocalAmtChange = OnLocalAmtChange;
            FinanceJobGeneralPopupCtrl.ePage.Masters.Close = Close;

            /* DatePicker */
            FinanceJobGeneralPopupCtrl.ePage.Masters.DatePicker = {};
            FinanceJobGeneralPopupCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            FinanceJobGeneralPopupCtrl.ePage.Masters.DatePicker.isOpen = [];
            FinanceJobGeneralPopupCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitGetJobChargeDetaile();
        }

        function InitGetJobChargeDetaile() {
            FinanceJobGeneralPopupCtrl.ePage.Entities.Header.Data.UIJobCharge.map(function (value, key) {
                if (Index == key) {
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil = FinanceJobGeneralPopupCtrl.ePage.Entities.Header.Data.UIJobCharge[key];
                }
            });
        }
        //#region  DatePicker
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            FinanceJobGeneralPopupCtrl.ePage.Masters.DatePicker.isOpen[opened] = true
        }
        //#endregion

        //#region  Lookup, OSAmount & LocalAmount Change
        function SelectedLookupData($item, type) {
            if (type == 'ChargeCode') {
                if ($item.ChargeType == "MRG") {
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.ChargeType = $item.ChargeType;
                }
                else if ($item.ChargeType == "REV") {
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.ChargeType = $item.ChargeType;
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.VendorCode = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.APInvoiceNum = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.APInvoiceDate = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.RX_NKCostCurrency = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.EstimatedCost = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.OSCostAmt = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.LocalCostAmt = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.CostTaxCode = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.OSCostGSTAmt = "";

                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.OSSellAmt = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.LocalSellAmt = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.RevenueTaxCode = "";
                    FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.OSSellGSTAmt = "";
                }
                FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.CustomerCode = FinanceJobGeneralPopupCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_Code;
                FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.ORG_SellAccount = FinanceJobGeneralPopupCtrl.ePage.Entities.Header.Data.UIJobHeader.LocalOrg_FK;
            }
        }

        function OnOSAmtChange(ActualAmt, type) {
            if (type == 'CostActualAmt') {
                FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.LocalCostAmt = ActualAmt;
            }
            else if (type == 'RevenueActualAmt') {
                FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.LocalSellAmt = ActualAmt;
            }
        }

        function OnLocalAmtChange(LocalAmt, type) {
            if (type == 'CostLocalAmt') {
                FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.OSCostAmt = LocalAmt;
            }
            else if (type == 'RevenueLocalAmt') {
                FinanceJobGeneralPopupCtrl.ePage.Masters.UIJobChargeGetDeatil.OSSellAmt = LocalAmt;
            }
        }
        //#endregion

        //#region Close
        function Close() {
            $uibModalInstance.dismiss('close');
        }
        //#endregion

        Init();
    }
})();