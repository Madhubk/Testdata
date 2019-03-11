(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDashboardController", DynamicDashboardController);

    DynamicDashboardController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window", "dynamicLookupConfig", "confirmation"];

    function DynamicDashboardController($location, $scope, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $state, $uibModal, $window, dynamicLookupConfig, confirmation) {

        var DynamicDashboardCtrl = this;

        function Init() {
            DynamicDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicDashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            GetJson();
            DynamicDashboardCtrl.ePage.Masters.LoadMoreBtnTxt = "Load More";
            DynamicDashboardCtrl.ePage.Masters.LoadMore = LoadMore;
            DynamicDashboardCtrl.ePage.Masters.IsVisibleLoadMoreBtn = true;
        }

        function LoadMore() {            
            DynamicDashboardCtrl.ePage.Masters.templateDir = '<dynamic-dashboard-directive component-list="DynamicDashboardCtrl.ePage.Masters.ComponentList"></dynamic-dashboard-directive>';
            // var newDirective = angular.element(scope.templateDir);
            angular.element(DynamicDashboardCtrl.ePage.Masters.templateDir);
            // var view = $compile(newDirective)(scope);
            // ele.append(view);
            // return DynamicDashboardCtrl.ePage.Masters.EditActivityModal = $uibModal.open({
            //     animation: true,
            //     keyboard: true,
            //     windowClass: " right",
            //     scope: $scope,
            //     template: `<div class="modal-body pt-10" id="modal-body">
            //     <dynamic-dashboard-directive component-list="DynamicDashboardCtrl.ePage.Masters.ComponentList"></dynamic-dashboard-directive>
            //                         </div>`
            // });
        }

        function GetJson() {
            DynamicDashboardCtrl.ePage.Masters.ComponentList = [{
                "ComponentName": "Notification",
                "Directive": "notification",
                "SequenceNo": "1",
                "IsShow": true
            }, {
                "ComponentName": "KPI",
                "Directive": "kpi-directive",
                "SequenceNo": "2",
                "IsShow": true
            }, {
                "ComponentName": "MyTask",
                "Directive": "my-task-directive",
                "SequenceNo": "3",
                "IsShow": true
            }, {
                "ComponentName": "Exception",
                "Directive": "exception-directive",
                "SequenceNo": "4",
                "IsShow": true
            }, {
                "ComponentName": "SGDE",
                "Directive": "1",
                "SequenceNo": "5",
                "IsShow": false
            }, {
                "ComponentName": "SGDE",
                "Directive": "1",
                "SequenceNo": "6",
                "IsShow": false
            }, {
                "ComponentName": "SGDE",
                "Directive": "1",
                "SequenceNo": "7",
                "IsShow": false
            }];
        }

        Init();

    }

})();