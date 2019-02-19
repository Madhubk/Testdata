(function () {
    "use strict";

    angular
        .module("Application")
        .controller("cntBuyerViewTemplateController", cntBuyerViewTemplateController);

    cntBuyerViewTemplateController.$inject = ["$filter", "helperService", "appConfig", "apiService"];

    function cntBuyerViewTemplateController($filter, helperService, appConfig, apiService) {
        /* jshint validthis: true */
        var cntBuyerViewTemplateCtrl = this;

        function Init() {
          
            var currentContainer = cntBuyerViewTemplateCtrl.currentContainer[cntBuyerViewTemplateCtrl.currentContainer.label].ePage.Entities.Header.Data;
            cntBuyerViewTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "cnt_buyer_view_general",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentContainer
            };

            InitGeneral();
        }

        function InitGeneral() {
            MenuConfig();
        }
        // dynamic menu list config
        function MenuConfig() {
            
            var Key;
            // if (cntBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (cntBuyerViewTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "1_3_CNT_MENU_DEFAULT";
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
                    cntBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    cntBuyerViewTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(cntBuyerViewTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    cntBuyerViewTemplateCtrl.ePage.Masters.MenuObj = cntBuyerViewTemplateCtrl.currentContainer;
                    cntBuyerViewTemplateCtrl.ePage.Masters.MenuObj.TabTitle = cntBuyerViewTemplateCtrl.currentContainer.label;
                }
            });
        }

        Init();
    }
})();