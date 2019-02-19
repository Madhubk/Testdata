(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderViewDefaultGeneralController", OrderViewDefaultGeneralController);

    OrderViewDefaultGeneralController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function OrderViewDefaultGeneralController($window, helperService, appConfig, apiService) {
        var OrderViewDefaultGeneralCtrl = this;

        function Init() {
            var obj = OrderViewDefaultGeneralCtrl.obj[OrderViewDefaultGeneralCtrl.obj.label].ePage.Entities;
            OrderViewDefaultGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "one_two_ReadOnlyGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitGeneral();
        }

        function InitGeneral() {
            OrderViewDefaultGeneralCtrl.ePage.Masters.SelectedShipmentRow = SelectedShipmentRow;
            InitCustom();
        }

        function SelectedShipmentRow(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer_Supplier.PK,
                Code: curEntity.UIShipment_Buyer_Supplier.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment-view?q=" + _queryString, "_blank");
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            (OrderViewDefaultGeneralCtrl.obj.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            OrderViewDefaultGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "BPOrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: OrderViewDefaultGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.Buyer
                };
            } else {
                var _filter = {
                    DataEntryName: "BPOrderHeaderCustom"
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    OrderViewDefaultGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });

        }

        Init();
    }
})();