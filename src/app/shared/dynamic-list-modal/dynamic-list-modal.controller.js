(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicListModalController", DynamicListModalController);

    DynamicListModalController.$inject = ["$uibModalInstance", "helperService", "dynamicLookupConfig"];

    function DynamicListModalController($uibModalInstance, helperService, dynamicLookupConfig) {
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

            DynamicListModalCtrl.ePage.Masters.defaultFilter = {};
            DynamicListModalCtrl.ePage.Masters.selectedItem = {};
            DynamicListModalCtrl.ePage.Masters.taskName = DynamicListModalCtrl.pageName;

            DynamicListModalCtrl.ePage.Masters.Ok = Ok;
            DynamicListModalCtrl.ePage.Masters.Cancel = Cancel;
            DynamicListModalCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (DynamicListModalCtrl.controlKey || DynamicListModalCtrl.controlId) {
                var _index = -1;
                for (var x in dynamicLookupConfig.Entities) {
                    (DynamicListModalCtrl.controlKey) ? _index = x.indexOf(DynamicListModalCtrl.controlKey): _index = x.indexOf(DynamicListModalCtrl.controlId);

                    if (_index !== -1) {
                        DynamicListModalCtrl.ePage.Masters.LookupConfig = dynamicLookupConfig.Entities[x];
                    }
                }
                DynamicListModalCtrl.ePage.Masters.defaultFilter = DynamicListModalCtrl.ePage.Masters.LookupConfig.defaults;
            }
            
            // Add custom filter objects
            var _isEmpty = angular.equals({}, DynamicListModalCtrl.defaultFilter);

            if (!_isEmpty) {
                for (var x in DynamicListModalCtrl.defaultFilter) {
                    DynamicListModalCtrl.ePage.Masters.defaultFilter[x] = DynamicListModalCtrl.defaultFilter[x];
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
            if (DynamicListModalCtrl.mode == 2) {
                DynamicListModalCtrl.ePage.Masters.selectedItem = $item;
            } else if (DynamicListModalCtrl.mode == 3) {
                if ($item.action === "multiSelect") {
                    DynamicListModalCtrl.ePage.Masters.selectedItem = $item.items;
                } else if ($item.action === "link" || $item.action === "dblClick") {
                    DynamicListModalCtrl.ePage.Masters.selectedItem = $item.data;
                }
            }

            Ok();
        }

        Init();
    }
})();
