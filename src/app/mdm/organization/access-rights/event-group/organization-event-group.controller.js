(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationEventGroupController", OrganizationEventGroupController);

    OrganizationEventGroupController.$inject = ["$scope", "$uibModal", "authService", "apiService", "appConfig", "helperService", "toastr", "jsonEditModal"];

    function OrganizationEventGroupController($scope, $uibModal, authService, apiService, appConfig, helperService, toastr, jsonEditModal) {
        var OrganizationEventGroupCtrl = this;

        function Init() {
            var currentOrganization = OrganizationEventGroupCtrl.currentOrganization[OrganizationEventGroupCtrl.currentOrganization.label].ePage.Entities;

            OrganizationEventGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Event_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitEventGroup();
            InitEventAction();
        }

        // region Event Group
        function InitEventGroup() {
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup = {};

            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.OnEventGroupClick = OnEventGroupClick;
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.OnEventChange = OnEventChange;
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.OnEventGroupActionClick = OnEventGroupActionClick;

            GetEventGroupList();
        }

        function GetEventGroupList() {
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.EventGroupList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EventGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EventGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventGroup.EventGroupList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetOrgEventGroup();
                    }
                } else {
                    OrganizationEventGroupCtrl.ePage.Masters.EventGroup.EventGroupList = [];
                }
            });
        }

        function GetOrgEventGroup() {
            var _filter = {
                ORG_FK: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgEventGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgEventGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventGroup.EventGroupList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.EVG_FK) {
                                    value1.IsChecked = true;
                                    value1.OrgEventGroup = value2;
                                    GetEventGroupMappingList(value1);
                                }
                            });
                        });
                    } else {
                        OrganizationEventGroupCtrl.ePage.Masters.EventGroup.EventGroupList.map(function (value, key) {
                            value.IsChecked = false;
                            value.EventGroupMappingList = [];
                        });
                    }
                }
            });
        }

        function OnEventGroupClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                SaveEventGroup($item);
            } else {
                DeleteEventGroup($item);
            }
        }

        function SaveEventGroup($item) {
            var _input = {
                ORG_FK: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                EVG_FK: $item.PK,
                IsModified: true
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgEventGroup.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.OrgEventGroup = response.data.Response[0];
                        $item.IsChecked = true;
                        GetEventGroupMappingList($item);
                    }
                }
            });
        }

        function DeleteEventGroup($item) {
            if ($item.OrgEventGroup) {
                var _input = $item.OrgEventGroup;
                _input.IsModified = true;
                _input.IsDeleted = true;

                apiService.post("eAxisAPI", appConfig.Entities.OrgEventGroup.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            $item.EventGroupMappingList = [];
                            $item.IsChecked = false;
                        }
                    }
                });
            }
        }

        function GetEventGroupMappingList($item) {
            $item.EventGroupMappingList = undefined;
            var _filter = {
                EVG_FK: $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EventGroupMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EventGroupMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    $item.EventGroupMappingList = response.data.Response;
                } else {
                    $item.EventGroupMappingList = [];
                }
            });
        }

        function OnEventChange($item, orgEvntGrp) {
            if ($item) {
                orgEvntGrp.EventCode = $item.EVT_Code;
                orgEvntGrp.Event_FK = $item.EVT_FK;
                orgEvntGrp.EventDescription = $item.EVT_Description;
            }
        }

        function OnEventGroupActionClick($item) {
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup = $item;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.IsShowEventAction = true;

            GetPartyTypeList();
        }

        // endregion

        // region Event Action
        function InitEventAction() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction = {};

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.GoToEventGroup = GoToEventGroup;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OnEventActionClick = OnEventActionClick;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OpenEventActionModal = OpenEventActionModal;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.CloseActionModal = CloseActionModal;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.SaveEventActionEmailTemplate = SaveEventActionEmailTemplate;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.DeleteEventActionEmailTemplate = DeleteEventActionEmailTemplate;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.SaveEventActionTaskConfig = SaveEventActionTaskConfig;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.DeleteEventActionTaskConfig = DeleteEventActionTaskConfig;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OpenJsonEditModal = OpenJsonEditModal;

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.IsShowEventAction = false;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.ContactList = OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgContact;

            InitNotification();
            InitTaskConfig();
        }

        function GetPartyTypeList() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.SecParties.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList = response.data.Response;
                    if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.length > 0) {
                        GetOrgEventEmailContactsList();
                        GetOrgEventTaskList();
                    }
                } else {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList = [];
                }
            });
        }

        function GetOrgEventEmailContactsList() {
            var _filter = {
                OEG_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.OrgEventGroup.PK,
                EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgEventEmailContacts.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgEventEmailContacts.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.PartyType_FK) {
                                    value1.IsChecked = true;
                                    value1.EmailTemplate = value2;
                                }
                            });
                        });
                    } else {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                            value.IsChecked = false;
                        });
                    }
                }
            });
        }

        function GetOrgEventTaskList() {
            var _filter = {
                OEG_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.OrgEventGroup.PK,
                EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgEventTask.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgEventTask.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.PartyType_FK) {
                                    value1.IsChecked = true;
                                    value1.TaskConfig = value2;
                                }
                            });
                        });
                    } else {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                            value.IsChecked = false;
                        });
                    }
                }
            });
        }

        function OnEventActionClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                // SaveEventAction($item);
            } else {
                // DeleteEventGroup($item);
            }
        }

        function GoToEventGroup() {
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup = undefined;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.IsShowEventAction = false;
        }

        function EventActionModalInstance(template) {
            return OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "org-event-action-modal right",
                scope: $scope,
                template: `<div ng-include src="'` + template + `'"></div>`
            });
        }

        function OpenEventActionModal($item, template) {
            var _item = angular.copy($item);

            if ($item) {
                if (!_item.TaskConfig) {
                    _item.TaskConfig = {};
                }

                if (!_item.EmailTemplate) {
                    _item.EmailTemplate = {};
                } else {
                    if (_item.EmailTemplate.EmailContact) {
                        var _email = angular.copy(_item.EmailTemplate.EmailContact);
                        var _output = [];
                        if (_email.indexOf(",") != -1) {
                            _output = _email.split(",");
                        } else {
                            _output.push(_email);
                        }

                        _item.EmailTemplate.EmailContact = _output;
                    }
                }
            }

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction = _item;

            EventActionModalInstance(template).result.then(function (response) {}, function () {
                CloseActionModal();
            });
        }

        function CloseActionModal() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction = undefined;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
        }

        function OpenJsonEditModal() {
            var _valueJson = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig;

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
                                OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig = result;
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

        function SaveEventActionEmailTemplate() {
            if (!OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.PK) {
                var _input = {
                    OEG_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.OrgEventGroup.PK,
                    EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                    PartyType_FK: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK,
                    Template: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };
            } else {
                var _input = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate;
                _input.IsModified = true;
            }

            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact && OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact.length > 0) {
                _input.EmailContact = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact.join(",");
            }

            apiService.post("eAxisAPI", appConfig.Entities.OrgEventEmailContacts.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK);

                        if (_index != -1) {
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].EmailTemplate = response.data.Response[0];
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].IsChecked = true;
                        }
                    }
                }
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
            });
        }

        function DeleteEventActionEmailTemplate() {
            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.PK) {
                var _input = angular.copy(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate);
                _input.IsModified = true;
                _input.IsDeleted = true;

                if (_input.EmailContact) {
                    _input.EmailContact = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact.join(",");
                }

                apiService.post("eAxisAPI", appConfig.Entities.OrgEventEmailContacts.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK);

                        if (_index != -1) {
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].EmailTemplate = undefined;
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].IsChecked = false;
                        }
                    }
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
                });
            }
        }

        function SaveEventActionTaskConfig() {
            if (!OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.PK) {
                var _input = {
                    OEG_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.OrgEventGroup.PK,
                    EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                    PartyType_FK: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK,
                    TaskConfig: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };
            } else {
                var _input = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig;
                _input.IsModified = true;
            }

            apiService.post("eAxisAPI", appConfig.Entities.OrgEventTask.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK);

                        if (_index != -1) {
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].TaskConfig = response.data.Response[0];
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].IsChecked = true;
                        }
                    }
                }
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
            });
        }

        function DeleteEventActionTaskConfig() {
            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.PK) {
                var _input = angular.copy(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig);
                _input.IsModified = true;
                _input.IsDeleted = true;

                apiService.post("eAxisAPI", appConfig.Entities.OrgEventTask.API.Upsert.Url, [_input]).then(function (response) {
                    if (response.data.Response) {
                        var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                            return value.PK;
                        }).indexOf(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK);

                        if (_index != -1) {
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].TaskConfig = undefined;
                            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].IsChecked = false;
                        }
                    }
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
                });
            }
        }

        // endregion

        // Notification
        function InitNotification() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.Notification = {};

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.Notification.OnEditNotification = OnEditNotification;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.Notification.CloseNotificationModal = CloseNotificationModal;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.Notification.PrepareNotification = PrepareNotification;
        }

        function EditNotificationModalInstance() {
            return OrganizationEventGroupCtrl.ePage.Masters.EventAction.EditNotificationModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-notification-modal right",
                scope: $scope,
                template: `<div ng-include src="'OrgEventEditNotification'"></div>`
            });
        }

        function CloseNotificationModal() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.EditNotificationModal.dismiss('cancel');
        }

        function OnEditNotification() {
            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate) {

                if (!OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.NotificationGroup) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.NotificationGroup = [];
                }

                if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template) {
                    if (typeof OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template == "string") {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.NotificationGroup = JSON.parse(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template);
                    }
                }
            }

            EditNotificationModalInstance().result.then(function (response) {}, function () {
                CloseNotificationModal();
            });
        }

        function PrepareNotification() {
            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.NotificationGroup) {
                if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.NotificationGroup.length > 0) {
                    var _Group = angular.copy(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.NotificationGroup);

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
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template = _Group;
                } else {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template = "[]";
                }
            } else {
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template = "[]";
            }

            CloseNotificationModal();
        }

        // Task Config
        function InitTaskConfig() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.TaskConfig = {};

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.TaskConfig.OnEditTaskConfig = OnEditTaskConfig;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.TaskConfig.CloseTaskConfigModal = CloseTaskConfigModal;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.TaskConfig.PrepareTaskConfig = PrepareTaskConfig;
        }

        function EditTaskConfigModalInstance() {
            return OrganizationEventGroupCtrl.ePage.Masters.EventAction.EditTaskConfigModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-task-config-modal right",
                scope: $scope,
                template: `<div ng-include src="'OrgEventEditTaskConfig'"></div>`
            });
        }

        function CloseTaskConfigModal() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.EditTaskConfigModal.dismiss('cancel');
        }

        function OnEditTaskConfig() {
            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig) {
                if (!OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfigGroup) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfigGroup = [];
                }

                if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig) {
                    if (typeof OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig == "string") {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfigGroup = JSON.parse(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig);
                    }
                }
            }

            EditTaskConfigModalInstance().result.then(function (response) {}, function () {
                CloseTaskConfigModal();
            });
        }

        function PrepareTaskConfig() {
            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfigGroup) {
                if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfigGroup.length > 0) {
                    var _Group = angular.copy(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfigGroup);

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
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig = _Group;
                } else {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig = "[]";
                }
            } else {
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig = "[]";
            }

            CloseTaskConfigModal();
        }

        Init();
    }
})();
