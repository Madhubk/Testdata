(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentAddressController", ConsignmentAddressController);

    ConsignmentAddressController.$inject = ["$rootScope", "$uibModalInstance", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "manifestConfig", "helperService", "toastr", "$filter", "$injector", "myData"];

    function ConsignmentAddressController($rootScope, $uibModalInstance, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, manifestConfig, helperService, toastr, $filter, $injector, myData) {

        var ConsignmentAddressCtrl = this;

        function Init() {
            var currentAddress = myData;

            ConsignmentAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAddress
            };
            ConsignmentAddressCtrl.ePage.Masters.Cancel = Cancel;
            ConsignmentAddressCtrl.ePage.Masters.AddressChosen = AddressChosen;

            GetCurrentConsignmentAddress();
        }
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        //To get oad_addessfk value
        function GetCurrentConsignmentAddress() {
            angular.forEach(ConsignmentAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
                if (value.AddressType == 'SND') {
                    ConsignmentAddressCtrl.ePage.Masters.CurrentConsignmentAddress = value;
                } else if (value.AddressType == 'REC') {
                    ConsignmentAddressCtrl.ePage.Masters.CurrentConsignmentAddress = value;
                }
            });
        }
        //To bind the current chosen address in jobaddress
        function AddressChosen(item) {
            angular.forEach(ConsignmentAddressCtrl.ePage.Entities.JobAddress, function (value, key) {
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
                    ConsignmentAddressCtrl.ePage.Masters.CurrentConsignmentAddress.OAD_Address_FK = item.PK;

                }
                else if (value.AddressType == 'REC') {
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
                    ConsignmentAddressCtrl.ePage.Masters.CurrentConsignmentAddress.OAD_Address_FK = item.PK;
                }
            });
            Cancel();
        }
        Init();
    }
})();