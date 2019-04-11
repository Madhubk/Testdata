(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicListViewController", DynamicListViewController);

    DynamicListViewController.$inject = ["$scope", "$location", "$uibModal", "helperService"];

    function DynamicListViewController($scope, $location, $uibModal, helperService) {
        /* jshint validthis: true */
        let DynamicListViewCtrl = this;

        function Init() {
            DynamicListViewCtrl.ePage = {
                "Title": "",
                "Prefix": "DynamicPageList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                let _queryString = $location.search();
                if (_queryString) {
                    let _isEmpty = angular.equals({}, _queryString);

                    if (!_isEmpty) {
                        let _decrypted = helperService.decryptData(_queryString.q);

                        if (typeof _decrypted == "string") {
                            _decrypted = JSON.parse(_decrypted);
                        }
                        DynamicListViewCtrl.ePage.Masters.DefaultFilter = _decrypted.DefaultFilter;
                    }
                }

                DynamicListViewCtrl.ePage.Masters.DataEntryName = $location.path().split("/").pop();

                DynamicListViewCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
                DynamicListViewCtrl.ePage.Masters.Cancel = Cancel;
            } catch (ex) {
                console.log(ex);
            }
        }

        function SelectedGridRow($item) {
            if ($item.action == "new") {
                DynamicListViewCtrl.ePage.Masters.Pkey = null;
                DynamicListViewCtrl.ePage.Masters.Item = null;
                Edit();
            } else if($item.action == "link" || $item.action == "dblClick") {
                let _detailKey = $item.data.entity[$item.dataEntryMaster.GridConfig.DetailKey];
                DynamicListViewCtrl.ePage.Masters.Pkey = _detailKey;
                DynamicListViewCtrl.ePage.Masters.Item = $item.data.entity;
                Edit();
            }
        }

        function EditModalInstance() {
            return DynamicListViewCtrl.ePage.Masters.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "dyn-details-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'dynDataEntryEdit'"></div>`
            });
        }

        function Edit() {
            EditModalInstance().result.then(response => {}, () => Cancel());
        }

        function Cancel() {
            DynamicListViewCtrl.ePage.Masters.EditModal.dismiss('cancel');
        }

        Init();
    }
})();
