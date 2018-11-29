(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EventController", EventController);

    EventController.$inject = ["apiService", "authService", "helperService", "appConfig"];

    function EventController(apiService, authService, helperService, appConfig) {
        /* jshint validthis: true */
        var EventCtrl = this;

        function Init() {
            EventCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": EventCtrl.input
            };

            if (EventCtrl.ePage.Entities) {
                InitEvent();
            }
        }

        function InitEvent() {
            EventCtrl.ePage.Masters.Event = {};
            GetEventDetails();
        }

        function GetEventDetails() {
            EventCtrl.ePage.Masters.Event.ListSource = undefined;
            var _filter = {
                "EntitySource": EventCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": EventCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": EventCtrl.ePage.Entities.EntityRefCode
            };

            if (EventCtrl.ePage.Entities.ParentEntityRefKey) {
                _filter.ParentEntityRefKey = EventCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = EventCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = EventCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (EventCtrl.ePage.Entities.AdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = EventCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = EventCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = EventCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            value.RelatedDetails = JSON.parse(value.RelatedDetails);
                        });
                    }
                    EventCtrl.ePage.Masters.Event.ListSource = response.data.Response;
                } else {
                    EventCtrl.ePage.Masters.Event.ListSource = [];
                }
            });
        }

        Init();
    }
})();
