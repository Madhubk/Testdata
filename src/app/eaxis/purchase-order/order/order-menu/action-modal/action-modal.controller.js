(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActionModalController", ActionModalController);

    ActionModalController.$inject = ["apiService", "orderConfig", "appConfig", "helperService", "$uibModalInstance", "param"];

    function ActionModalController(apiService, orderConfig, appConfig, helperService, $uibModalInstance, param) {
        var ActionModalCtrl = this;

        function Init() {
            var CurrentOrder = param.item[param.item.label].ePage.Entities;
            ActionModalCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": CurrentOrder
            };

            InitActionModal();
        }

        function InitActionModal() {
            ActionModalCtrl.ePage.Masters.SplitOrder = SplitOrder;
            ActionModalCtrl.ePage.Masters.CreateOrder = CreateOrder;
            ActionModalCtrl.ePage.Masters.DoNothing = DoNothing;
        }

        function SplitOrder() {
            apiService.get("eAxisAPI", appConfig.Entities.PorOrderHeader.API.SplitOrderByOrderPk.Url + ActionModalCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                if (response.data.Response) {
                    var __obj = {
                        entity: response.data.Response.UIPorOrderHeader,
                        data: response.data.Response
                    };
                    orderConfig.Entities.AddTab(__obj, true);
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
                        entity: response.data.Response.Response.UIPorOrderHeader,
                        data: response.data.Response.Response
                    };
                    orderConfig.Entities.AddTab(_obj, true);
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