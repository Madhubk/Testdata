(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingBuyerOrcDirectiveController", ConvertBookingBuyerOrcDirectiveController);

    ConvertBookingBuyerOrcDirectiveController.$inject = ["helperService", "apiService", "appConfig"];

    function ConvertBookingBuyerOrcDirectiveController(helperService, apiService, appConfig) {
        var ConvertBookingBuyerOrcDirectiveCtrl = this;

        function Init() {
            ConvertBookingBuyerOrcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "CTB_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrderDetails": []
                        }
                    }
                }
            };

            InitBooking();
        }

        function InitBooking() {
            ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask = ConvertBookingBuyerOrcDirectiveCtrl.taskObj;
            if (ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + ConvertBookingBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.UIOrderDetails = ConvertBookingBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrderDetails;
                        response.data.Response.UIOrderDetails.push(response.data.Response.UIOrder_Buyer);
                        ConvertBookingBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();