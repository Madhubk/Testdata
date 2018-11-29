(function () {
    "use strict";

    angular
        .module("Application")
        .directive("excelTemplateMenu", ExcelTemplateMenu);

    ExcelTemplateMenu.$inject = [];

    function ExcelTemplateMenu() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/lab/excel-template/excel-template-menu/excel-template-menu.html",
            link: Link,
            controller: "ExcelTemplateMenuController",
            controllerAs: "ExcelTemplateMenuCtrl",
            scope: {

                currentExcelTemplate: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();