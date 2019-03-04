(function () {
    "use strict";

    angular
        .module("Application")
        .directive("event", Event);

        Event.$inject = ["$templateCache"];

    function Event($templateCache) {
        let _template = `<div class="clearfix">
                                            <div class="clearfix p-20 text-center" data-ng-if="!EventCtrl.ePage.Masters.Event.ListSource">
                                                <i class="fa fa-spin fa-spinner font-120"></i>
                                            </div>
                                            <div class="clearfix text-center p-20" data-ng-if="EventCtrl.ePage.Masters.Event.ListSource && EventCtrl.ePage.Masters.Event.ListSource.length == 0 ">
                                                <i>No Records...!</i>
                                            </div>
                                            <div class="clearfix p-10" data-ng-if="EventCtrl.ePage.Masters.Event.ListSource && EventCtrl.ePage.Masters.Event.ListSource.length > 0 ">
                                                <ul class="event mt-10">
                                                    <li class="event-inverted" data-ng-repeat="x in EventCtrl.ePage.Masters.Event.ListSource">
                                                        <div class="clearfix text-center">
                                                            <span class="event-date">{{x.EventDateTime | date:'dd-MMM-yyyy'}}</span>
                                                        </div>
                                                        <div class="event-panel">
                                                            <div class="event-header" data-ng-class="x.EventCSS.bgColor">{{x.EventName || '-'}}</div>
                                                            <div class="event-body">
                                                                <sm-event-dynamic-directive event-obj="x"></sm-event-dynamic-directive>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>`;
        $templateCache.put("Event.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "Event.html",
            controller: 'EventController',
            controllerAs: 'EventCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("EventController", EventController);

    EventController.$inject = ["apiService", "authService", "helperService", "appConfig"];

    function EventController(apiService, authService, helperService, appConfig) {
        /* jshint validthis: true */
        let EventCtrl = this;

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
            let _filter = {
                EntityRefKey: EventCtrl.ePage.Entities.EntityRefKey,
                ParentEntityRefKey: EventCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntityRefKey: EventCtrl.ePage.Entities.AdditionalEntityRefKey
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response;
                    _response.map(value => value.RelatedDetails = JSON.parse(value.RelatedDetails));
                    EventCtrl.ePage.Masters.Event.ListSource = _response;
                } else {
                    EventCtrl.ePage.Masters.Event.ListSource = [];
                }
            });
        }

        Init();
    }
})();
