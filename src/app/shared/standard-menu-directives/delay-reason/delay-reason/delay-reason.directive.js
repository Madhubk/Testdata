(function () {
    "use strict";

    angular
        .module("Application")
        .directive("delayReason", DelayReason);

    DelayReason.$inject = [];

    function DelayReason() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/delay-reason/delay-reason/delay-reason.html",
            controller: 'DelayReasonController',
            controllerAs: 'DelayReasonCtrl',
            bindToController: true,
            scope: {
                input: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("DelayReasonController", DelayReasonController);

    DelayReasonController.$inject = ["helperService", "appConfig", "apiService", "authService"];

    function DelayReasonController(helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        let DelayReasonCtrl = this;

        function Init() {
            DelayReasonCtrl.ePage = {
                "Title": "",
                "Prefix": "DelayReason",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": DelayReasonCtrl.input
            };

            if (DelayReasonCtrl.ePage.Entities) {
                InitDelayReason();
            }
        }

        function InitDelayReason() {
            DelayReasonCtrl.ePage.Masters.DelayReason = {};

            DelayReasonCtrl.ePage.Masters.DelayReason.Refresh = Refresh;
            DelayReasonCtrl.ePage.Masters.DelayReason.OnDelayReasonChange = OnDelayReasonChange;
            DelayReasonCtrl.ePage.Masters.DelayReason.UpdateDelayReason = UpdateDelayReason;

            DelayReasonCtrl.ePage.Masters.CheckedList = {};

            GetDelayReason();
        }

        function Refresh() {
            GetDelayReason();
        }

        function GetDelayReason() {
            DelayReasonCtrl.ePage.Masters.DelayReason.ListSource = undefined;
            let _filter = {
                EEM_Code_2: DelayReasonCtrl.ePage.Entities.ParentEntityRefCode,
                EEM_FK_2: DelayReasonCtrl.ePage.Entities.ParentEntityRefKey
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMStepsDelayReason.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMStepsDelayReason.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    DelayReasonCtrl.ePage.Masters.DelayReason.ListSource = response.data.Response;

                    DelayReasonCtrl.ePage.Masters.DelayReason.ListSource.map(x => {
                        x.UpdateBtnTxt = "Update";
                        x.IsDisableUpdateBtn = false;
                    });
                    GetCheckedList();
                } else {
                    DelayReasonCtrl.ePage.Masters.DelayReason.ListSource = [];
                }
            });
        }

        // List Already Saved
        function GetCheckedList() {
            DelayReasonCtrl.ePage.Masters.CheckedList.ListSource = undefined;
            let _filter = {
                "EntityRefKey": DelayReasonCtrl.ePage.Entities.EntityRefKey,
                "Category": "3"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCheckList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    DelayReasonCtrl.ePage.Masters.CheckedList.ListSource = response.data.Response;
                    DelayReasonCtrl.ePage.Masters.CheckedList.ListSource.map(value1 => {
                        DelayReasonCtrl.ePage.Masters.DelayReason.ListSource.map(value2 => {
                            if (value1.ParentEntityRefKey == value2.PK) {
                                value2.CheckedData = value1;
                                value2.IsChecked = true;
                                value2.Remarks = value1.Remarks;
                            }
                        });
                    });
                } else {
                    DelayReasonCtrl.ePage.Masters.CheckedList.ListSource = [];
                }
            });
        }

        function OnDelayReasonChange($event, $item) {
            let _target = $event.target;
            let _isChecked = _target.checked;

            $item.IsShowRemark = false;

            if (_isChecked) {
                SaveDelayReason($item);
            } else {
                DeleteDelayReason($item);
            }
        }

        function SaveDelayReason($item) {
            let _input = {};
            _input.Category = "3";
            _input.EntityRefKey = DelayReasonCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = DelayReasonCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = DelayReasonCtrl.ePage.Entities.EntityRefCode;
            _input.ParentEntityRefKey = $item.PK;
            _input.ParentEntitySource = DelayReasonCtrl.ePage.Entities.ParentEntitySource;
            _input.ParentEntityRefCode = $item.Code;
            _input.AdditionalEntityRefKey = DelayReasonCtrl.ePage.Entities.AdditionalEntityRefKey;
            _input.AdditionalEntitySource = DelayReasonCtrl.ePage.Entities.AdditionalEntitySource;
            _input.AdditionalEntityRefCode = DelayReasonCtrl.ePage.Entities.AdditionalEntityRefCode;
            _input.WSL_FK = DelayReasonCtrl.ePage.Entities.ParentEntityRefKey;
            _input.WSL_Name = DelayReasonCtrl.ePage.Entities.ParentEntityRefCode;
            _input.SAP_FK = authService.getUserInfo().AppPK;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    $item.CheckedData = response.data.Response[0];
                }
            });
        }

        function DeleteDelayReason($item) {
            if ($item.CheckedData) {
                apiService.get("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Delete.Url + $item.CheckedData.PK).then(response => {
                    $item.CheckedData = undefined;
                    $item.Remarks = null;
                });
            }
        }

        function UpdateDelayReason($item) {
            $item.UpdateBtnTxt = "Please Wait...";
            $item.IsDisableUpdateBtn = true;

            let _input = $item.CheckedData;
            _input.Remarks = $item.Remarks;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Update.Url, _input).then(response => {
                if (response.data.Response) {
                    $item.CheckedData = response.data.Response;
                    $item.IsShowRemark = false;
                    $item.UpdateBtnTxt = "Update";
                    $item.IsDisableUpdateBtn = false;
                }
            });
        }

        Init();
    }
})();
