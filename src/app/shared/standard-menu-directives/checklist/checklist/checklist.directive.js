(function () {
    "use strict";

    angular
        .module("Application")
        .directive("checklist", Checklist);

    function Checklist() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/checklist/checklist/checklist.html",
            controller: 'ChecklistController',
            controllerAs: 'ChecklistCtrl',
            bindToController: true,
            scope: {
                input: "="
            }
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("ChecklistController", ChecklistController);

    ChecklistController.$inject = ["helperService", "appConfig", "apiService", "authService"];

    function ChecklistController(helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        let ChecklistCtrl = this;

        function Init() {
            ChecklistCtrl.ePage = {
                "Title": "",
                "Prefix": "Checklist",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ChecklistCtrl.input
            };

            if (ChecklistCtrl.ePage.Entities) {
                InitChecklist();
            }
        }

        function InitChecklist() {
            ChecklistCtrl.ePage.Masters.Checklist = {};

            ChecklistCtrl.ePage.Masters.Checklist.Refresh = Refresh;
            ChecklistCtrl.ePage.Masters.Checklist.OnChecklistChange = OnChecklistChange;
            ChecklistCtrl.ePage.Masters.Checklist.UpdateChecklist = UpdateChecklist;

            ChecklistCtrl.ePage.Masters.CheckedList = {};

            GetChecklist();
        }

        function Refresh() {
            GetChecklist();
        }

        function GetChecklist() {
            ChecklistCtrl.ePage.Masters.Checklist.ListSource = undefined;
            let _filter = {
                EEM_Code_2: ChecklistCtrl.ePage.Entities.ParentEntityRefCode,
                EEM_FK_2: ChecklistCtrl.ePage.Entities.ParentEntityRefKey
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMStepsCheckList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMStepsCheckList.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    ChecklistCtrl.ePage.Masters.Checklist.ListSource = response.data.Response;

                    ChecklistCtrl.ePage.Masters.Checklist.ListSource.map(x => {
                        x.UpdateBtnTxt = "Update";
                        x.IsDisableUpdateBtn = false;
                    });
                    GetCheckedList();
                } else {
                    ChecklistCtrl.ePage.Masters.Checklist.ListSource = [];
                }
            });
        }

        // List Already Saved
        function GetCheckedList() {
            ChecklistCtrl.ePage.Masters.CheckedList.ListSource = undefined;
            let _filter = {
                "EntityRefKey": ChecklistCtrl.ePage.Entities.EntityRefKey,
                "Category": "1"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCheckList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    ChecklistCtrl.ePage.Masters.CheckedList.ListSource = response.data.Response;
                    ChecklistCtrl.ePage.Masters.CheckedList.ListSource.map(value1 => {
                        ChecklistCtrl.ePage.Masters.Checklist.ListSource.map(value2 => {
                            if (value1.ParentEntityRefKey == value2.PK) {
                                value2.CheckedData = value1;
                                value2.IsChecked = true;
                                value2.Remarks = value1.Remarks;
                            }
                        });
                    });
                } else {
                    ChecklistCtrl.ePage.Masters.CheckedList.ListSource = [];
                }
            });
        }

        function OnChecklistChange($event, $item) {
            let _target = $event.target;
            let _isChecked = _target.checked;

            $item.IsShowRemark = false;

            if (_isChecked) {
                SaveChecklist($item);
            } else {
                DeleteChecklist($item);
            }
        }

        function SaveChecklist($item) {
            let _input = {};
            _input.Category = "1";
            _input.EntityRefKey = ChecklistCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = ChecklistCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = ChecklistCtrl.ePage.Entities.EntityRefCode;
            _input.ParentEntityRefKey = $item.PK;
            _input.ParentEntitySource = "CHK";
            _input.ParentEntityRefCode = $item.Code;
            _input.AdditionalEntityRefKey = ChecklistCtrl.ePage.Entities.AdditionalEntityRefKey;
            _input.AdditionalEntitySource = ChecklistCtrl.ePage.Entities.AdditionalEntitySource;
            _input.AdditionalEntityRefCode = ChecklistCtrl.ePage.Entities.AdditionalEntityRefCode;
            _input.WSL_FK = ChecklistCtrl.ePage.Entities.ParentEntityRefKey;
            _input.WSL_Name = ChecklistCtrl.ePage.Entities.ParentEntityRefCode;
            _input.SAP_FK = authService.getUserInfo().AppPK;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    $item.CheckedData = response.data.Response[0];
                }
            });
        }

        function DeleteChecklist($item) {
            if ($item.CheckedData) {
                apiService.get("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Delete.Url + $item.CheckedData.PK).then(response => {
                    $item.CheckedData = undefined;
                    $item.Remarks = null;
                });
            }
        }

        function UpdateChecklist($item) {
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
