(function () {
    "use strict";

    angular
        .module("Application")
        .directive("iconColorList", IconColorList);

    IconColorList.$inject = ["$uibModal"];

    function IconColorList($uibModal) {
        var exports = {
            restrict: "EA",
            scope: {
                type: "@",
                selectedItem: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", OpenModal);

            function OpenModal() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    keyboard: true,
                    windowClass: "icon-color-list-modal left " + scope.type,
                    scope: scope,
                    templateUrl: "app/shared/icon-color-list/" + scope.type + "-list.html",
                    controller: 'IconColorListModalController',
                    controllerAs: "IconColorListModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "type": scope.type
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        if (response) {
                            scope.selectedItem({
                                $item: response
                            });
                        }
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            }
        }
    }
})();
