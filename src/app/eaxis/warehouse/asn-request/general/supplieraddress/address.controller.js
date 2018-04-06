(function () {
    "use strict";

    angular
    .module("Application")
    .controller("SupplierAddressController", SupplierAddressController);

    SupplierAddressController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "asnrequestConfig", "helperService", "toastr", "$filter","$injector","myData"];
    
    function SupplierAddressController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, asnrequestConfig, helperService, toastr, $filter,$injector,myData) {

        var SupplierAddressCtrl = this;

        function Init() {
            var currentAddress = myData;

            SupplierAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAddress
            };
            SupplierAddressCtrl.ePage.Masters.Cancel = Cancel;
            SupplierAddressCtrl.ePage.Masters.AddressChosen = AddressChosen;

            GetCurrentSupplierAddress();
        }
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        //To get oad_addessfk value
        function GetCurrentSupplierAddress(){
            angular.forEach(SupplierAddressCtrl.ePage.Entities.UIJobAddress,function(value,key){
                if(value.AddressType='SUD'){
                    SupplierAddressCtrl.ePage.Masters.CurrentSupplierAddress = value;
                }
            });
        }

        //To bind the current chosen address in jobaddress
        function AddressChosen(item){
            angular.forEach(SupplierAddressCtrl.ePage.Entities.UIJobAddress,function(value,key){
                if(value.AddressType='SUD'){
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

                    //Binding in current supplier values
                    SupplierAddressCtrl.ePage.Masters.CurrentSupplierAddress.OAD_Address_FK = item.PK;

                }
            })
            Cancel();
        }

        Init();
    }

})();