(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerSupplierViewTemplateController", OrdBuyerSupplierViewTemplateController);

    OrdBuyerSupplierViewTemplateController.$inject = ["$filter", "helperService", "appConfig", "apiService"];

    function OrdBuyerSupplierViewTemplateController($filter, helperService, appConfig, apiService) {
        var OrdBuyerSupplierViewTemplateCtrl = this;

        function Init() {
            var currentOrder = OrdBuyerSupplierViewTemplateCtrl.currentOrder[OrdBuyerSupplierViewTemplateCtrl.currentOrder.label].ePage.Entities;
            OrdBuyerSupplierViewTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "one_two_order_general",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitGeneral();
        }

        function InitGeneral() {
            // OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.SaveBtnText = "Save";
            // OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.CompleteBtnText = "Complete";
            // OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            // OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.IsDisableSaveBtn = false;
            // OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.Save = "";
            // OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.Complete = "";

            MenuConfig();
        }
        // dynamic menu list config
        function MenuConfig() {
            var Key;
            // if (OrdBuyerSupplierViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (OrdBuyerSupplierViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "1_2_ORD_MENU_DEFAULT";
            var _filter = {
                "Key": Key,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.MenuObj = OrdBuyerSupplierViewTemplateCtrl.currentOrder;
                    OrdBuyerSupplierViewTemplateCtrl.ePage.Masters.MenuObj.TabTitle = OrdBuyerSupplierViewTemplateCtrl.currentOrder.label;
                }
            });
        }

        Init();
    }
})();