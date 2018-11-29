(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightController", FreightController);

    FreightController.$inject = [];

    function FreightController() {
        /* jshint validthis: true */
        var FreightCtrl = this;

        function Init() {}

        Init();
    }
})();
