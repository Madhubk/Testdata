(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyBookingDirectiveController", VerifyBookingDirectiveController);

    VerifyBookingDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function VerifyBookingDirectiveController($window, helperService, apiService, appConfig) {
        var VerifyBookingDirectiveCtrl = this;

        function Init() {
            VerifyBookingDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Verify Booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };


            VerifyBookingDirectiveCtrl.ePage.Masters.MyTask = VerifyBookingDirectiveCtrl.taskObj;
            TaskGetById();
        }


        function TaskGetById() {
            VerifyBookingDirectiveCtrl.ePage.Masters.OrderDetails = [];
            if (VerifyBookingDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VerifyBookingDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        VerifyBookingDirectiveCtrl.ePage.Masters.HeaderDetails = response.data.Response;
                        OrderGetById(response.data.Response.PK);
                    }
                });
            }
        }

        function OrderGetById(_bookingPk) {
            var _filter = {
                "SHP_FK": _bookingPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        VerifyBookingDirectiveCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    }
                } else {

                }
            });
        }

        Init();
    }
})();