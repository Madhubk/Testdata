(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewGeneralController", OrdBuyerViewGeneralController);

    OrdBuyerViewGeneralController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function OrdBuyerViewGeneralController($window, helperService, appConfig, apiService) {
        var OrdBuyerViewGeneralCtrl = this;

        function Init() {
            var obj = OrdBuyerViewGeneralCtrl.obj[OrdBuyerViewGeneralCtrl.obj.label].ePage.Entities;
            OrdBuyerViewGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "OrdBuyerViewGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitGeneral();
        }

        function InitGeneral() {
            OrdBuyerViewGeneralCtrl.ePage.Masters.SelectedShipmentRow = SelectedShipmentRow;
            InitCustom();
        }

        function SelectedShipmentRow(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer.PK,
                Code: curEntity.UIShipment_Buyer.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            (OrdBuyerViewGeneralCtrl.obj.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            OrdBuyerViewGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "OrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: OrdBuyerViewGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer
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
                    OrdBuyerViewGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });

        }

        Init();
    }
})();