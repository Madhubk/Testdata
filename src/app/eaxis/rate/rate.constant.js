(function () {
    'use strict';

    var RATE_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'EArate',
            files: [
                'app/eaxis/rate/rate.css',
                'app/eaxis/rate/rate.controller.js',
                'app/eaxis/rate/rate-config.factory.js',
            ]
        },
        // -------------------------------------RateHeader---------------------------------------------
        //#region 
        {
            name: 'rateHeader',
            files: [
                'app/eaxis/rate/rate-header/rate-header.css',
                'app/eaxis/rate/rate-header/rate-header.controller.js',
                'app/eaxis/rate/rate-header/rate-header-config.factory.js',
            ]
        },
        {
            name: 'rateHeaderMenu',
            files: [
                'app/eaxis/rate/rate-header/rate-header-menu/rate-header-menu.css',
                'app/eaxis/rate/rate-header/rate-header-menu/rate-header-menu.controller.js',
                'app/eaxis/rate/rate-header/rate-header-menu/rate-header-menu.directive.js',
            ]
        },
        {
            name: 'rateHeaderGeneral',
            files: [
                'app/eaxis/rate/rate-header/rate-header-general/rate-header-general.css',
                'app/eaxis/rate/rate-header/rate-header-general/rate-header-general.controller.js',
                'app/eaxis/rate/rate-header/rate-header-general/rate-header-general.directive.js',
            ]
        },

        //#endregion
        ]
    };

    angular
        .module("Application")
        .constant("RATE_CONSTANT", RATE_CONSTANT);
})();
