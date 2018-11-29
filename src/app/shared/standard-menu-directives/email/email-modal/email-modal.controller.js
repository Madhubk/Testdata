(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmailModalController", EmailModalController);

    EmailModalController.$inject = ["$scope", "$uibModalInstance", "helperService", "param"];

    function EmailModalController($scope, $uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var EmailModalCtrl = this;

        function Init() {
            EmailModalCtrl.ePage = {
                "Title": "",
                "Prefix": "EmailModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            EmailModalCtrl.ePage.Masters.Close = Close;
            EmailModalCtrl.ePage.Masters.OnComplete = OnComplete;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function OnComplete($item) {
            $scope.$parent.onComplete({
                $item: $item
            });
        }

        Init();
    }
})();
