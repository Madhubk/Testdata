(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryOrdBuyerMarpulViewGeneralController", DeliveryOrdBuyerMarpulViewGeneralController);

    DeliveryOrdBuyerMarpulViewGeneralController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function DeliveryOrdBuyerMarpulViewGeneralController($window, helperService, appConfig, apiService) {
        var DeliveryOrdBuyerMarpulViewGeneralCtrl = this;

        function Init() {
            var obj = DeliveryOrdBuyerMarpulViewGeneralCtrl.obj[DeliveryOrdBuyerMarpulViewGeneralCtrl.obj.label].ePage.Entities;
            DeliveryOrdBuyerMarpulViewGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "DelivreyOrdBuyerViewGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitGeneral();
        }

        function InitGeneral() {
            DeliveryOrdBuyerMarpulViewGeneralCtrl.ePage.Masters.SelectedShipmentRow = SelectedShipmentRow;
            InitCustom();
        }

        function SelectedShipmentRow(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer.PK,
                Code: curEntity.UIShipment_Buyer.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment?q=" + _queryString, "_blank");
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            (DeliveryOrdBuyerMarpulViewGeneralCtrl.obj.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            DeliveryOrdBuyerMarpulViewGeneralCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "BPOrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: DeliveryOrdBuyerMarpulViewGeneralCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer
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
                    DeliveryOrdBuyerMarpulViewGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    var _customData = [];
                    response.data.Response.Entities.map(function (val, key) {
                        val.ConfigData.map(function (value, key) {
                            var _data = {};
                            _data.PropertyName = value.PropertyName;
                            _data.LabelText = value.AttributesDetails.LabelText;
                            _customData.push(_data);
                        });
                    });
                    DeliveryOrdBuyerMarpulViewGeneralCtrl.ePage.Masters.DynamicCustomFormDetails = _customData;
                }
            });

        }

        Init();
    }
})();