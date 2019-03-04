(function () {
    "use strict";

    angular
        .module("Application")
        .directive("parties", Parties);

    function Parties() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/parties/parties/parties.html",
            controller: 'PartiesController',
            controllerAs: 'PartiesCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("PartiesController", PartiesController);

    PartiesController.$inject = ["apiService", "helperService", "appConfig", "toastr"];

    function PartiesController(apiService, helperService, appConfig, toastr) {
        /* jshint validthis: true */
        let PartiesCtrl = this;

        function Init() {
            PartiesCtrl.ePage = {
                "Title": "",
                "Prefix": "Parties",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": PartiesCtrl.input
            };

            if (PartiesCtrl.ePage.Entities) {
                InitParties();
            }
        }

        function InitParties() {
            PartiesCtrl.ePage.Masters.Parties = {};

            PartiesCtrl.ePage.Masters.Parties.Refresh = Refresh;

            PartiesCtrl.ePage.Masters.Parties.AddBtnText = "Add";
            PartiesCtrl.ePage.Masters.Parties.IsDisableAddBtn = false;

            GetPartiesList();
        }

        function GetPartiesList() {
            PartiesCtrl.ePage.Masters.Parties.ListSource = undefined;
            let _filter = {
                EntityRefKey: PartiesCtrl.ePage.Entities.EntityRefKey,
                ParentEntityRefKey: PartiesCtrl.ePage.Entities.ParentEntityRefKey,
                AdditionalEntityRefKey: PartiesCtrl.ePage.Entities.AdditionalEntityRefKey
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataSharedEntity.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataSharedEntity.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    PartiesCtrl.ePage.Masters.Parties.ListSource = response.data.Response;
                } else {
                    PartiesCtrl.ePage.Masters.Parties.ListSource = [];
                }
            });
        }

        function Refresh() {
            GetPartiesList();
        }

        Init();
    }
})();
