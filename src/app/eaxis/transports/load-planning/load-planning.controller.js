(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoadPlanningController", LoadPlanningController);

    LoadPlanningController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$http"];

    function LoadPlanningController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $http) {

        var LoadPlanningCtrl = this;

        function Init() {

            LoadPlanningCtrl.ePage = {
                "Title": "",
                "Prefix": "Load_Planning",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };
            LoadPlanningCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            getPlanningJSon()
            //getJson()
        }

        function getPlanningJSon() {
            apiService.get("eAxisAPI", "TmsLoadPlanning/DetailsFindAll").then(function SuccessCallback(response) {
                LoadPlanningCtrl.ePage.Masters.Details = response.data.Response;
                LoadPlanningCtrl.ePage.Masters.PlanningDetail = _.groupBy(LoadPlanningCtrl.ePage.Masters.Details, 'Depot');
                console.log(LoadPlanningCtrl.ePage.Masters.PlanningDetail)
            });
        }

        // function getJson(){
        //     $http.get('app/eaxis/transports/load-planning/load-planning.json').success(function (response) {
        //         LoadPlanningCtrl.ePage.Masters.list1 = response;
        //         LoadPlanningCtrl.ePage.Masters.list2 = [];
        //         console.log(LoadPlanningCtrl.ePage.Masters.list2.length)
        //     });
        // }

        function OpenEditForm(key, $item, detail) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "level-load-edit",
                scope: $scope,
                templateUrl: "app/eaxis/transports/load-planning/load-planning-edit/load-planning-edit.html",
                controller: 'LoadPlanningEditController as LoadPlanningEditCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": LoadPlanningCtrl.ePage.Masters.Details,
                            "key": key,
                            "Item": $item,
                            "Detail": detail
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    // var _obj = {
                    //     "Refresh": LevelLoad
                    // };
                    // _obj[response.type]();

                },
                function () {
                    console.log("Cancelled");
                }
            );
        }
        Init();
    }

})();