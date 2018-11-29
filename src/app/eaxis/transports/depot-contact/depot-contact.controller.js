(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DepotContactController", DepotContactController);

    DepotContactController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$http", "$filter"];

    function DepotContactController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $http, $filter) {

        var DepotContactCtrl = this;

        function Init() {

            DepotContactCtrl.ePage = {
                "Title": "",
                "Prefix": "Depot_Contact",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": "",
            };

            DepotContactCtrl.ePage.Masters.IsNoRecords = false;
            DepotContactCtrl.ePage.Masters.selectedRow = -1;

            // DatePicker
            DepotContactCtrl.ePage.Masters.DatePicker = {};
            DepotContactCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DepotContactCtrl.ePage.Masters.DatePicker.isOpen = [];
            DepotContactCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DepotContactCtrl.ePage.Masters.OpenDepotDetails = OpenDepotDetails;
            DepotContactCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;

            getDepotDetails();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DepotContactCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function CloseEditActivityModal() {
            DepotContactCtrl.ePage.Masters.selectedRow = -1;
            DepotContactCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function OpenDepotDetails(item, index) {
            DepotContactCtrl.ePage.Masters.selectedRow = index;
            
            var time = DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].LevelLoadDetails.PlanWorkingDays.split(':');
            var date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(time[2]);
            DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].LevelLoadDetails.PlanWorkingDays = date;

            var time = DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].LevelLoadDetails.CommitWorkingDays.split(':');
            var date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(time[2]);
            DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].LevelLoadDetails.CommitWorkingDays = date;

            var time = DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].NationalLoadDetails.PlanWorkingDays.split(':');
            var date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(time[2]);
            DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].NationalLoadDetails.PlanWorkingDays = date;

            var time = DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].NationalLoadDetails.CommitWorkingDays.split(':');
            var date = new Date();
            date.setHours(time[0]);
            date.setMinutes(time[1]);
            date.setSeconds(time[2]);
            DepotContactCtrl.ePage.Masters.Details[DepotContactCtrl.ePage.Masters.selectedRow].NationalLoadDetails.CommitWorkingDays = date;

            openModel(item).result.then(function (response) { }, function () {
                console.log("Cancelled");
            });
        }

        function openModel(item) {
            return DepotContactCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "right depot-contact-edit",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/depot-contact/open-depot-contact.html"
            });
        }

        function getDepotDetails() {
            apiService.get("eAxisAPI", "LevelLoadNationalConfig/FindAll").then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    DepotContactCtrl.ePage.Masters.Details = response.data.Response;
                }
            });
        }

        Init();
    }

})();