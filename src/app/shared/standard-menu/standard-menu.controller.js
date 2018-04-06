(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StandardMenuController", StandardMenuController);

    StandardMenuController.$inject = ["$injector", "$state", "$scope", "$uibModal", "appConfig", "helperService", "toastr"];

    function StandardMenuController($injector, $state, $scope, $uibModal, appConfig, helperService, toastr) {
        /* jshint validthis: true */
        var StandardMenuCtrl = this;

        function Init() {
            var _entity = StandardMenuCtrl.input[StandardMenuCtrl.input.label].ePage.Entities;
            StandardMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "StandardMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": _entity
            };

            StandardMenuCtrl.ePage.Masters.MenuList = appConfig.Entities.standardMenuConfigList.MenuList;

            StandardMenuCtrl.ePage.Masters.state = $state;

            ConfigureStandardMenuObject();
        }

        function ConfigureStandardMenuObject() {
            StandardMenuCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": StandardMenuCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": StandardMenuCtrl.input.label,
                "EntitySource": appConfig.Entities.standardMenuConfigList[StandardMenuCtrl.entityName].entitySource,
                "Communication": null,
                "Config": appConfig.Entities.standardMenuConfigList[StandardMenuCtrl.entityName].StandardMenuConfig,
                "Entity": appConfig.Entities.standardMenuConfigList[StandardMenuCtrl.entityName].entity,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": StandardMenuCtrl.ePage.Entities.Header.Data
            };
        }

        Init();
    }
})();
