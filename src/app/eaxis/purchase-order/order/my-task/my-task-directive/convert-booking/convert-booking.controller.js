(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConvertBookingDirectiveController", ConvertBookingDirectiveController);

    ConvertBookingDirectiveController.$inject = ["$window", "$scope", "$injector", "helperService", "apiService", "appConfig", "$uibModal", "authService", "toastr"];

    function ConvertBookingDirectiveController($window, $scope, $injector, helperService, apiService, appConfig, $uibModal, authService, toastr) {
        var ConvertBookingDirectiveCtrl = this;

        function Init() {
            ConvertBookingDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "CTB_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            ConvertBookingDirectiveCtrl.ePage.Masters.MyTask = ConvertBookingDirectiveCtrl.taskObj;
            ConvertBookingDirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
            ConvertBookingDirectiveCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            if (ConvertBookingDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ConvertBookingDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ConvertBookingDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ConvertBookingDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if (ConvertBookingDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentPreAdvice.API.GetOrdersByGroupPK.Url + ConvertBookingDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ConvertBookingDirectiveCtrl.ePage.Masters.ConvertBookingDetails = response.data.Response;
                    } else {
                        ConvertBookingDirectiveCtrl.ePage.Masters.ConvertBookingDetails = [];
                    }
                });
            }
        }

        function GetTemplateName($item) {
            var _formName = "mytaskdefault-edit-modal";
            if ($item) {
                _formName = $item.replace(/ +/g, "").toLowerCase();

                if (_formName.indexOf("_") != -1) {
                    _formName = _formName.split("_").join("");
                }
            }

            return _formName;
        }

        function EditActivityModalInstance($item) {
            var _templateName = "mytaskdefault-edit-modal";
            var _IsCheckTemplateName = true;
            if ($item.OtherConfig) {
                if (!$item.OtherConfig.HideForm) {
                    if ($item.OtherConfig.IsRoleBased) {
                        if ($item.OtherConfig.RoleBasedForm) {
                            if ($item.OtherConfig.RoleBasedForm.length > 0) {
                                if (authService.getUserInfo().RoleList) {
                                    if (_IsCheckTemplateName) {
                                        authService.getUserInfo().RoleList.map(function (value1, key1) {
                                            $item.OtherConfig.RoleBasedForm.map(function (value2, key2) {
                                                if (value1.Role_Code == value2.Role) {
                                                    _templateName = value2.FormName;
                                                    _IsCheckTemplateName = false;
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    _templateName = $item.OtherConfig.RoleBasedForm[0].FormName;
                                    _IsCheckTemplateName = false;
                                }
                            }
                        }
                    } else if ($item.OtherConfig.IsFormName) {
                        if ($item.OtherConfig.FormName) {
                            _templateName = $item.OtherConfig.FormName;
                            _IsCheckTemplateName = false;
                        }
                    }
                }
            }

            if (_IsCheckTemplateName) {
                _templateName = GetTemplateName($item.WSI_StepCode);
            }

            var _isExist = $injector.has(_templateName + "Directive");
            if (!_isExist) {
                if (!_IsCheckTemplateName) {
                    _templateName = GetTemplateName($item.WSI_StepCode);
                    var _isExist = $injector.has(_templateName + "Directive");
                    if (!_isExist) {
                        _templateName = "mytaskdefault-edit-modal";
                    }
                } else {
                    _templateName = "mytaskdefault-edit-modal";
                }
            } else {
                _templateName = _templateName + "-edit-modal";
            }
            $item.ConvertBookingDirect = true;
            ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityItem = $item;

            return ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: _templateName + " right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="ConvertBookingDirectiveCtrl.ePage.Masters.CloseEditActivityModal(ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityItem)">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>{{ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityItem.WSI_StepName}} - {{ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityItem.KeyReference}}</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body pt-10" id="modal-body">
                                        <my-task-dynamic-edit-directive task-obj='ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityItem' entity-obj='' tab-obj='' on-complete="ConvertBookingDirectiveCtrl.ePage.Masters.CloseEditActivityModal($item)" on-refresh-status-count="ConvertBookingDirectiveCtrl.ePage.Masters.StatusCount.OnRefreshStatusCount($item, 'edit')" on-refresh-task="ConvertBookingDirectiveCtrl.ePage.Masters.OnRefreshTask($item)"></my-task-dynamic-edit-directive>
                                    </div>`
            });
        }

        function OpenActivity($item) {
            if (ConvertBookingDirectiveCtrl.ePage.Masters.ConvertBookingDetails.length > 0) {
                EditActivityModalInstance($item).result.then(function (response) {}, function () {
                    console.log("Cancelled");
                });
            } else {
                toastr.warning("There is no orders available...")
            }
        }

        function CloseEditActivityModal($item) {
            $item.ConvertBookingDirect = false;
            ConvertBookingDirectiveCtrl.ePage.Masters.EditActivityModal.dismiss('cancel');
        }

        Init();
    }
})();