(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AcknowledgeCsrController", AcknowledgeCsrController);

    AcknowledgeCsrController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "deliveryConfig"];

    function AcknowledgeCsrController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, deliveryConfig) {
        var AcknowledgeCsrCtrl = this;

        function Init() {
            AcknowledgeCsrCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            AcknowledgeCsrCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            AcknowledgeCsrCtrl.ePage.Masters.emptyText = "-";
            if (AcknowledgeCsrCtrl.taskObj) {
                AcknowledgeCsrCtrl.ePage.Masters.TaskObj = AcknowledgeCsrCtrl.taskObj;
                GetEntityObj();
            } else {
                AcknowledgeCsrCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
                deliveryConfig.GetTabDetails(AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery, false).then(function (response) {
                    angular.forEach(response, function (value, key) {
                        if (value.label == AcknowledgeCsrCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID) {
                            AcknowledgeCsrCtrl.currentDelivery = value;
                        }
                    });
                });
                if (errorWarningService.Modules.MyTask)
                    AcknowledgeCsrCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Delivery.label];
            }

            AcknowledgeCsrCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker = {};
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.isOpen = [];
            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Delivery.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: AcknowledgeCsrCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AcknowledgeCsrCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (AcknowledgeCsrCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + AcknowledgeCsrCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AcknowledgeCsrCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();