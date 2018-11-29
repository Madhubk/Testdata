(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_ActionModalController", one_one_ActionModalController);

    one_one_ActionModalController.$inject = ["apiService", "one_order_listConfig", "appConfig", "helperService", "$uibModalInstance", "param"];

    function one_one_ActionModalController(apiService, one_order_listConfig, appConfig, helperService, $uibModalInstance, param) {
        var one_one_ActionModalCtrl = this;

        function Init() {
            var CurrentOrder = param.item[param.item.label].ePage.Entities;
            one_one_ActionModalCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": CurrentOrder
            };

            InitActionModal();
        }

        function InitActionModal() {
            one_one_ActionModalCtrl.ePage.Masters.SplitOrder = SplitOrder;
            one_one_ActionModalCtrl.ePage.Masters.CreateOrder = CreateOrder;
            one_one_ActionModalCtrl.ePage.Masters.DoNothing = DoNothing;
        }

        function SplitOrder() {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API.split.Url + one_one_ActionModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK).then(function (response) {
                if (response.data.Response) {
                    var __obj = {
                        entity: response.data.Response.UIOrder_Buyer,
                        data: response.data.Response
                    };
                    one_order_listConfig.Entities.AddTab(__obj, true);
                    $uibModalInstance.dismiss('cancel');
                } else {
                    console.log("Empty Split Order response");
                }
            });
        }

        function CreateOrder() {
            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIOrder_Buyer.PAR_AccessCode = "1_1";
                    var _obj = {
                        entity: response.data.Response.Response.UIOrder_Buyer,
                        data: response.data.Response.Response
                    };
                    one_order_listConfig.Entities.AddTab(_obj, true);
                    $uibModalInstance.dismiss('cancel');
                } else {
                    console.log("Empty New Order response");
                }
            });
        }

        function DoNothing() {
            $uibModalInstance.close(param.item);
        }

        Init();
    }
})();