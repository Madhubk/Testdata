(function () {
    'use strict';

    var EA_LAB_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'EALab',
            files: [
                'app/eaxis/lab/lab.css',
                'app/eaxis/lab/lab.controller.js'
            ]
        }, {
            name: 'eAxisDynamicPageList',
            files: [
                'app/eaxis/lab/dynamic-page-list/dynamic-page-list.css',
                'app/eaxis/lab/dynamic-page-list/dynamic-page-list.controller.js'
            ]
        }, {
            name: 'eAxisHtmlGeneration',
            files: [
                'lib/html-generation/google-api.js',
                'app/eaxis/lab/html-generation/html-generation.controller.js',
                'app/eaxis/lab/html-generation/html-generation-config.factory.js'
            ]
        }, {
            serie: true,
            name: 'eAxisGraphicalInterface',
            files: [
                'lib/graphical-interface/go.js',
                'lib/graphical-interface/DrawCommandHandler.js',
                'lib/graphical-interface/BPMNClasses.js',
                'app/eaxis/lab/graphical-interface/graphical-interface.css',
                'app/eaxis/lab/graphical-interface/graphical-interface.controller.js',
                'app/eaxis/lab/graphical-interface/graphical-interface-config.factory.js'
            ]
        }, {
            name: 'eAxisExcelTemplate',
            files: [
                'app/eaxis/lab/excel-template/excel-template.css',
                'app/eaxis/lab/excel-template/excel-template.controller.js',
                'app/eaxis/lab/excel-template/excel-template-config.factory.js'
            ]
        }, {
            name: 'eAxisExcelTemplateMenu',
            files: [
                'app/eaxis/lab/excel-template/excel-template-menu/excel-template-menu.css',
                'app/eaxis/lab/excel-template/excel-template-menu/excel-template-menu.controller.js',
                'app/eaxis/lab/excel-template/excel-template-menu/excel-template-menu.directive.js'
            ]
        }, {
            name: 'eAxisQueueLog',
            files: [
                'app/eaxis/lab/queue-log/queue-log.css',
                'app/eaxis/lab/queue-log/queue-log.controller.js',
                'app/eaxis/lab/queue-log/queue-log-config.factory.js'
            ]
        }, {
            name: 'eAxisQueueLogMenu',
            files: [
                'app/eaxis/lab/queue-log/queue-log-menu/queue-log-menu.css',
                'app/eaxis/lab/queue-log/queue-log-menu/queue-log-menu.controller.js',
                'app/eaxis/lab/queue-log/queue-log-menu/queue-log-menu.directive.js'
            ]
        },{
            name: 'eAxisQueueLogSingleRecordView',
            files: [
                'app/eaxis/lab/queue-log/queue-log-menu/queue-log-single-record-view/queue-log-single-record-view.css',
                'app/eaxis/lab/queue-log/queue-log-menu/queue-log-single-record-view/queue-log-single-record-view.controller.js'
            ]
        }]
    };

    angular
        .module("Application")
        .constant("EA_LAB_CONSTANT", EA_LAB_CONSTANT);
})();
