(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PoModalController", PoModalController);

    PoModalController.$inject = ["$injector", "$uibModalInstance", "authService", "apiService", "appConfig", "helperService", "param", "toastr"];

    function PoModalController($injector, $uibModalInstance, authService, apiService, appConfig, helperService, param, toastr) {
        var PoModalCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            var currentBatch = param.currentBatch[param.currentBatch.label].ePage.Entities;
            PoModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PO_Upload_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBatch
            };

            InitPOUploadModal();
        }

        function InitPOUploadModal() {
            PoModalCtrl.ePage.Masters.Param = param;
            PoModalCtrl.ePage.Masters.Cancel = Cancel;
            PoModalCtrl.ePage.Masters.Close = Close;

            GetRelatedLookupList();
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function Close(item) {
            (item) ? Cancel(): false;
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "PoBatchUploadOrg_3244",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        Init();
    }
})();