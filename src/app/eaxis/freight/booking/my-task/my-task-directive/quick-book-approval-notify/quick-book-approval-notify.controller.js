(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookApprovalNotifyDirectiveController", QuickBookApprovalNotifyDirectiveController);

        QuickBookApprovalNotifyDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function QuickBookApprovalNotifyDirectiveController($window, helperService, apiService, appConfig) {
        var QuickBookApprovalNotifyDirectiveCtrl = this;

        function Init() {
            QuickBookApprovalNotifyDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Approval_Notify",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            QuickBookApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask = QuickBookApprovalNotifyDirectiveCtrl.taskObj;
            TaskGetById();
        }

        function TaskGetById() {
            if (QuickBookApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        QuickBookApprovalNotifyDirectiveCtrl.ePage.Masters.HeaderDetails = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();