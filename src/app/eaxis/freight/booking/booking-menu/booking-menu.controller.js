(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingMenuController", BookingMenuController);

    BookingMenuController.$inject = ["$location", "BookingConfig", "helperService", "appConfig"];

    function BookingMenuController($location, BookingConfig, helperService, appConfig) {
        var BookingMenuCtrl = this;
        var url = $location.path();

        function Init() {
            var currentBooking = BookingMenuCtrl.currentBooking[BookingMenuCtrl.currentBooking.label].ePage.Entities;
            BookingMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "BookingMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking
            };
            BookingMenuCtrl.ePage.Masters.BookingMenu = {};

            // Menu list from configuration
            BookingMenuCtrl.ePage.Masters.BookingMenu.ListSource = BookingMenuCtrl.ePage.Entities.Header.Meta.MenuList;


            // Standard Menu Configuration and Data
            BookingMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.Booking;
            BookingMenuCtrl.ePage.Masters.StandardMenuInput.obj = BookingMenuCtrl.currentBooking;
            
        }

        Init();
    }
})();
