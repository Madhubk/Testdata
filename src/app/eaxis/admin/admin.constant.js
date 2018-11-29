(function () {
    'use strict';

    var EA_ADMIN_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'eAxisAdmin',
            files: [
                'app/trust-center/shared/trust-center.css',
                'app/trust-center/shared/trust-center-config.factory.js',
                'app/eaxis/admin/admin.css',
                'app/eaxis/admin/admin.controller.js'
            ]
        }, {
            name: 'EAAdminHome',
            files: [
                'app/eaxis/admin/home/home.css',
                'app/eaxis/admin/home/home.controller.js'
            ]
        }, {
            name: 'EAUser',
            files: [
                'app/trust-center/user/user.css',
                'app/trust-center/user/user.controller.js'
            ]
        }, {
            name: 'EAUserRoleAppTenant',
            files: [
                'app/trust-center/mapping/user-role-app-tenant/user-role-app-tenant.css',
                'app/trust-center/mapping/user-role-app-tenant/user-role-app-tenant.controller.js'
            ]
        }, {
            name: 'EAMapping',
            files: [
                'app/trust-center/mapping/mapping-config.factory.js',
                'app/trust-center/mapping/mapping-vertical/mapping-vertical.css',
                'app/trust-center/mapping/mapping-vertical/mapping-vertical.controller.js'
            ]
        }, {
            name: 'EAUserAccess',
            files: [
                'app/trust-center/user-list/user-list.css',
                'app/trust-center/user-list/user-list.controller.js'
            ]
        }]
    };

    angular
        .module("Application")
        .constant("EA_ADMIN_CONSTANT", EA_ADMIN_CONSTANT);
})();
