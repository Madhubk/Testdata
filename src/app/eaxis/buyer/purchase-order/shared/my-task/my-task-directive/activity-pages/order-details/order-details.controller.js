(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityPageOrderDetailsController", ActivityPageOrderDetailsController);

    ActivityPageOrderDetailsController.$inject = ["$window", "helperService", "myTaskActivityConfig", "apiService", "appConfig"];

    function ActivityPageOrderDetailsController($window, helperService, myTaskActivityConfig, apiService, appConfig) {
        var ActivityPageOrderDetailsCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            ActivityPageOrderDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "one_two_ReadOnlyGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitGeneral();
        }

        function InitGeneral() {
            ActivityPageOrderDetailsCtrl.ePage.Masters.SelectedShipmentRow = SelectedShipmentRow;
            InitCustom();
        }

        function SelectedShipmentRow(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer_Supplier.PK,
                Code: curEntity.UIShipment_Buyer_Supplier.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            (ActivityPageOrderDetailsCtrl.obj.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            ActivityPageOrderDetailsCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "OrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: ActivityPageOrderDetailsCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.Buyer
                };
            } else {
                var _filter = {
                    DataEntryName: "OrderHeaderCustom"
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
                    ActivityPageOrderDetailsCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });

        }

        Init();
    }
})();