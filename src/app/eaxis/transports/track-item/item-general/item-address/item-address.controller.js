(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ItemAddressController", ItemAddressController);

    ItemAddressController.$inject = ["$rootScope", "$uibModalInstance", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "itemConfig", "helperService", "toastr", "$filter", "$injector", "myData"];

    function ItemAddressController($rootScope, $uibModalInstance, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, itemConfig, helperService, toastr, $filter, $injector, myData) {

        var ItemAddressCtrl = this;

        function Init() {
            var currentAddress = myData;

            ItemAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Item Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAddress
            };
            ItemAddressCtrl.ePage.Masters.Cancel = Cancel;
            ItemAddressCtrl.ePage.Masters.AddressChosen = AddressChosen;

            GetCurrentItemAddress();
        }
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        //To get oad_addessfk value
        function GetCurrentItemAddress() {
            if (ItemAddressCtrl.ePage.Entities.ClientType == "Sender") {
                angular.forEach(ItemAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                    if (value.AddressType == 'SND') {
                        ItemAddressCtrl.ePage.Masters.CurrentItemAddress = value;
                    }
                });
            } else if (ItemAddressCtrl.ePage.Entities.ClientType == "Receiver") {
                angular.forEach(ItemAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                    if (value.AddressType == 'REC') {
                        ItemAddressCtrl.ePage.Masters.CurrentItemAddress = value;
                    }
                });
            }

        }

        //To bind the current chosen address in jobaddress
        function AddressChosen(item) {
            if (ItemAddressCtrl.ePage.Entities.ClientType == "Sender") {
                angular.forEach(ItemAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                    if (value.AddressType == 'SND') {
                        value.ORG_FK = item.ORG_FK;
                        value.OAD_Address_FK = item.PK;
                        value.Address1 = item.Address1;
                        value.Address2 = item.Address2;
                        value.State = item.State;
                        value.PostCode = item.PostCode;
                        value.City = item.City;
                        value.Email = item.Email;
                        value.Mobile = item.Mobile;
                        value.Phone = item.Phone;
                        value.RN_NKCountryCode = item.CountryCode;
                        value.Fax = item.Fax;

                        //Binding in current Item values
                        ItemAddressCtrl.ePage.Masters.CurrentItemAddress.OAD_Address_FK = item.PK;

                    }
                });
            } else if (ItemAddressCtrl.ePage.Entities.ClientType == "Receiver") {
                angular.forEach(ItemAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                    if (value.AddressType == 'REC') {
                        value.ORG_FK = item.ORG_FK;
                        value.OAD_Address_FK = item.PK;
                        value.Address1 = item.Address1;
                        value.Address2 = item.Address2;
                        value.State = item.State;
                        value.PostCode = item.PostCode;
                        value.City = item.City;
                        value.Email = item.Email;
                        value.Mobile = item.Mobile;
                        value.Phone = item.Phone;
                        value.RN_NKCountryCode = item.CountryCode;
                        value.Fax = item.Fax;

                        //Binding in current Item values
                        ItemAddressCtrl.ePage.Masters.CurrentItemAddress.OAD_Address_FK = item.PK;
                    }
                });
            }
            Cancel();
        }
        Init();
    }

})();