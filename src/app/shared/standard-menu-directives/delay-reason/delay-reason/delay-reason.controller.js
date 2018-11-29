(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DelayReasonController", DelayReasonController);

    DelayReasonController.$inject = ["helperService", "appConfig", "apiService", "authService"];

    function DelayReasonController(helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var DelayReasonCtrl = this;

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
            DelayReasonCtrl.ePage.Masters.DelayReason.OnDelayReasonChange = OnDelayReasonChange;
            DelayReasonCtrl.ePage.Masters.DelayReason.UpdateDelayReason = UpdateDelayReason;

            DelayReasonCtrl.ePage.Masters.CheckedList = {};

            GetDelayReason();
        }

        function GetDelayReason() {
            DelayReasonCtrl.ePage.Masters.DelayReason.ListSource = undefined;
            var _filter = {
                EEM_Code_2: DelayReasonCtrl.ePage.Entities.ParentEntityRefCode,
                EEM_FK_2: DelayReasonCtrl.ePage.Entities.ParentEntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMStepsDelayReason.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMStepsDelayReason.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DelayReasonCtrl.ePage.Masters.DelayReason.ListSource = response.data.Response;
                    if (response.data.Response.length > 0) {
                        GetCheckedList();
                    }
                } else {
                    DelayReasonCtrl.ePage.Masters.DelayReason.ListSource = [];
                }
            });
        }

        // List Already Saved
        function GetCheckedList() {
            DelayReasonCtrl.ePage.Masters.CheckedList.ListSource = undefined;
            var _filter = {
                "EntitySource": DelayReasonCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": DelayReasonCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": DelayReasonCtrl.ePage.Entities.EntityRefCode,
                "Category": "3"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCheckList.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DelayReasonCtrl.ePage.Masters.CheckedList.ListSource = response.data.Response;
                    if (DelayReasonCtrl.ePage.Masters.CheckedList.ListSource.length > 0) {
                        DelayReasonCtrl.ePage.Masters.CheckedList.ListSource.map(function (value1, key1) {
                            DelayReasonCtrl.ePage.Masters.DelayReason.ListSource.map(function (value2, key2) {
                                if (value1.ParentEntityRefKey == value2.PK) {
                                    value2.CheckedData = value1;
                                    value2.IsChecked = true;
                                    value2.Remarks = value1.Remarks;
                                }
                            });
                        });
                    }
                } else {
                    DelayReasonCtrl.ePage.Masters.CheckedList.ListSource = [];
                }
            });
        }

        function OnDelayReasonChange($event, $item) {
            var _target = $event.target;
            var _isChecked = _target.checked;

            $item.IsShowRemark = false;

            if (_isChecked) {
                SaveDelayReason($item);
            } else {
                DeleteDelayReason($item);
            }
        }

        function SaveDelayReason($item) {
            var _input = {};
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

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.CheckedData = response.data.Response[0];
                    }
                }
            });
        }

        function DeleteDelayReason($item) {
            if ($item.CheckedData) {
                apiService.get("eAxisAPI", appConfig.Entities.EBPMCheckList.API.Delete.Url + $item.CheckedData.PK).then(function (response) {
                    $item.CheckedData = undefined;
                });
            }
        }

        function UpdateDelayReason($item) {
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
