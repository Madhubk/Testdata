(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewTemplateController", OrdBuyerViewTemplateController);

    OrdBuyerViewTemplateController.$inject = ["$filter", "helperService", "appConfig", "apiService"];

    function OrdBuyerViewTemplateController($filter, helperService, appConfig, apiService) {
        var OrdBuyerViewTemplateCtrl = this;

        function Init() {
            var currentOrder = OrdBuyerViewTemplateCtrl.currentOrder[OrdBuyerViewTemplateCtrl.currentOrder.label].ePage.Entities;
            OrdBuyerViewTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "ord_buyer_view_general",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitGeneral();
        }

        function InitGeneral() {
            MenuConfig();
        }
        // dynamic menu list config
        function MenuConfig() {
            var Key;
            // if (OrdBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (OrdBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "1_1_ORD_MENU_DEFAULT";
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
                    OrdBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    OrdBuyerViewTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(OrdBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    OrdBuyerViewTemplateCtrl.ePage.Masters.MenuObj = OrdBuyerViewTemplateCtrl.currentOrder;
                    OrdBuyerViewTemplateCtrl.ePage.Masters.MenuObj.TabTitle = OrdBuyerViewTemplateCtrl.currentOrder.label;
                }
            });
        }

        Init();
    }
})();