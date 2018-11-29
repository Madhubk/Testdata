(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingCancellationDirectiveController", BookingCancellationDirectiveController);

        BookingCancellationDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function BookingCancellationDirectiveController($window, helperService, apiService, appConfig) {
        var BookingCancellationDirectiveCtrl = this;

        function Init() {
            BookingCancellationDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Cancellation",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            BookingCancellationDirectiveCtrl.ePage.Masters.MyTask = BookingCancellationDirectiveCtrl.taskObj;
            TaskGetById();
        }

        function TaskGetById() {
            if (BookingCancellationDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + BookingCancellationDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        BookingCancellationDirectiveCtrl.ePage.Masters.HeaderDetails = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();