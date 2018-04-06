(function () {
    'use strict';

    var TEAM_SUPPORT_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'TeamSupport',
            files: [
                'app/team-support/shared/team-support.css',
                'app/team-support/shared/team-support-config.factory.js',
                'app/team-support/shared/team-support.controller.js',
            ]
        }, {
            name: 'TSHome',
            files: [
                'app/team-support/home/home.css',
                'app/team-support/home/home.controller.js'
            ]
        }, {
            name: 'TSSprint',
            files: [
                'app/team-support/sprint/sprint.css',
                'app/team-support/sprint/sprint.controller.js'
            ]
        }, {
            name: 'TSTimeSheet',
            files: [
                'app/team-support/time-sheet/time-sheet.css',
                'app/team-support/time-sheet/time-sheet.controller.js'
            ]
        }, {
            name: 'TSBacklog',
            files: [
                'app/team-support/backlog/backlog.css',
                'app/team-support/backlog/backlog.controller.js',
                'lib/jquery/mansory.js'
            ]
        }]
    };

    angular
        .module("Application")
        .constant("TEAM_SUPPORT_CONSTANT", TEAM_SUPPORT_CONSTANT);
})();
