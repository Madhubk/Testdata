/*
    Page :Container Empty Return
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerEmptyReturnController", ContainerEmptyReturnController);

    ContainerEmptyReturnController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function ContainerEmptyReturnController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var ContainerEmptyReturnCtrl = this;

        function Init() {
            ContainerEmptyReturnCtrl.ePage = {
                "Title": "",
                "Prefix": "CONTAINER_EMPTY_RETURN",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            ContainerEmptyReturnCtrl.ePage.Masters.emptyText = "-";
            ContainerEmptyReturnCtrl.ePage.Masters.TaskObj = ContainerEmptyReturnCtrl.taskObj;
            GetEntityObj();

        }

        function GetEntityObj() {
            if (ContainerEmptyReturnCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.CntContainer.API.GetById.Url + ContainerEmptyReturnCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ContainerEmptyReturnCtrl.ePage.Masters.EntityObj = response.data.Response;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        Init();
    }
})();