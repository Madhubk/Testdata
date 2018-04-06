(function () {
    "use strict";

    angular
        .module("Application")
        .directive("documentModal", DocumentModal);

    DocumentModal.$inject = ["$uibModal"];

    function DocumentModal($uibModal) {
        var exports = {
            restrict: "EA",
            scope: {
                input: "=",
                mode: "=",
                type: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: true,
                    windowClass: "right document",
                    scope: scope,
                    templateUrl: "app/shared/standard-menu-directives/document/document-modal/document-modal.html",
                    controller: 'DocumentModalController as DocumentModalCtrl',
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                input: scope.input
                            };
                            return exports;
                        }
                    }
                }).result.then(function (response) {
                    console.log(response);
                }, function () {
                    console.log("Cancelled");
                });
            }
        }
    }
})();
