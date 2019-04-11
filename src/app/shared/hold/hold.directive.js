(function () {
    "use strict";

    angular
        .module("Application")
        .directive("hold", Hold);

    function Hold() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/hold/hold.html",
            controller: "HoldController",
            controllerAs: "HoldCtrl",
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
        .controller("HoldController", HoldController);

    HoldController.$inject = ["appConfig", "helperService", "apiService", "authService", "APP_CONSTANT", "toastr"];

    function HoldController(appConfig, helperService, apiService, authService, APP_CONSTANT, toastr) {
        /* jshint validthis: true */
        var HoldCtrl = this;

        function Init() {
            HoldCtrl.ePage = {
                "Title": "",
                "Prefix": "Hold",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            // DatePicker
            HoldCtrl.ePage.Masters.DatePicker = {};
            HoldCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            HoldCtrl.ePage.Masters.DatePicker.isOpen = false;
            HoldCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            HoldCtrl.ePage.Masters.HoldReason = {};
            HoldCtrl.ePage.Masters.HoldReason.OnChange = OnHoldReasonChange;
            HoldCtrl.ePage.Masters.Submit = Submit;

            HoldCtrl.ePage.Masters.SubmitBtnText = "Submit";
            HoldCtrl.ePage.Masters.IsDisableSubmitBtn = false;

            if (HoldCtrl.input) {
                HoldCtrl.ePage.Masters.Task = HoldCtrl.input;

                HoldCtrl.ePage.Masters.DatePicker.Options.minDate = new Date(HoldCtrl.ePage.Masters.Task.DueDate);

                GetHoldReasonList();
            }
        }

        function GetHoldReasonList() {
            HoldCtrl.ePage.Masters.HoldReason.ListSource = undefined;
            var _filter = {
                EEM_Code_2: HoldCtrl.ePage.Masters.Task.WSI_StepCode,
                EEM_FK_2: HoldCtrl.ePage.Masters.Task.WSI_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMSteps.API.HoldReasonFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMSteps.API.HoldReasonFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    HoldCtrl.ePage.Masters.HoldReason.ListSource = response.data.Response;
                } else {
                    HoldCtrl.ePage.Masters.HoldReason.ListSource = [];
                }
            });
        }

        function OnHoldReasonChange($item) {
            HoldCtrl.ePage.Entities.WSL_Name = $item.Name;
        }

        function OpenDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation()
            HoldCtrl.ePage.Masters.DatePicker.isOpen = true;
        }

        function Submit() {
            var _input = HoldCtrl.ePage.Entities;

            if (_input.DueDate && _input.WSL_FK && _input.Remarks) {
                HoldCtrl.ePage.Masters.SubmitBtnText = "Please Wait...!";
                HoldCtrl.ePage.Masters.IsDisableSubmitBtn = true;

                _input.Category = "4";
                _input.EntityRefKey = HoldCtrl.ePage.Masters.Task.EntityRefKey;
                _input.EntitySource = HoldCtrl.ePage.Masters.Task.EntitySource;
                _input.EntityRefCode = HoldCtrl.ePage.Masters.Task.KeyReference;
                _input.ParentEntityRefKey = HoldCtrl.ePage.Masters.Task.PK;
                _input.ParentEntitySource = "WKI";
                _input.ParentEntityRefCode = HoldCtrl.ePage.Masters.Task.WorkItemNo;
                // _input.AdditionalEntityRefKey = HoldCtrl.ePage.Masters.Task.AdditionalEntityRefKey;
                // _input.AdditionalEntitySource = HoldCtrl.ePage.Masters.Task.AdditionalEntitySource;
                // _input.AdditionalEntityRefCode = HoldCtrl.ePage.Masters.Task.AdditionalEntityRefCode;
                _input.SAP_FK = authService.getUserInfo().AppPK;
                _input.IsModified = true;

                apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {}

                    HoldCtrl.onSubmitResponse({
                        $item: HoldCtrl.ePage.Entities
                    });

                    HoldCtrl.ePage.Masters.SubmitBtnText = "Submit";
                    HoldCtrl.ePage.Masters.IsDisableSubmitBtn = false;
                });
            } else {
                toastr.warning("Please fill all the fields...!");
            }
        }

        Init();
    }
})();
