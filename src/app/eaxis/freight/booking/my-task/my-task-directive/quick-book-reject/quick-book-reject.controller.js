(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookRejectDirectiveController", QuickBookRejectDirectiveController);

    QuickBookRejectDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function QuickBookRejectDirectiveController($window, helperService, apiService, appConfig) {
        var QuickBookRejectDirectiveCtrl = this;

        function Init() {
            QuickBookRejectDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Rejection",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            QuickBookRejectDirectiveCtrl.ePage.Masters.MyTask = QuickBookRejectDirectiveCtrl.taskObj;
            TaskGetById();
        }

        function TaskGetById() {
            QuickBookRejectDirectiveCtrl.ePage.Masters.OrderDetails = [];
            if (QuickBookRejectDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookRejectDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        QuickBookRejectDirectiveCtrl.ePage.Masters.HeaderDetails = response.data.Response;
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
                        QuickBookRejectDirectiveCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    }
                } else {

                }
            });
        }

        Init();
    }
})();