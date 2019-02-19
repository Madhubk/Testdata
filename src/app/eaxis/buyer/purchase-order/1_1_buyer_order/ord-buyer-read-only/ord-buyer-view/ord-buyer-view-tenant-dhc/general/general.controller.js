(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewGeneralDhcController", OrdBuyerViewGeneralDhcController);

    OrdBuyerViewGeneralDhcController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function OrdBuyerViewGeneralDhcController($window, helperService, appConfig, apiService) {
        var OrdBuyerViewGeneralDhcCtrl = this;

        function Init() {
            var obj = OrdBuyerViewGeneralDhcCtrl.obj[OrdBuyerViewGeneralDhcCtrl.obj.label].ePage.Entities;
            OrdBuyerViewGeneralDhcCtrl.ePage = {
                "Title": "",
                "Prefix": "OrdBuyerViewGeneralDhc",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitGeneral();
        }

        function InitGeneral() {
            OrdBuyerViewGeneralDhcCtrl.ePage.Masters.SelectedShipmentRow = SelectedShipmentRow;
            InitCustom();
        }

        function SelectedShipmentRow(curEntity) {
            var _queryString = {
                PK: curEntity.UIOrder_Buyer.SHP_FK,
                ShipmentNo: curEntity.UIOrder_Buyer.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/booking-view?q=" + _queryString, "_blank");
        }
        // ----------------------------------- Init Custom-----------------------------------
        function InitCustom() {
            (OrdBuyerViewGeneralDhcCtrl.obj.isNew) ? GetDynamicControl(): GetDynamicControl("ORG");
        }

        function GetDynamicControl(mode) {
            // Get Dynamic filter controls
            OrdBuyerViewGeneralDhcCtrl.ePage.Masters.DynamicControl = undefined;
            if (mode == "ORG") {
                var _filter = {
                    DataEntryName: "BPOrderHeaderCustomOrg",
                    IsRoleBased: false,
                    IsAccessBased: false,
                    OrganizationCode: OrdBuyerViewGeneralDhcCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer
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
                    OrdBuyerViewGeneralDhcCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    var _customData = [];
                    response.data.Response.Entities.map(function (val, key) {
                        val.ConfigData.map(function (value, key) {
                            var _data = {};
                            _data.PropertyName = value.PropertyName;
                            _data.LabelText = value.AttributesDetails.LabelText;
                            _customData.push(_data);
                        });
                    });
                    OrdBuyerViewGeneralDhcCtrl.ePage.Masters.DynamicCustomFormDetails = _customData;
                }
            });
        }

        Init();
    }
})();