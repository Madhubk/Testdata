(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ChecklistController", ChecklistController);

    ChecklistController.$inject = ["helperService", "appConfig", "apiService", "authService"];

    function ChecklistController(helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var ChecklistCtrl = this;

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
            ChecklistCtrl.ePage.Masters.Checklist.OnChecklistChange = OnChecklistChange;
            ChecklistCtrl.ePage.Masters.Checklist.UpdateChecklist = UpdateChecklist;

            ChecklistCtrl.ePage.Masters.CheckedList = {};

            GetChecklist();
        }

        function GetChecklist() {
            ChecklistCtrl.ePage.Masters.Checklist.ListSource = undefined;
            var _filter = {
                EEM_Code_2: ChecklistCtrl.ePage.Entities.ParentEntityRefCode,
                EEM_FK_2: ChecklistCtrl.ePage.Entities.ParentEntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMStepsCheckList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMStepsCheckList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ChecklistCtrl.ePage.Masters.Checklist.ListSource = response.data.Response;
                    if (response.data.Response.length > 0) {
                        GetCheckedList();
                    }
                } else {
                    ChecklistCtrl.ePage.Masters.Checklist.ListSource = [];
                }
            });
        }

        // List Already Saved
        function GetCheckedList() {
            ChecklistCtrl.ePage.Masters.CheckedList.ListSource = undefined;
            var _filter = {
                "EntitySource": ChecklistCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": ChecklistCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": ChecklistCtrl.ePage.Entities.EntityRefCode,
                "Category": "1"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCheckList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ChecklistCtrl.ePage.Masters.CheckedList.ListSource = response.data.Response;
                    if (ChecklistCtrl.ePage.Masters.CheckedList.ListSource.length > 0) {
                        ChecklistCtrl.ePage.Masters.CheckedList.ListSource.map(function (value1, key1) {
                            ChecklistCtrl.ePage.Masters.Checklist.ListSource.map(function (value2, key2) {
                                if (value1.ParentEntityRefKey == value2.PK) {
                                    value2.CheckedData = value1;
                                    value2.IsChecked = true;
                                    value2.Remarks = value1.Remarks;
                                }
                            });
                        });
                    }
                } else {
                    ChecklistCtrl.ePage.Masters.CheckedList.ListSource = [];
                }
            });
        }

        function OnChecklistChange($event, $item) {
            var _target = $event.target;
            var _isChecked = _target.checked;

            $item.IsShowRemark = false;

            if (_isChecked) {
                SaveChecklist($item);
            } else {
                DeleteChecklist($item);
            }
        }

        function SaveChecklist($item) {
            var _input = {};
            _input.Category = "1";
            _input.EntityRefKey = ChecklistCtrl.ePage.Entities.EntityRefKey;
            _input.EntitySource = ChecklistCtrl.ePage.Entities.EntitySource;
            _input.EntityRefCode = ChecklistCtrl.ePage.Entities.EntityRefCode;
            _input.ParentEntityRefKey = $item.PK;
            _input.ParentEntitySource = ChecklistCtrl.ePage.Entities.ParentEntitySource;
            _input.ParentEntityRefCode = $item.Code;
            _input.AdditionalEntityRefKey = ChecklistCtrl.ePage.Entities.AdditionalEntityRefKey;
            _input.AdditionalEntitySource = ChecklistCtrl.ePage.Entities.AdditionalEntitySource;
            _input.AdditionalEntityRefCode = ChecklistCtrl.ePage.Entities.AdditionalEntityRefCode;
            _input.WSL_FK = ChecklistCtrl.ePage.Entities.ParentEntityRefKey;
            _input.WSL_Name = ChecklistCtrl.ePage.Entities.ParentEntityRefCode;
            _input.SAP_FK = authService.getUserInfo().AppPK;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.CheckedData = response.data.Response[0];
                    }
                }
            });
        }

        function DeleteChecklist($item) {
            if ($item.CheckedData) {
                apiService.get("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Delete.Url + $item.CheckedData.PK).then(function (response) {
                    $item.CheckedData = undefined;
                });
            }
        }

        function UpdateChecklist($item) {
            var _input = $item.CheckedData;
            _input.Remarks = $item.Remarks;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.CheckedData = response.data.Response[0];
                    }
                    $item.IsShowRemark = false;
                }
            });
        }

        Init();
    }
})();
