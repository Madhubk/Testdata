(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryLineMenuController", DeliveryLineMenuController);

    DeliveryLineMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "deliveryLineConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal", "$ocLazyLoad"];

    function DeliveryLineMenuController($scope, $timeout, APP_CONSTANT, apiService, deliveryLineConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal, $ocLazyLoad) {

        var DeliveryLineMenuCtrl = this

        function Init() {

            var currentDelivery = DeliveryLineMenuCtrl.currentDelivery[DeliveryLineMenuCtrl.currentDelivery.label].ePage.Entities;

            DeliveryLineMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Line_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery
            };

            DeliveryLineMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DeliveryLineMenuCtrl.ePage.Masters.Validation = Validation;
            DeliveryLineMenuCtrl.ePage.Masters.Config = deliveryLineConfig;
        }

        // #region - saving delivery
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            Saveonly($item);
        }

        function Saveonly($item) {
            DeliveryLineMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            DeliveryLineMenuCtrl.ePage.Masters.DisableSave = true;
            DeliveryLineMenuCtrl.ePage.Masters.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'DeliveryReport').then(function (response) {
                DeliveryLineMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                DeliveryLineMenuCtrl.ePage.Masters.DisableSave = false;
                DeliveryLineMenuCtrl.ePage.Masters.Loading = false;

                if (response.Status === "success") {
                    deliveryLineConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == DeliveryLineMenuCtrl.ePage.Entities.Header.Data.DeliveryLineRefNo) {
                                value.label = DeliveryLineMenuCtrl.ePage.Entities.Header.Data.DeliveryLineRefNo;
                                value[DeliveryLineMenuCtrl.ePage.Entities.Header.Data.DeliveryLineRefNo] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = deliveryLineConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(DeliveryLineMenuCtrl.currentDelivery[DeliveryLineMenuCtrl.currentDelivery.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response)
                            deliveryLineConfig.TabList[_index][deliveryLineConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        else if (response.Data)
                            deliveryLineConfig.TabList[_index][deliveryLineConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        helperService.refreshGrid();

                    }
                    if (DeliveryLineMenuCtrl.ePage.Masters.SaveAndClose) {
                        DeliveryLineMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        DeliveryLineMenuCtrl.ePage.Masters.SaveAndClose = false;
                        DeliveryLineMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                    toastr.success("Saved Successfully");

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    DeliveryLineMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        DeliveryLineMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DeliveryLineMenuCtrl.currentDelivery.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (DeliveryLineMenuCtrl.ePage.Entities.Header.Validations != null) {
                        DeliveryLineMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DeliveryLineMenuCtrl.currentDelivery);
                    }
                }
            });
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
        // #endregion     
        Init();
    }

})();