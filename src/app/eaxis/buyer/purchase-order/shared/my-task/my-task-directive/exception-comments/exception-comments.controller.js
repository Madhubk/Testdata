(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptionCommentsDirectiveController", ExceptionCommentsDirectiveController);

    ExceptionCommentsDirectiveController.$inject = ["helperService"];

    function ExceptionCommentsDirectiveController(helperService) {
        var ExceptionCommentsDirectiveCtrl = this;

        function Init() {
            ExceptionCommentsDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Comments",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitExceptionComments();
        }

        function InitExceptionComments() {
            ExceptionCommentsDirectiveCtrl.ePage.Masters.CommentsList = ExceptionCommentsDirectiveCtrl.commentsList;
        }

        Init();
    }
})();