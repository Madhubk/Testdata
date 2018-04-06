(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicListModalController", DynamicListModalController);

    DynamicListModalController.$inject = ["$rootScope", "$scope", "$uibModalInstance", "APP_CONSTANT", "helperService", "param", "dynamicListModalConfig", "dynamicLookupConfig"];

    function DynamicListModalController($rootScope, $scope, $uibModalInstance, APP_CONSTANT, helperService, param, dynamicListModalConfig, dynamicLookupConfig) {
        /* jshint validthis: true */
        var DynamicListModalCtrl = this;

        function Init() {
            DynamicListModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_List_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicListModalCtrl.ePage.Masters.LookupConfigFieldName = param.fieldName;
            DynamicListModalCtrl.ePage.Masters.taskName = dynamicLookupConfig.Entities[DynamicListModalCtrl.prefixData].LookupConfig[param.fieldName].pageName;
            DynamicListModalCtrl.ePage.Masters.defaultFilter = dynamicLookupConfig.Entities[DynamicListModalCtrl.prefixData].LookupConfig[param.fieldName].defaults;
            DynamicListModalCtrl.ePage.Masters.selectedItem = {};

            DynamicListModalCtrl.ePage.Masters.Ok = Ok;
            DynamicListModalCtrl.ePage.Masters.Cancel = Cancel;
            DynamicListModalCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Add custom filter objects
            var _isEmpty = angular.equals({}, DynamicListModalCtrl.filter);
            if(!_isEmpty){
                for(var x in DynamicListModalCtrl.filter){
                    DynamicListModalCtrl.ePage.Masters.defaultFilter[x] = DynamicListModalCtrl.filter[x];
                }
            }
        }

        function Ok() {
            $uibModalInstance.close(DynamicListModalCtrl.ePage.Masters.selectedItem);
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick" || $item.action === "multiSelect") {
                DynamicListModalCtrl.ePage.Masters.selectedItem = $item.data;
                Ok();
            }
        }

        Init();
    }
})();
