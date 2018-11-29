(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateCreationModal", EmailTemplateCreationModal);

    EmailTemplateCreationModal.$inject = ["$uibModal", "$templateCache"];

    function EmailTemplateCreationModal($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="EmailTemplateCreationModalCtrl.ePage.Masters.Close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Email Template</strong>
            </h5>
        </div>
        <div class="modal-body" id="modal-body">
            <email-template-creation input="input"></email-template-creation>
        </div>`;
        $templateCache.put("EmailTemplateCreationModal.html", _template);

        var exports = {
            restrict: "EA",
            scope: {
                input: "="
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
                    windowClass: "right email-template-creation",
                    scope: scope,
                    templateUrl: "EmailTemplateCreationModal.html",
                    controller: 'EmailTemplateCreationModalController as EmailTemplateCreationModalCtrl',
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
