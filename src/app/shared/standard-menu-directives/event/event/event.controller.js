(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EventController", EventController);

    EventController.$inject = ["authService", "apiService", "helperService", "appConfig"];

    function EventController(authService, apiService, helperService, appConfig) {
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
            EventCtrl.ePage.Masters.Spinner = false;

            GetEventDetails();
        }

        function GetEventDetails() {
            EventCtrl.ePage.Masters.Spinner = true;
            var _filter = {
                // "ParentEntityRefKey": EventCtrl.ePage.Entities.EntityRefKey
                "EntitySource": EventCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": EventCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": EventCtrl.ePage.Entities.EntityRefCode
            };

            if (EventCtrl.ePage.Entities.IsParentEntityRefKey) {
                _filter.ParentEntityRefKey = EventCtrl.ePage.Entities.ParentEntityRefKey;
                _filter.ParentEntitySource = EventCtrl.ePage.Entities.ParentEntitySource;
                _filter.ParentEntityRefCode = EventCtrl.ePage.Entities.ParentEntityRefCode;
            }

            if (EventCtrl.ePage.Entities.IsAdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = EventCtrl.ePage.Entities.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = EventCtrl.ePage.Entities.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = EventCtrl.ePage.Entities.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    EventCtrl.ePage.Masters.Spinner = false;
                    response.data.Response.map(function (val, key) {
                        val.RelatedDetails = JSON.parse(val.RelatedDetails);
                    });
                    EventCtrl.ePage.Masters.Event.ListSource = response.data.Response;
                } else {
                    EventCtrl.ePage.Masters.Event.ListSource = [];
                    EventCtrl.ePage.Masters.Spinner = false;
                }
            });
        }

        Init();
    }
})();
