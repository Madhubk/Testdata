(function () {
    "use strict";

    angular
        .module("Application")
        .directive("addressWrapper", AddressWrapper);

    function AddressWrapper() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/shared/address-wrapper/address-wrapper.html",
            controller: "addressWrapperController",
            controllerAs: "addressWrapperCtrl",
            scope: {
                obj: "=",
                type: "@",
                listSource: "@",
                selected: "=",
                onAddressChange: "&",
                onAddressEdit: "&"
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("addressWrapperController", addressWrapperController);

    addressWrapperController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "$uibModal", "$window", "appConfig", "$filter"];

    function addressWrapperController($rootScope, $scope, state, $timeout, $location, $q, APP_CONSTANT, authService, apiService, helperService, toastr, $uibModal, $window, appConfig, $filter) {
        var addressWrapperCtrl = this;

        function Init() {

            addressWrapperCtrl.ePage = {
                "Title": "",
                "Prefix": "Address_Wrapper",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            addressWrapperCtrl.ePage.Masters.OnAddressChange = OnAddressChange
            addressWrapperCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit
        }

        function OnAddressChange($item) {
            addressWrapperCtrl.onAddressChange({
                $item: $item
            }, addressWrapperCtrl.type, addressWrapperCtrl.listSource);
        }

        function OnAddressEdit($item) {

            if ($item.PK === addressWrapperCtrl.selected) {
                addressWrapperCtrl.onAddressEdit({
                    $item: $item
                }, addressWrapperCtrl.type, addressWrapperCtrl.listSource);
            } else {
                toastr.warning('Selected Address Only Can be Edited..')
            }
        }


        Init();
    }
})();
