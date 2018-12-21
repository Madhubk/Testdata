(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_ActionModalController", one_three_ActionModalController);

    one_three_ActionModalController.$inject = ["apiService", "one_order_listConfig", "appConfig", "helperService", "$uibModalInstance", "orderApiConfig", "param"];

    function one_three_ActionModalController(apiService, one_order_listConfig, appConfig, helperService, $uibModalInstance, orderApiConfig, param) {
        var one_three_ActionModalCtrl = this;

        function Init() {
            var CurrentOrder = param.item[param.item.label].ePage.Entities;
            one_three_ActionModalCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": CurrentOrder
            };

            InitActionModal();
        }

        function InitActionModal() {
            one_three_ActionModalCtrl.ePage.Masters.SplitOrder = SplitOrder;
            one_three_ActionModalCtrl.ePage.Masters.CreateOrder = CreateOrder;
            one_three_ActionModalCtrl.ePage.Masters.DoNothing = DoNothing;
        }

        function SplitOrder() {
            apiService.get("eAxisAPI", orderApiConfig.Entities.BuyerForwarderOrder.API.split.Url + one_three_ActionModalCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.PK).then(function (response) {
                if (response.data.Response) {
                    var __obj = {
                        entity: response.data.Response.UIOrder_Buyer_Forwarder,
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
            helperService.getFullObjectUsingGetById(orderApiConfig.Entities.BuyerForwarderOrder.API["1_3_listgetbyid"].Url, 'null').then(function (response) {
                if (response.data.Response) {
                    response.data.Response.Response.UIOrder_Buyer_Forwarder.PAR_AccessCode = "1_3";
                    var _obj = {
                        entity: response.data.Response.Response.UIOrder_Buyer_Forwarder,
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