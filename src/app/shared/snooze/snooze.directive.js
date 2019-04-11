(function () {
    "use strict";

    angular
        .module("Application")
        .directive("snooze", Snooze);

    function Snooze() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/snooze/snooze.html",
            controller: "SnoozeController",
            controllerAs: "SnoozeCtrl",
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                onSubmitResponse: "&"
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("SnoozeController", SnoozeController);

    SnoozeController.$inject = ["appConfig", "helperService", "apiService", "authService", "APP_CONSTANT", "toastr"];

    function SnoozeController(appConfig, helperService, apiService, authService, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var SnoozeCtrl = this;

        function Init() {
            SnoozeCtrl.ePage = {
                "Title": "",
                "Prefix": "Snooze",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            // DatePicker
            SnoozeCtrl.ePage.Masters.DatePicker = {};
            SnoozeCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            SnoozeCtrl.ePage.Masters.DatePicker.isOpen = false;
            SnoozeCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            SnoozeCtrl.ePage.Masters.SnoozeReason = {};
            SnoozeCtrl.ePage.Masters.SnoozeReason.OnChange = OnSnoozeReasonChange;
            SnoozeCtrl.ePage.Masters.Submit = Submit;

            SnoozeCtrl.ePage.Masters.SubmitBtnText = "Submit";
            SnoozeCtrl.ePage.Masters.IsDisableSubmitBtn = false;

            if (SnoozeCtrl.input) {
                SnoozeCtrl.ePage.Masters.Task = SnoozeCtrl.input;

                SnoozeCtrl.ePage.Masters.DatePicker.Options.minDate = new Date(SnoozeCtrl.ePage.Masters.Task.DueDate);

                GetSnoozeReasonList();
            }
        }

        function GetSnoozeReasonList() {
            SnoozeCtrl.ePage.Masters.SnoozeReason.ListSource = undefined;
            var _filter = {
                EEM_Code_2: SnoozeCtrl.ePage.Masters.Task.WSI_StepCode,
                EEM_FK_2: SnoozeCtrl.ePage.Masters.Task.WSI_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMSteps.API.SnoozeReasonFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMSteps.API.SnoozeReasonFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SnoozeCtrl.ePage.Masters.SnoozeReason.ListSource = response.data.Response;
                } else {
                    SnoozeCtrl.ePage.Masters.SnoozeReason.ListSource = [];
                }
            });
        }

        function OnSnoozeReasonChange($item) {
            SnoozeCtrl.ePage.Entities.WSL_Name = $item.Name;
        }

        function OpenDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation()
            SnoozeCtrl.ePage.Masters.DatePicker.isOpen = true;
        }

        function Submit() {
            var _input = SnoozeCtrl.ePage.Entities;

            if (_input.DueDate && _input.WSL_FK && _input.Remarks) {
                SnoozeCtrl.ePage.Masters.SubmitBtnText = "Please Wait...!";
                SnoozeCtrl.ePage.Masters.IsDisableSubmitBtn = true;

                _input.Category = "3";
                _input.EntityRefKey = SnoozeCtrl.ePage.Masters.Task.EntityRefKey;
                _input.EntitySource = SnoozeCtrl.ePage.Masters.Task.EntitySource;
                _input.EntityRefCode = SnoozeCtrl.ePage.Masters.Task.KeyReference;
                _input.ParentEntityRefKey = SnoozeCtrl.ePage.Masters.Task.PK;
                _input.ParentEntitySource = "WKI";
                _input.ParentEntityRefCode = SnoozeCtrl.ePage.Masters.Task.WorkItemNo;
                // _input.AdditionalEntityRefKey = SnoozeCtrl.ePage.Masters.Task.AdditionalEntityRefKey;
                // _input.AdditionalEntitySource = SnoozeCtrl.ePage.Masters.Task.AdditionalEntitySource;
                // _input.AdditionalEntityRefCode = SnoozeCtrl.ePage.Masters.Task.AdditionalEntityRefCode;
                _input.SAP_FK = authService.getUserInfo().AppPK;
                _input.IsModified = true;

                apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {}

                    SnoozeCtrl.onSubmitResponse({
                        $item: SnoozeCtrl.ePage.Entities
                    });

                    SnoozeCtrl.ePage.Masters.SubmitBtnText = "Submit";
                    SnoozeCtrl.ePage.Masters.IsDisableSubmitBtn = false;
                });
            } else {
                toastr.warning("Please fill all the fields...!");
            }
        }

        Init();
    }
})();
