(function () {
    "use strict";

    angular
        .module("Application")
        .directive("overrideKpi", OverrideKpi);

    function OverrideKpi() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/override-kpi/override-kpi.html",
            controller: "OverrideKpiController",
            controllerAs: "OverrideKpiCtrl",
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
        .controller("OverrideKpiController", OverrideKpiController);

    OverrideKpiController.$inject = ["appConfig", "helperService", "apiService", "authService", "APP_CONSTANT", "toastr"];

    function OverrideKpiController(appConfig, helperService, apiService, authService, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var OverrideKpiCtrl = this;

        function Init() {
            OverrideKpiCtrl.ePage = {
                "Title": "",
                "Prefix": "OverrideKpi",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            // DatePicker
            OverrideKpiCtrl.ePage.Masters.DatePicker = {};
            OverrideKpiCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            OverrideKpiCtrl.ePage.Masters.DatePicker.isOpen = false;
            OverrideKpiCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            OverrideKpiCtrl.ePage.Masters.DelayReason = {};
            OverrideKpiCtrl.ePage.Masters.DelayReason.OnChange = OnDelayReasonChange;
            OverrideKpiCtrl.ePage.Masters.Submit = Submit;

            OverrideKpiCtrl.ePage.Masters.SubmitBtnText = "Submit";
            OverrideKpiCtrl.ePage.Masters.IsDisableSubmitBtn = false;

            if (OverrideKpiCtrl.input) {
                OverrideKpiCtrl.ePage.Masters.Task = OverrideKpiCtrl.input;

                OverrideKpiCtrl.ePage.Masters.DatePicker.Options.minDate = new Date(OverrideKpiCtrl.ePage.Masters.Task.DueDate);

                GetDelayReasonList();
            }
        }

        function GetDelayReasonList() {
            OverrideKpiCtrl.ePage.Masters.DelayReason.ListSource = undefined;
            var _filter = {
                EEM_Code_2: OverrideKpiCtrl.ePage.Masters.Task.WSI_StepCode,
                EEM_FK_2: OverrideKpiCtrl.ePage.Masters.Task.WSI_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMStepsDelayReason.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMStepsDelayReason.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OverrideKpiCtrl.ePage.Masters.DelayReason.ListSource = response.data.Response;
                } else {
                    OverrideKpiCtrl.ePage.Masters.DelayReason.ListSource = [];
                }
            });
        }

        function OnDelayReasonChange($item) {
            OverrideKpiCtrl.ePage.Entities.WSL_Name = $item.Name;
        }

        function OpenDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation()
            OverrideKpiCtrl.ePage.Masters.DatePicker.isOpen = true;
        }

        function Submit() {
            var _input = OverrideKpiCtrl.ePage.Entities;

            if (_input.DueDate && _input.WSL_FK && _input.Remarks) {
                OverrideKpiCtrl.ePage.Masters.SubmitBtnText = "Please Wait...!";
                OverrideKpiCtrl.ePage.Masters.IsDisableSubmitBtn = true;

                _input.Category = "2";
                _input.EntityRefKey = OverrideKpiCtrl.ePage.Masters.Task.EntityRefKey;
                _input.EntitySource = OverrideKpiCtrl.ePage.Masters.Task.EntitySource;
                _input.EntityRefCode = OverrideKpiCtrl.ePage.Masters.Task.KeyReference;
                _input.ParentEntityRefKey = OverrideKpiCtrl.ePage.Masters.Task.PK;
                _input.ParentEntitySource = "WKI";
                _input.ParentEntityRefCode = OverrideKpiCtrl.ePage.Masters.Task.WorkItemNo;
                // _input.AdditionalEntityRefKey = OverrideKpiCtrl.ePage.Masters.Task.AdditionalEntityRefKey;
                // _input.AdditionalEntitySource = OverrideKpiCtrl.ePage.Masters.Task.AdditionalEntitySource;
                // _input.AdditionalEntityRefCode = OverrideKpiCtrl.ePage.Masters.Task.AdditionalEntityRefCode;
                _input.SAP_FK = authService.getUserInfo().AppPK;
                _input.IsModified = true;

                apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {}

                    OverrideKpiCtrl.onSubmitResponse({
                        $item: OverrideKpiCtrl.ePage.Entities
                    });

                    OverrideKpiCtrl.ePage.Masters.SubmitBtnText = "Submit";
                    OverrideKpiCtrl.ePage.Masters.IsDisableSubmitBtn = false;
                });
            } else {
                toastr.warning("Please fill all the fields...!");
            }
        }

        Init();
    }
})();
