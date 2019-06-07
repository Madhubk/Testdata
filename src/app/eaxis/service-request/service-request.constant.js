(function () {
    'use strict';

    var SERVICE_REQUEST_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'EAserviceRequest',
            files: [
                'app/eaxis/service-request/service-request.css',
                'app/eaxis/service-request/service-request.controller.js',
                'app/mdm/warehouse/customize-table/customize-table.css',
                'app/mdm/warehouse/customize-table/customize-table.directive.js',
            ]
        }, {
            name: 'serviceRequestDashboard',
            files: [
                'app/eaxis/service-request/dashboard/dashboard.css',
                'app/eaxis/service-request/dashboard/dashboard.controller.js',
            ]
        },        
        // --------------------- Downtime Request -----------------------
        // region
        {
            name: 'downtimeRequest',
            files: [
                'app/eaxis/service-request/downtime-request/downtime-request.css',
                'app/eaxis/service-request/downtime-request/downtime-request.controller.js',
                'app/eaxis/service-request/downtime-request/downtime-request-config.factory.js'
            ]
        }, {
            name: 'downtimeRequestMenu',
            files: [
                'app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.css',
                'app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.controller.js',
                'app/eaxis/service-request/downtime-request/downtime-request-menu/downtime-request-menu.directive.js'
            ]
        }, {
            name: 'downtimeRequestGeneral',
            files: [
                'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.css',
                'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.controller.js',
                'app/eaxis/service-request/downtime-request/downtime-request-general/downtime-request-general.directive.js'
            ]
        },
        // endregion        
        ]
    };

    angular
        .module("Application")
        .constant("SERVICE_REQUEST_CONSTANT", SERVICE_REQUEST_CONSTANT);
})();
