(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationTaskGroupController", OrganizationTaskGroupController);

    OrganizationTaskGroupController.$inject = ["$scope", "$uibModal", "authService", "apiService", "appConfig", "helperService", "toastr", "jsonEditModal"];

    function OrganizationTaskGroupController($scope, $uibModal, authService, apiService, appConfig, helperService, toastr, jsonEditModal) {
        var OrganizationTaskGroupCtrl = this;

        function Init() {
            var currentOrganization = OrganizationTaskGroupCtrl.currentOrganization[OrganizationTaskGroupCtrl.currentOrganization.label].ePage.Entities;

            OrganizationTaskGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Task_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitTaskGroup();
            InitTaskAction();
        }

        function InitTaskGroup() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup = {};
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.OnTaskGroupClick = OnTaskGroupClick;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.OnTaskChange = OnTaskChange;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.OnTaskGroupActionClick = OnTaskGroupActionClick;

            GetTaskGroupList();

        }

        function GetTaskGroupList() {

            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetOrgTaskGroup();
                    }
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList = [];
                }
            });
        }

        function GetOrgTaskGroup() {
            var _filter = {
                Fk_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                MappingCode: "ORG_TASK"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.Fk_2) {
                                    value1.IsChecked = true;
                                    value1.OrgTaskGroup = value2;
                                    GetTaskGroupMappingList(value1);
                                }
                            });
                        });
                    } else {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList.map(function (value, key) {
                            value.IsChecked = false;
                            value.TaskGroupMappingList = [];
                        });
                    }
                }
            });
        }

        function OnTaskGroupClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                SaveTaskGroup($item);
            } else {
                DeleteTaskGroup($item);
            }
        }

        function SaveTaskGroup($item) {
            var _item = {};
            $item.TaskGroupMappingList.map(function (value, key) {
                _item = value;
            });
            var _input = {
                Fk_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                Fk_2: $item.PK,
                Code_2: $item.ProcessName,
                Fk_3: _item.PK,
                Code_3: _item.StepCode,
                MappingCode: "ORG_TASK",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true,
                IsActive: true
            };
            apiService.post("eAxisAPI", appConfig.Entities.EntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.OrgTaskGroup = response.data.Response[0];
                        $item.IsChecked = true;
                        GetTaskGroupMappingList($item);
                    }
                }
            });
        }

        function DeleteTaskGroup($item) {
            if ($item.OrgTaskGroup) {
                var _input = $item.OrgTaskGroup;
                _input.IsModified = true;
                _input.IsDeleted = true;

                apiService.post("eAxisAPI", appConfig.Entities.EntitiesMapping.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            $item.TaskGroupMappingList = [];
                            $item.IsChecked = false;
                        }
                    }
                });
            }
        }

        function GetTaskGroupMappingList($item) {

            $item.TaskGroupMappingList = undefined;
            var _filter = {
                PSM_FK: $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkStepInfo.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepInfo.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    $item.TaskGroupMappingList = response.data.Response;

                } else {
                    $item.TaskGroupMappingList = [];
                }
            });
        }

        function OnTaskChange($item, orgTaskGrp) {
            var _taskList = {};
            orgTaskGrp.TaskGroupMappingList.map(function (value, key) {
                _taskList = value;
            });

            if ($item) {
                _taskList.StepCode = $item.StepCode;
                _taskList.PSM_FK = $item.PSM_FK;
                _taskList.StepNo = $item.StepNo;
                _taskList.StepName = $item.StepName;

            }
        }

        function OnTaskGroupActionClick($item) {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup = $item;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.IsShowTaskAction = true;

            GetPartyTypeList();
        }

        // region Task Action
        function InitTaskAction() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction = {};

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.GoToTaskGroup = GoToTaskGroup;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OnTaskActionClick = OnTaskActionClick;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OpenTaskActionModal = OpenTaskActionModal;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.CloseActionModal = CloseActionModal;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.SaveTaskActionEmailTemplate = SaveTaskActionEmailTemplate;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.DeleteTaskActionEmailTemplate = DeleteTaskActionEmailTemplate;
            // OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.SaveEventActionTaskConfig = SaveEventActionTaskConfig;
            // OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.DeleteEventActionTaskConfig = DeleteEventActionTaskConfig;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OpenJsonEditModal = OpenJsonEditModal;

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.IsShowTaskAction = false;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ContactList = OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgContact;
            // OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OnAccessChange = OnTemplateChange;
            // OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OnTemplateCodeChange = OnTemplateCodeChange;

            GetProcessTypeList();
            InitNotification();
            InitTaskConfig();


        }

        function GetProcessTypeList() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ProcessTypeList = [{
                "Code": "EditTemplate",
                "Name": "Edit Template"
            }, {
                "Code": "TaskConfig",
                "Name": "Task Config"
            }]
        }

        function GetPartyTypeList() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecParties.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList = response.data.Response;
                    if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.length > 0) {
                        GetOrgTaskEmailContactsList();

                    }
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList = [];
                }
            });
        }

        function GetOrgTaskEmailContactsList() {
            var _filter = {
                ETM_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.OrgTaskGroup.PK,
                Type: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EntitiesMappingDetail.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EntitiesMappingDetail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.PartyType_FK) {
                                    value1.IsChecked = true;
                                    value1.EmailTemplate = value2;
                                    value1.TaskConfig = value2.OtherConfig;
                                }
                            });
                        });
                    } else {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                            value.IsChecked = false;
                        });
                    }
                }
            });
        }

        function OnTaskActionClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                // SaveEventAction($item);
            } else {
                // DeleteEventGroup($item);
            }
        }

        function GoToTaskGroup() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup = undefined;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.IsShowTaskAction = false;
        }

        function TaskActionModalInstance(template) {
            return OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskActionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "org-task-action-modal right",
                scope: $scope,
                template: `<div ng-include src="'` + template + `'"></div>`
            });
        }

        function OpenTaskActionModal($item, template) {
            var _item = angular.copy($item);

            if (_item) {

                if (!_item.EmailTemplate) {
                    _item.EmailTemplate = {};
                } else {
                    if (_item.EmailTemplate.contactlist) {
                        var _email = angular.copy(_item.EmailTemplate.contactlist);
                        var _output = [];
                        if (_email.indexOf(",") != -1) {
                            _output = _email.split(",");
                        } else {
                            _output.push(_email);
                        }

                        _item.EmailTemplate.contactlist = _output;
                    }
                }
            }

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction = _item;

            TaskActionModalInstance(template).result.then(function (response) {}, function () {
                CloseActionModal();
            });
        }

        function CloseActionModal() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction = undefined;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskActionModal.dismiss('cancel');
        }

        function OpenJsonEditModal() {
            var _valueJson = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig;

            if (_valueJson !== undefined && _valueJson !== null && _valueJson !== '' && _valueJson !== ' ') {
                try {
                    if (typeof JSON.parse(_valueJson) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": _valueJson
                                    };
                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig = result;
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } catch (error) {
                    toastr.warning("Value Should be JSON format...!");
                }
            } else {
                toastr.warning("Value Should not be Empty...!");
            }
        }

        function SaveTaskActionEmailTemplate() {
            var _obj = {};
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.TaskGroupMappingList.map(function (value, key) {
                _obj = value;
            })
            if (!OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.PK) {
                var _input = {
                    ETM_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.OrgTaskGroup.PK,
                    Type: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                    EntityRefKey_FK: _obj.PK,
                    // EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                    PartyType_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK,
                    //   OtherConfig: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig,
                    contactlist: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true,
                    IsActive: true,
                    SAP_FK: authService.getUserInfo().AppPK
                };

            } else {
                var _input = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate;
                _input.IsModified = true;
            }

            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist && OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist.length > 0) {
                _input.contactlist = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist.join(",");

            }
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[0].ConfigType == 'EditTemplate') {
                _input.OtherConfig = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig;
            } else if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[0].ConfigType == 'TaskConfig') {
                _input.OtherConfig = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig;
            }

            apiService.post("eAxisAPI", appConfig.Entities.EntitiesMappingDetail.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {

                    if (response.data.Response.length > 0) {
                        var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK);

                        if (_index != -1) {
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].EmailTemplate = response.data.Response[0];
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].IsChecked = true;
                        }
                    }
                }
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskActionModal.dismiss('cancel');
            });
        }

        function DeleteTaskActionEmailTemplate() {
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK) {
                var _input = angular.copy(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate);
                _input.IsModified = true;
                _input.IsDeleted = true;

                if (_input.contactlist) {
                    _input.contactlist = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist.join(",");
                }

                apiService.post("eAxisAPI", appConfig.Entities.EntitiesMappingDetail.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK);

                        if (_index != -1) {
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].EmailTemplate = undefined;
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].IsChecked = false;
                        }
                    }
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskActionModal.dismiss('cancel');
                });
            }
        }

        // Notification
        function InitNotification() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.Notification = {};

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.Notification.OnEditNotification = OnEditNotification;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.Notification.CloseNotificationModal = CloseNotificationModal;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.Notification.PrepareNotification = PrepareNotification;
        }

        function EditNotificationModalInstance() {
            return OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.EditNotificationModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-notification-modal right",
                scope: $scope,
                template: `<div ng-include src="'OrgTaskEditNotification'"></div>`
            });
        }

        function CloseNotificationModal() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.EditNotificationModal.dismiss('cancel');
        }

        function OnEditNotification() {
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate) {
                if (!OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup = [];
                }

                if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig) {
                    if (typeof OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig == "string") {

                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup = JSON.parse(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig);
                    }
                }
            }

            EditNotificationModalInstance().result.then(function (response) {}, function () {
                CloseNotificationModal();
            });
        }

        function PrepareNotification() {
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup) {
                if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup.length > 0) {
                    var _Group = angular.copy(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup);
                    if (_Group.length > 0) {
                        _Group.map(function (value1, key1) {
                            if (value1.Attachment.length > 0) {
                                value1.Attachment.map(function (value2, key2) {
                                    delete value2.FieldNo;
                                    delete value2.FieldName;
                                });
                            }
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.Template = _Group;
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.Template = "[]";
                }
            } else {
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.Template = "[]";
            }

            CloseNotificationModal();
        }

        // Task Config
        function InitTaskConfig() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskConfig = {};
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskConfig.OnEditTaskConfig = OnEditTaskConfig;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskConfig.CloseTaskConfigModal = CloseTaskConfigModal;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskConfig.PrepareTaskConfig = PrepareTaskConfig;
        }

        function EditTaskConfigModalInstance() {
            return OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.EditTaskConfigModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-task-config-modal right",
                scope: $scope,
                template: `<div ng-include src="'OrgTaskEditTaskConfig'"></div>`
            });
        }

        function CloseTaskConfigModal() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.EditTaskConfigModal.dismiss('cancel');
        }

        function OnEditTaskConfig() {
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig) {
                if (!OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup = [];
                }

                if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig) {
                    if (typeof OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig == "string") {

                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup = JSON.parse(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig);
                    }
                }
            }

            EditTaskConfigModalInstance().result.then(function (response) {}, function () {
                CloseTaskConfigModal();
            });
        }

        function PrepareTaskConfig() {
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup) {
                if (OrganizationTaskGroupCtrl.ePage.Masters.EventAction.ActiveTaskAction.TaskConfig.TaskConfigGroup.length > 0) {
                    var _Group = angular.copy(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup);
                    if (_Group.length > 0) {
                        _Group.map(function (value1, key1) {
                            if (value1.DataSlotKey || value1.DataSlotKey == "" || value1.DataSlotKey == " ") {
                                delete value1.DataSlotKey;
                            }
                            if (value1.DataSlotValue || value1.DataSlotValue == "" || value1.DataSlotValue == " ") {
                                delete value1.DataSlotValue;
                            }
                            if (value1.QueryResults.length > 0) {
                                value1.QueryResults.map(function (value2, key2) {
                                    delete value2.FieldNo;
                                    delete value2.FieldName;
                                });
                            }
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig = _Group;
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig = "[]";
                }
            } else {
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig = "[]";
            }

            CloseTaskConfigModal();
        }

        Init();
    }
})();
