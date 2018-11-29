(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolEntityDetailsController", ConsolEntityDetailsController);

    ConsolEntityDetailsController.$inject = ["$window", "apiService", "appConfig", "helperService"];

    function ConsolEntityDetailsController($window, apiService, appConfig, helperService) {
        /* jshint validthis: true */
        var ConsolEntityDetailsCtrl = this;

        function Init() {
            ConsolEntityDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Entity_Details",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };

            ConsolEntityInit();
        }

        function ConsolEntityInit() {
            ConsolEntityDetailsCtrl.ePage.Masters.ConsolEntityObj = ConsolEntityDetailsCtrl.currentObj;
            ConsolEntityDetailsCtrl.ePage.Masters.Type = ConsolEntityDetailsCtrl.mode;
            ConsolEntityDetailsCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            var _con_pk;
        
            if (ConsolEntityDetailsCtrl.ePage.Masters.ConsolEntityObj) {
                if (ConsolEntityDetailsCtrl.ePage.Masters.ConsolEntityObj.CON_FK) {
                    _con_pk = ConsolEntityDetailsCtrl.ePage.Masters.ConsolEntityObj.CON_FK;
                } else {
                    _con_pk = ConsolEntityDetailsCtrl.ePage.Masters.ConsolEntityObj.EntityRefKey;
                }
            }

            apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + _con_pk).then(function (response) {
                if (response.data.Response) {
                    ConsolEntityDetailsCtrl.ePage.Entities.Header.Data = response.data.Response;
                } else {
                    console.log("Empty New Shipment response");
                }
            });
        }

        function SingleRecordView() {
            var _queryString = {
                PK: ConsolEntityDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.PK,
                Code: ConsolEntityDetailsCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/consolidation/" + _queryString, "_blank");
        }

        Init();
    }
})();