(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryOrdBuyerViewTemplateController", DeliveryOrdBuyerViewTemplateController);

    DeliveryOrdBuyerViewTemplateController.$inject = ["$filter", "helperService", "appConfig", "apiService"];

    function DeliveryOrdBuyerViewTemplateController($filter, helperService, appConfig, apiService) {
        var DeliveryOrdBuyerViewTemplateCtrl = this;

        function Init() {
            var currentOrder = DeliveryOrdBuyerViewTemplateCtrl.currentOrder[DeliveryOrdBuyerViewTemplateCtrl.currentOrder.label].ePage.Entities;
            DeliveryOrdBuyerViewTemplateCtrl.ePage = {
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
            // if (DeliveryOrdBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (DeliveryOrdBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "DELIVERY_ORD_MENU_DEFAULT";
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
                    DeliveryOrdBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    DeliveryOrdBuyerViewTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(DeliveryOrdBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    DeliveryOrdBuyerViewTemplateCtrl.ePage.Masters.MenuObj = DeliveryOrdBuyerViewTemplateCtrl.currentOrder;
                    DeliveryOrdBuyerViewTemplateCtrl.ePage.Masters.MenuObj.TabTitle = DeliveryOrdBuyerViewTemplateCtrl.currentOrder.label;
                }
            });
        }

        Init();
    }
})();