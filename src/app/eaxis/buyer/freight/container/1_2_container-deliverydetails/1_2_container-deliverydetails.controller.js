(function () {
    "use strict";

    angular
        .module("Application")
        .controller("containerDeliveryDetailsController", containerDeliveryDetailsController);

    containerDeliveryDetailsController.$inject = ["$q", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "MultipleSelect"];

    function containerDeliveryDetailsController($q, $uibModalInstance, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, MultipleSelect) {
        /* jshint validthis: true */
        var containerDeliveryDetailsCtrl = this;

        // dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            console.log(containerDeliveryDetailsCtrl);
            containerDeliveryDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };
            containerDeliveryDetailsCtrl.ePage.Masters.DatePicker = {};
            containerDeliveryDetailsCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            containerDeliveryDetailsCtrl.ePage.Masters.DatePicker.isOpen = [];
            containerDeliveryDetailsCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            containerDeliveryDetailsCtrl.ePage.Masters.UpdateContainer = UpdateContainer;
            containerDeliveryDetailsCtrl.ePage.Masters.SaveButtonText = "Submit";
            containerDeliveryDetailsCtrl.ePage.Masters.IsDisableSave = false;
            containerDeliveryDetailsCtrl.ePage.Masters.modalClose = modalClose;
            containerDeliveryDetailsCtrl.ePage.Entities.Header.Data.UICntContainer = MultipleSelect.items;
        }

        function modalClose() {
            $uibModalInstance.dismiss('close');
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            containerDeliveryDetailsCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function UpdateContainer($item) {
            var deferred = $q.defer();
            var _containerInput = [];
            console.log($item);

            containerDeliveryDetailsCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (val, key) {
                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_CustomsClearenceDate",
                        "PropertyNewValue": val.CustomsClearenceDate
                    }, {
                        "PropertyName": "CNT_PlannedDelivery",
                        "PropertyNewValue": val.PlannedDelivery
                    },
                    {
                        "PropertyName": "CNT_ArrivalCartageComplete",
                        "PropertyNewValue": val.ArrivalCartageComplete
                    },
                    {
                        "PropertyName": "CNT_DepartureActualPickup",
                        "PropertyNewValue": val.DepartureActualPickup
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                    toastr.success("Updated Successfully");
                } else {
                    toastr.error("Update Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;

        }
        Init();
    }
})();