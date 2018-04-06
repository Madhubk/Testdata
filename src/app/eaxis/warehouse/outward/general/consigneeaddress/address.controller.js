(function () {
    "use strict";

    angular
    .module("Application")
    .controller("ConsigneeAddressController", ConsigneeAddressController);

    ConsigneeAddressController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "outwardConfig", "helperService", "toastr", "$filter","$injector","myData"];
    
    function ConsigneeAddressController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, outwardConfig, helperService, toastr, $filter,$injector,myData) {

        var ConsigneeAddressCtrl = this;

        function Init() {
            var currentAddress = myData;

            ConsigneeAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignee Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAddress
            };
            ConsigneeAddressCtrl.ePage.Masters.Cancel = Cancel;
            ConsigneeAddressCtrl.ePage.Masters.AddressChosen = AddressChosen;

            GetCurrentConsigneeAddress();
        }
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        //To get oad_addessfk value
        function GetCurrentConsigneeAddress(){
            angular.forEach(ConsigneeAddressCtrl.ePage.Entities.UIJobAddress,function(value,key){
                if(value.AddressType='CED'){
                    ConsigneeAddressCtrl.ePage.Masters.CurrentConsigneeAddress = value;
                }
            });
        }

        //To bind the current chosen address in jobaddress
        function AddressChosen(item){
            angular.forEach(ConsigneeAddressCtrl.ePage.Entities.UIJobAddress,function(value,key){
                if(value.AddressType='CED'){
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

                    //Binding in current Consignee values
                    ConsigneeAddressCtrl.ePage.Masters.CurrentConsigneeAddress.OAD_Address_FK = item.PK;

                }
            })
            Cancel();
        }

        Init();
    }

})();