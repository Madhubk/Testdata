(function () {
    'use strict';

    var HELP_CONSTANT = {
        ocLazyLoadModules: [{
            name: 'Help',
            files: [
                'app/help/shared/help.css',
                'app/help/shared/help-config.factory.js',
                'app/help/shared/help.controller.js'
            ]
        }, {
            name: 'HelpTopicCreation',
            files: [
                'app/help/topic-creation/topic-creation.css',
                'app/help/topic-creation/topic-creation.controller.js'
            ]
        }, {
            name: 'HelpContentCreation',
            files: [
                'app/help/content-creation/content-creation.css',
                'app/help/content-creation/content-creation.controller.js'
            ]
        }, {
            name: 'HelpTopic',
            files: [
                'app/help/topic/topic.css',
                'app/help/topic/topic.controller.js'
            ]
        }, {
            name: 'HelpContent',
            files: [
                'app/help/content/content.css',
                'app/help/content/content.controller.js'
            ]
        }]
    };

    angular.module("Application")
        .constant("HELP_CONSTANT", HELP_CONSTANT);
})();
