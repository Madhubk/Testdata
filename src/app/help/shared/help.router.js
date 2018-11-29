(function () {
    'use strict';

    angular
        .module("Application")
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', "HELP_CONSTANT"];

    function Config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, HELP_CONSTANT) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            serie: false,
            modules: HELP_CONSTANT.ocLazyLoadModules
        });

        $stateProvider
            .state('help', {
                url: '/help',
                abstract: true,
                templateUrl: 'app/help/shared/help.html',
                controller: "HelpController as HelpCtrl",
                ncyBreadcrumb: {
                    label: 'Help'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["changePassword", "Help"]);
                    }]
                }
            })
            .state('help.TopicCreation', {
                url: '/topic-creation',
                templateUrl: 'app/help/topic-creation/topic-creation.html',
                controller: "HelpTopicCreationController as HelpTopicCreationCtrl",
                ncyBreadcrumb: {
                    label: 'Topic Creation'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["DNDUITress", "confirmation", "HelpTopicCreation"]);
                    }]
                }
            })
            .state('help.ContentCreation', {
                url: '/content-creation',
                templateUrl: 'app/help/content-creation/content-creation.html',
                controller: "HelpContentCreationController as HelpContentCreationCtrl",
                ncyBreadcrumb: {
                    label: 'Content Creation'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["confirmation", "Summernote", "CustomFileUpload", "HelpContentCreation"]);
                    }]
                }
            })
            .state('help.Topic', {
                url: '/topic',
                templateUrl: 'app/help/topic/topic.html',
                controller: "HelpTopicController as HelpTopicCtrl",
                ncyBreadcrumb: {
                    label: 'Help Topic'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["HelpTopic"]);
                    }]
                }
            })
            .state('help.Content', {
                url: '/content',
                templateUrl: 'app/help/content/content.html',
                controller: "HelpContentController as HelpContentCtrl",
                ncyBreadcrumb: {
                    label: 'Help Content'
                },
                resolve: {
                    CheckAccess: ["$q", "pageAccessService", function ($q, pageAccessService) {
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    }],
                    LoadState: ["$ocLazyLoad", "CheckAccess", function ($ocLazyLoad, CheckAccess) {
                        return $ocLazyLoad.load(["HelpContent"]);
                    }]
                }
            });
    }
})();
