(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryConsignmentMenuController", DeliveryConsignmentMenuController);

    DeliveryConsignmentMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "deliveryConsignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr"];

    function DeliveryConsignmentMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, deliveryConsignmentConfig, helperService, appConfig, authService, $state, confirmation, toastr) {

        var DeliveryConsignMenuCtrl = this;

        function Init() {

            var currentConsignment = DeliveryConsignMenuCtrl.currentConsignment[DeliveryConsignMenuCtrl.currentConsignment.label].ePage.Entities;

            DeliveryConsignMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };

            DeliveryConsignMenuCtrl.ePage.Masters.Config = deliveryConsignmentConfig;
            DeliveryConsignMenuCtrl.ePage.Masters.SaveButtonText = "Delivery Consignment";
            // function
            DeliveryConsignMenuCtrl.ePage.Masters.Validation = Validation;

            DeliveryConsignMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            DeliveryConsignMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            DeliveryConsignMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = DeliveryConsignMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            DeliveryConsignMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DeliveryConsignMenuCtrl.ePage.Entities.Header.Validations) {
                DeliveryConsignMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DeliveryConsignMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                DeliveryConsignMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DeliveryConsignMenuCtrl.currentConsignment);
            }
        }

        function Save($item) {

            DeliveryConsignMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";

            DeliveryConsignMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            if (!_input.TmsConsignmentHeader.ActualDeliveryDateTime) {
                _input.TmsConsignmentHeader.ActualDeliveryDateTime = new Date();
            }

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                DeliveryConsignMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                DeliveryConsignMenuCtrl.ePage.Masters.SaveButtonText = "Delivery Consignment";


                if (response.Status === "success") {
                    var _index = deliveryConsignmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(DeliveryConsignMenuCtrl.currentConsignment[DeliveryConsignMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DeliveryConsignMenuCtrl.currentConsignment[DeliveryConsignMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                deliveryConsignmentConfig.TabList[_index][deliveryConsignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                                SaveandClose(_index, DeliveryConsignMenuCtrl.currentConsignment);
                            }
                        });

                        deliveryConsignmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/delivery-consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    toastr.success("Saved Successfully");
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.erorr("save failed");
                }
            });
        }

        function SaveandClose(index, currentConsignment) {
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            deliveryConsignmentConfig.TabList.splice(index - 1, 1);
            DeliveryConsignMenuCtrl.ePage.Masters.Config.SaveAndClose = false;
            DeliveryConsignMenuCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        Init();
    }
})();