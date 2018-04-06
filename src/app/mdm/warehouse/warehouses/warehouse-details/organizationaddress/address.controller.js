(function () {
    "use strict";

    angular
    .module("Application")
    .controller("OrganizationAddressController", OrganizationAddressController);

    OrganizationAddressController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "warehousesConfig", "helperService", "toastr", "$filter","$injector","myData"];
    
    function OrganizationAddressController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, warehousesConfig, helperService, toastr, $filter,$injector,myData) {

        var OrganizationAddressCtrl = this;

        function Init() {
            var currentAddress = myData;

            OrganizationAddressCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAddress
            };
            OrganizationAddressCtrl.ePage.Masters.Cancel = Cancel;
            OrganizationAddressCtrl.ePage.Masters.AddressChosen = AddressChosen;

        }
        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        //To bind the current chosen address in jobaddress
        function AddressChosen(item){
            OrganizationAddressCtrl.ePage.Entities.CurrentData.WmsWarehouse.OAD_FK = item.PK;  
            OrganizationAddressCtrl.ePage.Entities.CurrentData.WmsWarehouse.CountryCode = item.CountryCode;  

            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_PK  = item.PK;                                                    
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Address1 = item.Address1;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Address2 = item.Address2;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_City = item.City;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Code = item.Code;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_CountryCode = item.CountryCode;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Email = item.Email;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Fax = item.Fax;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_State = item.State;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_PostCode = item.PostCode;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Phone = item.Phone;
            OrganizationAddressCtrl.ePage.Entities.CurrentData.UIOrgHeader.OAD_Mobile = item.Mobile;
            Cancel();
        }

        Init();
    }

})();