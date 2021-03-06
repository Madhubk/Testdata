(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardDetailsController", OutwardDetailsController);

    OutwardDetailsController.$inject = ["apiService", "$window", "helperService", "gatepassConfig", "warehouseConfig"];

    function OutwardDetailsController(apiService, $window, helperService, gatepassConfig, warehouseConfig) {

        var OutwardDetailsCtrl = this;

        function Init() {
            var currentGatepass = OutwardDetailsCtrl.currentGatepass[OutwardDetailsCtrl.currentGatepass.label].ePage.Entities;
            OutwardDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

            OutwardDetailsCtrl.ePage.Masters.Config = gatepassConfig;
            OutwardDetailsCtrl.ePage.Masters.SingleRecordView = SingleRecordView;

            getOutwardDetails();
        }

        function getOutwardDetails() {
            var _filter = {
                "GatepassNo": OutwardDetailsCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsOutward.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsOutward.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OutwardDetailsCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                        OutwardDetailsCtrl.ePage.Masters.IsShowOutwardDetails = true;
                    } else {
                        OutwardDetailsCtrl.ePage.Masters.IsShowOutwardDetails = false;
                    }
                }
            });
        }

        function SingleRecordView(item) {
            var _queryString = {
                PK: item.PK,
                WorkOrderID: item.WorkOrderID
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/gatepassoutward/" + _queryString, "_blank");
        }

        Init();
    }

})();