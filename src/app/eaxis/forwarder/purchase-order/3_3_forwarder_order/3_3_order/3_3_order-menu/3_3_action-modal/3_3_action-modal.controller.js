(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_ActionModalController", three_three_ActionModalController);

    three_three_ActionModalController.$inject = ["apiService", "three_order_listConfig", "appConfig", "helperService", "$uibModalInstance", "param"];

    function three_three_ActionModalController(apiService, three_order_listConfig, appConfig, helperService, $uibModalInstance, param) {
        var three_three_ActionModalCtrl = this;

        function Init() {
            var CurrentOrder = param.item[param.item.label].ePage.Entities;
            three_three_ActionModalCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": CurrentOrder
            };

            InitActionModal();
        }

        function InitActionModal() {
            three_three_ActionModalCtrl.ePage.Masters.SplitOrder = SplitOrder;
            three_three_ActionModalCtrl.ePage.Masters.CreateOrder = CreateOrder;
            three_three_ActionModalCtrl.ePage.Masters.DoNothing = DoNothing;
        }

        function SplitOrder() {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.SplitOrderByOrderPk.Url + three_three_ActionModalCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.PK).then(function (response) {
                if (response.data.Response) {
                    var __obj = {
                        entity: response.data.Response.UIOrder_Forwarder,
                        data: response.data.Response
                    };
                    three_order_listConfig.Entities.AddTab(__obj, true);
                    $uibModalInstance.dismiss('cancel');
                } else {
                    console.log("Empty Split Order response");
                }
            });
        }

        function CreateOrder() {
            helperService.getFullObjectUsingGetById(appConfig.Entities.OrderList.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIOrder_Forwarder,
                        data: response.data.Response.Response
                    };
                    three_order_listConfig.Entities.AddTab(_obj, true);
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