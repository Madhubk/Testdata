(function () {
    "use strict";

    angular
        .module("Application")
        .controller("shpBuyerViewTemplateController", shpBuyerViewTemplateController);

    shpBuyerViewTemplateController.$inject = ["$filter", "helperService", "appConfig", "apiService"];

    function shpBuyerViewTemplateController($filter, helperService, appConfig, apiService) {
        /* jshint validthis: true */
        var shpBuyerViewTemplateCtrl = this;

        function Init() {
            var currentShipment = shpBuyerViewTemplateCtrl.currentShipment[shpBuyerViewTemplateCtrl.currentShipment.label].ePage.Entities;
            shpBuyerViewTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "shp_buyer_view_general",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            InitGeneral();
        }

        function InitGeneral() {
            MenuConfig();
        }
        // dynamic menu list config
        function MenuConfig() {
            var Key;
            // if (shpBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (shpBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "1_1_SHP_MENU_DEFAULT";
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
                    shpBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    shpBuyerViewTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(shpBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    shpBuyerViewTemplateCtrl.ePage.Masters.MenuObj = shpBuyerViewTemplateCtrl.currentShipment;
                    shpBuyerViewTemplateCtrl.ePage.Masters.MenuObj.TabTitle = shpBuyerViewTemplateCtrl.currentShipment.label;
                }
            });
        }

        Init();
    }
})();