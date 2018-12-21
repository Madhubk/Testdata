(function () {
    'use strict';

    var EA_ADMIN_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'eAxisAdmin',
            files: [
                'app/eaxis/admin/admin.css',
                'app/eaxis/admin/admin.controller.js'
            ]
        }, {
            name: 'EAAdminHome',
            files: [
                'app/eaxis/admin/home/home.css',
                'app/eaxis/admin/home/home.controller.js'
            ]
        }]
    };

    angular
        .module("Application")
        .constant("EA_ADMIN_CONSTANT", EA_ADMIN_CONSTANT);
})();
