(function () {
    "use strict";

    angular
        .module("Application")
        .factory("jsonEditModal", JsonEditModal);

    JsonEditModal.$inject = ["$uibModal", "$templateCache"];

    function JsonEditModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header text-center">
            <button class="btn btn-primary btn-xs pull-left margin-right-5" ng-click="JsonEditModalCtrl.ePage.Masters.ToggleView()">Change Option</button>
            <h5 class="modal-title" style="display: inline-block;">
                <strong>JSON Format</strong>
            </h5>
            <button type="button" class="btn btn-warning btn-xs pull-right margin-left-5" ng-click="JsonEditModalCtrl.ePage.Masters.Cancel()">Close</button>
            <button type="button" class="btn btn-primary btn-xs pull-right margin-left-5" ng-click="JsonEditModalCtrl.ePage.Masters.Ok()">Ok</button>
        </div>
        <div class="modal-body">
            <div class="clearfix">
                <div ng-jsoneditor="JsonEditModalCtrl.ePage.Masters.InitJson" ng-model="JsonEditModalCtrl.ePage.Masters.obj.data" options="JsonEditModalCtrl.ePage.Masters.obj.options"
                    class="json-view-edit-container"></div>
            </div>
        </div>`;
        $templateCache.put("JsonEditModal.html", _template);

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            animation: true,
            windowClass: "json-edit left",
            templateUrl: 'JsonEditModal.html',
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
