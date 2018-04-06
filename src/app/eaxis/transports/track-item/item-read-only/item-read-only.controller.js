(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemReadOnlyController", ItemReadOnlyController);

    ItemReadOnlyController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "itemConfig", "helperService", "$window", "$uibModal"];

    function ItemReadOnlyController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, itemConfig, helperService, $window, $uibModal) {

        var ItemReadOnlyCtrl = this;

        function Init() {

            var currentItem = ItemReadOnlyCtrl.currentItem[ItemReadOnlyCtrl.currentItem.label].ePage.Entities;

            ItemReadOnlyCtrl.ePage = {
                "Title": "",
                "Prefix": "Item_ReadOnly",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentItem,
            };
            ItemReadOnlyCtrl.ePage.Masters.Empty = "-";

            ItemReadOnlyCtrl.ePage.Masters.Config = itemConfig;

            ItemReadOnlyCtrl.ePage.Masters.DropDownMasterList = {};

            ItemReadOnlyCtrl.ePage.Masters.IsDisable = true;

            // DatePicker
            ItemReadOnlyCtrl.ePage.Masters.DatePicker = {};
            ItemReadOnlyCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ItemReadOnlyCtrl.ePage.Masters.DatePicker.isOpen = [];
            ItemReadOnlyCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            generalOperation();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ItemReadOnlyCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function generalOperation() {
            // Sender
            if (ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.Code == null)
                ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.Code = "";
            if (ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.FullName == null)
                ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.FullName = "";
            ItemReadOnlyCtrl.ePage.Masters.Sender = ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.Code + ' - ' + ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgSender.FullName;
            if (ItemReadOnlyCtrl.ePage.Masters.Sender == " - ")
                ItemReadOnlyCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.Code == null)
                ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = "";
            if (ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName == null)
                ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = "";
            ItemReadOnlyCtrl.ePage.Masters.Receiver = ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ItemReadOnlyCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
            if (ItemReadOnlyCtrl.ePage.Masters.Receiver == " - ")
                ItemReadOnlyCtrl.ePage.Masters.Receiver = "";
        }

        function setSelectedRow(index) {
            ItemReadOnlyCtrl.ePage.Masters.selectedRow = index;
        }

        Init();
    }

})();