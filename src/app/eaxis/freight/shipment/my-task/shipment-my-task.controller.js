(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentMyTaskController", ShipmentMyTaskController);

    ShipmentMyTaskController.$inject = ["helperService"];

    function ShipmentMyTaskController(helperService) {
        /* jshint validthis: true */
        var ShipmentMyTaskCtrl = this;

        function Init() {
            var currentObj = ShipmentMyTaskCtrl.currentShipment[ShipmentMyTaskCtrl.currentShipment.label].ePage.Entities;

            ShipmentMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            ShipmentMyTaskCtrl.ePage.Masters.MyTask = {};

            if (ShipmentMyTaskCtrl.listSource) {
                ShipmentMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(ShipmentMyTaskCtrl.listSource);
            } else {
                GetMyTaskList();
            }
        }

        function GetMyTaskList() {
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: ShipmentMyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: ShipmentMyTaskCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ShipmentMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    }
                } else {
                    ShipmentMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
                }
            });
        }

        Init();
    }
})();
