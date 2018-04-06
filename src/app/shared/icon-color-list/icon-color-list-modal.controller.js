(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IconColorListModalController", IconColorListModalController);

    IconColorListModalController.$inject = ["$http", "$timeout", "$uibModalInstance", "helperService", 'param'];

    function IconColorListModalController($http, $timeout, $uibModalInstance, helperService, param) {
        var IconColorListModalCtrl = this;

        function Init() {
            IconColorListModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Icon_Color_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            IconColorListModalCtrl.ePage.Masters.Close = Close;
            IconColorListModalCtrl.ePage.Masters.OnItemClick = OnItemClick;

            $timeout(function () {
                GetIconColorList();
            }, 300);
        }

        function GetIconColorList() {
            $http({
                method: "GET",
                url: "app/shared/icon-color-list/" + param.type + "-list.json"
            }).then(function mySucces(response) {
                if (response.data) {
                    IconColorListModalCtrl.ePage.Masters.IconColorList = response.data;
                }
            }, function myError(response) {
                console.log(response)
            });
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function OnItemClick($item) {
            $uibModalInstance.close($item);
        }

        Init();
    }
})();
