(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CommentModalController", CommentModalController);

    CommentModalController.$inject = ["$uibModalInstance", "helperService", "param"];

    function CommentModalController($uibModalInstance, helperService, param) {
        /* jshint validthis: true */
        var CommentModalCtrl = this;

        function Init() {
            CommentModalCtrl.ePage = {
                "Title": "",
                "Prefix": "CommentModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.obj
            };

            CommentModalCtrl.ePage.Masters.Close = Close;
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
