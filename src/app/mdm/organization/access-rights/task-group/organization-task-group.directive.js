(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationTaskGroup", OrganizationTaskGroup);

    function OrganizationTaskGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/task-group/organization-task-group.html",
            controller: "OrganizationTaskGroupController",
            controllerAs: "OrganizationTaskGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationTaskGroupController", OrganizationTaskGroupController);

    OrganizationTaskGroupController.$inject = ["$scope", "$uibModal", "$timeout", "authService", "apiService", "helperService", "toastr", "organizationConfig"];

    function OrganizationTaskGroupController($scope, $uibModal, $timeout, authService, apiService, helperService, toastr, organizationConfig) {
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

            try {
                InitTaskGroup();
                InitTaskAction();
            } catch (ex) {
                console.log(ex);
            }
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
                "FilterID": organizationConfig.Entities.API.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetOrgTaskGroupMapping();
                    }
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList = [];
                }
            });
        }

        function GetOrgTaskGroupMapping() {
            var _filter = {
                Fk_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                MappingCode: "ORG_TASK"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.TaskGroupList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.Fk_2) {
                                    value1.IsChecked = true;
                                    value1.OrgTaskGroup = value2;
                                    GetTaskGroupStepList(value1);
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

        function GetTaskGroupStepList($item) {
            $item.TaskGroupMappingList = undefined;
            var _filter = {
                PSM_FK: $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EBPMWorkStepInfo.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EBPMWorkStepInfo.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    $item.TaskGroupMappingList = response.data.Response;
                } else {
                    $item.TaskGroupMappingList = [];
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
            var _input = {
                Fk_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                Fk_2: $item.PK,
                Code_2: $item.ProcessName,
                // Fk_3: _item.PK,
                // Code_3: _item.StepCode,
                MappingCode: "ORG_TASK",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true,
                IsActive: true
            };
            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.OrgTaskGroup = response.data.Response[0];
                        $item.IsChecked = true;
                        GetTaskGroupStepList($item);
                    }
                }
            });
        }

        function DeleteTaskGroup($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Delete.Url + $item.OrgTaskGroup.PK).then(function (response) {
                if (response.data.Response) {
                    $item.TaskGroupMappingList = [];
                    $item.IsChecked = false;
                }
            });
        }

        function OnTaskChange($item, orgTaskGrp) {
            if ($item) {
                orgTaskGrp.StepInfo = $item;

                orgTaskGrp.StepCode = $item.StepCode;
                orgTaskGrp.Step_FK = $item.PK;
                orgTaskGrp.StepDescription = $item.StepName;
            } else {
                orgTaskGrp.StepInfo = {};
            }
        }

        function OnTaskGroupActionClick($item) {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup = $item;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.IsShowTaskAction = true;

            GetPartiesList();
        }

        // region Task Action
        function InitTaskAction() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction = {};

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OnPartyClick = OnPartyClick;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.UpdatePartyTaskOrganizationMapping = UpdatePartyTaskOrganizationMapping;

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.GoToTaskGroup = GoToTaskGroup;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OpenTaskActionModal = OpenTaskActionModal;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.CloseActionModal = CloseActionModal;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.SaveTaskOrTemplateConfig = SaveTaskOrTemplateConfig;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.DeleteTaskOrTemplateConfig = DeleteTaskOrTemplateConfig;

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OnRoleBtnClick = OnRoleBtnClick;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.OnRoleClick = OnRoleClick;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.UpdateOrgGroupRoleMapping = UpdateOrgGroupRoleMapping;
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.CloseEditActivityModal = CloseEditActivityModal;

            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.IsShowTaskAction = false;

            GetProcessTypeList();
            InitNotification();
            InitTaskConfig();
        }

        function GetProcessTypeList() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ProcessTypeList = [{
                "Code": "TemplateConfig",
                "Name": "Template Config"
            }, {
                "Code": "TaskConfig",
                "Name": "Task Config"
            }];
        }

        function GetPartiesList() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList = response.data.Response;
                    if (response.data.Response.length > 0) {
                        GetMappedPartyWithOrganizationTask();
                    }
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList = [];
                }
            });
        }

        function GetMappedPartyWithOrganizationTask() {
            var _filter = {
                AccessTo: "TASK",
                Access_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.Step_FK,
                AccessCode: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                BasedOn: "ORG",
                BasedOn_FK: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.GroupTaskTypeOrganisation.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupTaskTypeOrganisation.API.FindAll.Url, _input).then(function (response) {
                var _isChecked = false;
                if (response.data.Response && response.data.Response.length > 0) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value1, key1) {
                        response.data.Response.map(function (value2, key2) {
                            if (value1.PK === value2.Item_FK) {
                                value1.IsChecked = true;
                                value1.MappingObj = value2;
                                _isChecked = true;
                            }
                        });
                    });

                    if (_isChecked == true) {
                        GetOrgTaskAndTemplateConfig();
                    }
                }
            });
        }

        function GetOrgTaskAndTemplateConfig() {
            var _filter = {
                ETM_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.OrgTaskGroup.PK,
                Type: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EntitiesMappingDetail.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMappingDetail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.IsChecked == true && value1.PK === value2.PartyType_FK) {
                                    value1.EmailTemplate = angular.copy(value2);
                                    value1.TaskConfig = angular.copy(value2);

                                    if (value2.contactlist) {
                                        value1.EmailTemplate.OtherConfig = value2.OtherConfig;
                                        value1.TaskConfig.OtherConfig = null;
                                    } else {
                                        value1.EmailTemplate.OtherConfig = null;
                                        value1.TaskConfig.OtherConfig = value2.OtherConfig;
                                    }
                                }
                            });
                        });
                    }
                }
            });
        }

        function OnPartyClick($event, $item) {
            var checkbox = $event.target,
                check = checkbox.checked;

            if (check == true) {
                InsertPartyTaskOrganizationMapping($item);
            } else if (check == false) {
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction = $item;

                if (($item.EmailTemplate && $item.EmailTemplate.OtherConfig) || ($item.TaskConfig && $item.TaskConfig.OtherConfig)) {
                    DeleteTaskOrTemplateConfig();
                }

                $timeout(function () {
                    if ($item.MappingObj) {
                        DeletePartyTaskOrganizationMapping($item);
                    }
                });
            }
        }

        function InsertPartyTaskOrganizationMapping($item) {
            var _input = {
                ItemName: "GRUP",
                ItemCode: $item.Code,
                Item_FK: $item.PK,
                AccessTo: "TASK",
                Access_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.Step_FK,
                AccessCode: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                BasedOn: "ORG",
                BasedOn_FK: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode,
                TNT_FK: authService.getUserInfo().TenantPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupTaskTypeOrganisation.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    var _response = response.data.Response[0];
                    var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.Item_FK);

                    if (_index != -1) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].IsChecked = true;
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].MappingObj = _response;
                    }
                }
            });
        }

        function UpdatePartyTaskOrganizationMapping($event, $item, key) {
            var _input = $item.MappingObj;
            _input.IsModified = true;

            apiService.post("authAPI", organizationConfig.Entities.API.GroupTaskTypeOrganisation.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {}
            });
        }

        function DeletePartyTaskOrganizationMapping($item) {
            apiService.get("authAPI", organizationConfig.Entities.API.GroupTaskTypeOrganisation.API.Delete.Url + $item.MappingObj.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {}
            });
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
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ContactList = OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgContact;

            if (_item) {
                if (!_item.TaskConfig) {
                    _item.TaskConfig = {};
                }

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

        function SaveTaskOrTemplateConfig() {
            if (!OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.PK) {
                var _input = {
                    ETM_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.OrgTaskGroup.PK,
                    Type: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                    PartyType_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK,
                    contactlist: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist,
                    EntityRefKey_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.Step_FK,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true,
                    IsActive: true,
                    SAP_FK: authService.getUserInfo().AppPK
                };
            } else {
                var _input = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate;
                _input.IsModified = true;
            }

            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist && (typeof OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist == "object" && OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist.length > 0)) {
                _input.contactlist = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.contactlist.join(",");
            }

            var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                return value.PK;
            }).indexOf(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK);

            if (_index != -1) {
                if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].ConfigType == 'TemplateConfig') {
                    _input.OtherConfig = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig;
                } else if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].ConfigType == 'TaskConfig') {
                    _input.OtherConfig = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig;
                    _input.contactlist = null;
                }
            }

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMappingDetail.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK);

                    if (_index != -1) {
                        var _response = response.data.Response[0];

                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].EmailTemplate = angular.copy(_response);
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].TaskConfig = angular.copy(_response);

                        if (_response.contactlist) {
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].EmailTemplate.OtherConfig = _response.OtherConfig;
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].TaskConfig.OtherConfig = null;
                        } else {
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].EmailTemplate.OtherConfig = null;
                            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].TaskConfig.OtherConfig = _response.OtherConfig;
                        }
                    }
                }
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskActionModal.dismiss('cancel');
            });
        }

        function DeleteTaskOrTemplateConfig() {
            var _pk;
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate) {
                _pk = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.PK;
            } else if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig) {
                _pk = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.PK;
            }

            apiService.get("eAxisAPI", organizationConfig.Entities.API.EntitiesMappingDetail.API.Delete.Url + _pk).then(function (response) {
                if (response.data.Response) {
                    var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.PK);

                    if (_index != -1) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].EmailTemplate = undefined;
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.PartyTypeList[_index].TaskConfig = undefined;
                    }
                }
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.TaskActionModal.dismiss('cancel');
            });
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
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup && OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup.length > 0) {
                var _Group = angular.copy(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.NotificationGroup);
                _Group.map(function (value1, key1) {
                    if (value1.Attachment.length > 0) {
                        value1.Attachment.map(function (value2, key2) {
                            delete value2.FieldNo;
                            delete value2.FieldName;
                        });
                    }
                });

                if (typeof _Group == "object") {
                    _Group = JSON.stringify(_Group);
                }
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig = _Group;
            } else {
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.EmailTemplate.OtherConfig = "[]";
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
            if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup && OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup.length > 0) {
                var _Group = angular.copy(OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.TaskConfigGroup);
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

                if (typeof _Group == "object") {
                    _Group = JSON.stringify(_Group);
                }
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig = _Group;
            } else {
                OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveTaskAction.TaskConfig.OtherConfig = "[]";
            }

            CloseTaskConfigModal();
        }

        // Party Role Mapping
        function OnRoleBtnClick($item) {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty = angular.copy($item);

            GetRoleList();
        }

        function GetRoleList() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList = undefined;
            var _filter = {
                "SAP_Code": authService.getUserInfo().AppCode,
                "PartyCode": OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.Code,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.SecMappings.API.GetRoleByUserApp.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecMappings.API.GetRoleByUserApp.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList = response.data.Response;

                    if (OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList.length > 0) {
                        GetPartyRoleMappingList();
                    } else {
                        toastr.warning("No Role mapped with this Party...!");
                    }
                } else {
                    OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList = [];
                    toastr.warning("No Role mapped with this Party...!");
                }
            });
        }

        function GetPartyRoleMappingList() {
            var _filter = {
                "ItemName": "GRUP",
                "ItemCode": OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.Code,
                "Item_FK": OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.PK,

                "BasedOn": "TASK",
                "BasedOn_FK": OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.Step_FK,
                "BasedOnCode": OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,

                "OtherEntitySource": "ORG",
                "OtherEntity_FK": OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                "OtherEntityCode": OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,

                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_Code": authService.getUserInfo().AppCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.GroupRoleTaskTypeOrganisation.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupRoleTaskTypeOrganisation.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.Access_FK) {
                                    value1.IsChecked = true;
                                    value1.MappingObj = value2;
                                }
                            });
                        });
                    }

                    EditPartyRoleModalInstance().result.then(function (response) {}, function () {
                        console.log("Cancelled");
                    });
                }
            });
        }

        function EditPartyRoleModalInstance() {
            return OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.EditPartyRoleMappingModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "org-party-role-mapping-modal right",
                scope: $scope,
                template: `<div ng-include src="'PartyRoleMappingOrgTask'"></div>`
            });
        }

        function CloseEditActivityModal() {
            OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.EditPartyRoleMappingModal.dismiss('cancel');
        }

        function OnRoleClick($event, $item) {
            var checkbox = $event.target,
                check = checkbox.checked;

            if (check == true) {
                InsertOrgGroupRoleMapping($item);
            } else if (check == false) {
                var _isExist = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList.some(function (value, key) {
                    return value.IsChecked;
                });
                if (_isExist) {
                    DeleteOrgGroupRoleMapping($item);
                } else {
                    $item.IsChecked = true;
                    toastr.warning("Could not delete... Minimum One Role Required...!");
                }
            }
        }

        function InsertOrgGroupRoleMapping($item) {
            var _input = {
                ItemName: "GRUP",
                ItemCode: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.Code,
                Item_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.PK,
                AccessTo: "ROLE",
                Access_FK: $item.PK,
                AccessCode: $item.Code,
                BasedOn: "TASK",
                BasedOn_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.Step_FK,
                BasedOnCode: OrganizationTaskGroupCtrl.ePage.Masters.TaskGroup.ActiveTaskGroup.StepCode,
                OtherEntitySource: "ORG",
                OtherEntity_FK: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                OtherEntityCode: OrganizationTaskGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                AdditionalEntitySource: "PARENT",
                AdditionalEntityCode: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.MappingObj.MappingCode,
                AdditionalEntity_FK: OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.ActiveParty.MappingObj.PK,
                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode,
                TNT_FK: authService.getUserInfo().TenantPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupRoleTaskTypeOrganisation.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    var _response = response.data.Response[0];
                    var _index = OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.Access_FK);

                    if (_index != -1) {
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList[_index].IsChecked = true;
                        OrganizationTaskGroupCtrl.ePage.Masters.TaskAction.RoleList[_index].MappingObj = _response;
                    }
                }
            });
        }

        function UpdateOrgGroupRoleMapping($event, $item) {
            var _input = $item.MappingObj;
            _input.IsModified = true;

            apiService.post("authAPI", organizationConfig.Entities.API.GroupRoleTaskTypeOrganisation.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {}
                }
            });
        }

        function DeleteOrgGroupRoleMapping($item) {
            apiService.get("authAPI", organizationConfig.Entities.API.GroupRoleTaskTypeOrganisation.API.Delete.Url + $item.MappingObj.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {}
            });
        }

        Init();
    }
})();
