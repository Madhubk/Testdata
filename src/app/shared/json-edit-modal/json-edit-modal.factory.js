(function () {
    "use strict";

    angular
        .module("Application")
        .factory("jsonEditModal", JsonEditModal);

    JsonEditModal.$inject = ["$uibModal"];

    function JsonEditModal($uibModal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            animation: true,
            windowClass: "json-edit left",
            templateUrl: 'app/shared/json-edit-modal/json-edit-modal.html',
            controller: 'JsonEditModalController',
            controllerAs: "JsonEditModalCtrl",
            bindToController: true
        };
        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
        var exports = {
            showModal: ShowModal,
            show: Show
        };
        return exports;

        function ShowModal(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            return exports.show(customModalDefaults, customModalOptions);
        }

        function Show(customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            return $uibModal.open(tempModalDefaults).result;
        }
    }

    angular
        .module("Application")
        .controller("JsonEditModalController", JsonEditModalController);

    JsonEditModalController.$inject = ["$scope", "$uibModalInstance", "helperService", "param"];

    function JsonEditModalController($scope, $uibModalInstance, helperService, param) {
        var JsonEditModalCtrl = this;

        function Init() {
            JsonEditModalCtrl.ePage = {
                "Title": "",
                "Prefix": "",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            JsonEditModalCtrl.ePage.Masters.param = param;

            JsonEditModalCtrl.ePage.Masters.InitJson = InitJson;
            JsonEditModalCtrl.ePage.Masters.ToggleView = ToggleView;
            JsonEditModalCtrl.ePage.Masters.Ok = Ok;
            JsonEditModalCtrl.ePage.Masters.Cancel = Cancel;

            if (typeof param.Data === "string") {
                param.Data = JSON.parse(param.Data);
            }

            JsonEditModalCtrl.ePage.Masters.obj = {
                data: param.Data,
                options: {
                    mode: 'tree'
                }
            };
        }

        function InitJson(instance) {
            instance.expandAll();
        }

        function ToggleView() {
            JsonEditModalCtrl.ePage.Masters.obj.options.mode = (JsonEditModalCtrl.ePage.Masters.obj.options.mode == 'tree') ? 'code' : 'tree';
        }

        function Ok() {
            var _exports;
            (typeof param.Data !== "string") ? (_exports = JSON.stringify(JsonEditModalCtrl.ePage.Masters.obj.data)) : (_exports = JsonEditModalCtrl.ePage.Masters.obj.data);

            $uibModalInstance.close(_exports);
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }

})();
