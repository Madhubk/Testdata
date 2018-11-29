(function () {
    "use strict";

    angular
    .module("Application")
    .controller("ManifestAddressController", ManifestAddressController);

    ManifestAddressController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "toastr", "$filter","$injector","myData"];
    
    function ManifestAddressController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, toastr, $filter,$injector,myData) {

        var ManifestAddressCtrl = this;

        function Init() {
            var currentAddress = myData;

            ManifestAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAddress
            };
            ManifestAddressCtrl.ePage.Masters.Cancel = Cancel;
            ManifestAddressCtrl.ePage.Masters.AddressChosen = AddressChosen;

            GetCurrentManifestAddress();
        }
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        //To get oad_addessfk value
        function GetCurrentManifestAddress(){
            if (ManifestAddressCtrl.ePage.Entities.ClientType == "Sender") {
                angular.forEach(ManifestAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                    if (value.AddressType == 'SND') {
                        ManifestAddressCtrl.ePage.Masters.CurrentManifestAddress = value;
                    }
                });
            } else if (ManifestAddressCtrl.ePage.Entities.ClientType == "Receiver") {
                angular.forEach(ManifestAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                    if (value.AddressType == 'REC') {
                        ManifestAddressCtrl.ePage.Masters.CurrentManifestAddress = value;
                    }
                });
            }
        }

        //To bind the current chosen address in jobaddress
        function AddressChosen(item){
            if (ManifestAddressCtrl.ePage.Entities.ClientType == "Sender") {
                angular.forEach(ManifestAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
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
                        ManifestAddressCtrl.ePage.Masters.CurrentManifestAddress.OAD_Address_FK = item.PK;

                    }
                });
            } else if (ManifestAddressCtrl.ePage.Entities.ClientType == "Receiver") {
                angular.forEach(ManifestAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
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
                        ManifestAddressCtrl.ePage.Masters.CurrentManifestAddress.OAD_Address_FK = item.PK;
                    }
                });
            }
            Cancel();
        }

        Init();
    }

})();