(function () {
    "use strict";

    angular
        .module("Application")
        .factory("languageService", LanguageService)
        .service('LocaleService', LocaleService)


    LanguageService.$inject = ["$q", "apiService", "authService", "helperService", "appConfig", "$timeout"];

    function LanguageService($q, apiService, authService, helperService, appConfig, $timeout) {
        return function (options) {
            var deferred = $q.defer();
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "EntitySource": "LANGUAGE",
                "Key": options.key
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };
            var _languageList = [];
            var _langValue = {};

            if (authService.getUserInfo().AppPK && authService.getUserInfo().AppCode == "EA") {
                apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        _languageList = response.data.Response;
                        if (_languageList.length > 0) {
                            _langValue = JSON.parse(_languageList[0].Value);
                        } else {
                            _langValue = {};
                        }
                        $timeout(function () {
                            deferred.resolve(_langValue);
                        }, 500);
                    } else {
                        deferred.resolve(_langValue);
                    }
                });
            } else {
                deferred.resolve(_langValue);
            }
            return deferred.promise;
        };
    }

    function LocaleService($translate, $rootScope, tmhDynamicLocale) {
        // STORING CURRENT LOCALE
        var currentLocale = $translate.proposedLanguage();
        var setLocale = function (locale) {
            currentLocale = locale;

            $translate.use(locale);
        };
        // EVENTS
        $rootScope.$on('$translateChangeSuccess', function (event, data) {
            document.documentElement.setAttribute('lang', data.language);
        });

        return {
            setLocaleByDisplayName: function (localeDisplayName) {
                setLocale(localeDisplayName);
            }
        };

    }

})();
