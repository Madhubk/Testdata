(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEventGroup", OrganizationEventGroup);

    function OrganizationEventGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/event-group/organization-event-group.html",
            controller: "OrganizationEventGroupController",
            controllerAs: "OrganizationEventGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationEventGroupController", OrganizationEventGroupController);

    OrganizationEventGroupController.$inject = ["$scope", "$timeout", "$uibModal", "authService", "apiService", "helperService", "toastr", "organizationConfig"];

    function OrganizationEventGroupController($scope, $timeout, $uibModal, authService, apiService, helperService, toastr, organizationConfig) {
        var OrganizationEventGroupCtrl = this;

        function Init() {
            var currentOrganization = OrganizationEventGroupCtrl.currentOrganization[OrganizationEventGroupCtrl.currentOrganization.code].ePage.Entities;

            OrganizationEventGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Event_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            try {
                InitEventGroup();
                InitEventAction();
            } catch (ex) {
                console.log(ex);
            }
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
                "FilterID": organizationConfig.Entities.API.EventGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EventGroup.API.FindAll.Url, _input).then(function (response) {
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
                "FilterID": organizationConfig.Entities.API.OrgEventGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.OrgEventGroup.API.FindAll.Url, _input).then(function (response) {
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
                InsertEventGroup($item);
            } else {
                DeleteEventGroup($item);
            }
        }

        function InsertEventGroup($item) {
            var _input = {
                ORG_FK: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                EVG_FK: $item.PK,
                IsModified: true
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.OrgEventGroup.API.Insert.Url, [_input]).then(function (response) {
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
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgEventGroup.API.Delete.Url + $item.OrgEventGroup.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.EventGroupMappingList = [];
                        $item.IsChecked = false;
                    }
                }
            });
        }

        function GetEventGroupMappingList($item) {
            $item.EventGroupMappingList = undefined;
            var _filter = {
                EVG_FK: $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EventGroupMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EventGroupMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    $item.EventGroupMappingList = response.data.Response;
                } else {
                    $item.EventGroupMappingList = [];
                }
            });
        }

        function OnEventChange($item, orgEvntGrp) {
            if ($item) {
                orgEvntGrp.EventInfo = $item;

                orgEvntGrp.EventCode = $item.EVT_Code;
                orgEvntGrp.Event_FK = $item.EVT_FK;
                orgEvntGrp.EventDescription = $item.EVT_Description;
            } else {
                orgEvntGrp.EventInfo = {};
            }
        }

        function OnEventGroupActionClick($item) {
            OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup = $item;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.IsShowEventAction = true;

            GetPartiesList();
        }

        // endregion

        // region Event Action
        function InitEventAction() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction = {};

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OnPartyClick = OnPartyClick;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.UpdatePartyEventOrganizationMapping = UpdatePartyEventOrganizationMapping;

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.GoToEventGroup = GoToEventGroup;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OpenEventActionModal = OpenEventActionModal;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.CloseActionModal = CloseActionModal;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.SaveEventActionEmailTemplate = SaveEventActionEmailTemplate;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.DeleteEventActionEmailTemplate = DeleteEventActionEmailTemplate;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.SaveEventActionTaskConfig = SaveEventActionTaskConfig;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.DeleteEventActionTaskConfig = DeleteEventActionTaskConfig;

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OnRoleBtnClick = OnRoleBtnClick;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.OnRoleClick = OnRoleClick;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.UpdateOrgGroupRoleMapping = UpdateOrgGroupRoleMapping;
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.CloseEditActivityModal = CloseEditActivityModal;

            OrganizationEventGroupCtrl.ePage.Masters.EventAction.IsShowEventAction = false;

            InitNotification();
            InitTaskConfig();
        }

        function GetPartiesList() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList = response.data.Response;
                    if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.length > 0) {
                        GetMappedPartyWithOrganizationEvent();
                    }
                } else {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList = [];
                }
            });
        }

        function GetMappedPartyWithOrganizationEvent() {
            var _filter = {
                AccessTo: "EVENT",
                Access_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                AccessCode: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.EventCode,
                BasedOn: "ORG",
                BasedOn_FK: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.GroupEventTypeOrganisation.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupEventTypeOrganisation.API.FindAll.Url, _input).then(function (response) {
                var _isChecked = false;
                if (response.data.Response && response.data.Response.length > 0) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value1, key1) {
                        response.data.Response.map(function (value2, key2) {
                            if (value1.PK === value2.Item_FK) {
                                value1.IsChecked = true;
                                value1.MappingObj = value2;
                                _isChecked = true;
                            }
                        });
                    });

                    if (_isChecked == true) {
                        GetOrgEventEmailContactsList();
                        GetOrgEventTaskList();
                    }
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
                "FilterID": organizationConfig.Entities.API.OrgEventEmailContacts.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.OrgEventEmailContacts.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.IsChecked == true && value1.PK === value2.PartyType_FK) {
                                    value1.EmailTemplate = value2;
                                }
                            });
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
                "FilterID": organizationConfig.Entities.API.OrgEventTask.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.OrgEventTask.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.IsChecked == true && value1.PK === value2.PartyType_FK) {
                                    value1.TaskConfig = value2;
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
                InsertPartyEventOrganizationMapping($item);
            } else if (check == false) {
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction = $item;

                if ($item.EmailTemplate) {
                    DeleteEventActionEmailTemplate();
                }
                if ($item.TaskConfig) {
                    DeleteEventActionTaskConfig();
                }

                $timeout(function () {
                    if ($item.MappingObj) {
                        DeletePartyEventOrganizationMapping($item);
                    }
                });
            }
        }

        function InsertPartyEventOrganizationMapping($item) {
            var _input = {
                ItemName: "GRUP",
                ItemCode: $item.Code,
                Item_FK: $item.PK,
                AccessTo: "EVENT",
                Access_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                AccessCode: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.EventCode,
                BasedOn: "ORG",
                BasedOn_FK: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode,
                TNT_FK: authService.getUserInfo().TenantPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupEventTypeOrganisation.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    var _response = response.data.Response[0];
                    var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.Item_FK);

                    if (_index != -1) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].IsChecked = true;
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].MappingObj = _response;
                    }
                }
            });
        }

        function UpdatePartyEventOrganizationMapping($event, $item, key) {
            var _input = $item.MappingObj;
            _input.IsModified = true;

            apiService.post("authAPI", organizationConfig.Entities.API.GroupEventTypeOrganisation.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {}
            });
        }

        function DeletePartyEventOrganizationMapping($item) {
            apiService.get("authAPI", organizationConfig.Entities.API.GroupEventTypeOrganisation.API.Delete.Url + $item.MappingObj.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {}
            });
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
                windowClass: "org-event-action-modal org-email-config-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'` + template + `'"></div>`
            });
        }

        function OpenEventActionModal($item, template) {
            var _item = angular.copy($item);
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.ContactList = OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgContact;

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

        function SaveEventActionEmailTemplate() {
            var _apiMethod;
            if (!OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.PK) {
                var _input = {
                    OEG_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.OrgEventGroup.PK,
                    EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                    PartyType_FK: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK,
                    Template: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.Template,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };
                _apiMethod = "Insert";
            } else {
                var _input = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate;
                _input.IsModified = true;
                _apiMethod = "Update";
            }

            if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact && typeof OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact == "object" && OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact.length > 0) {
                _input.EmailContact = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.EmailContact.join(",");
            }

            if (_apiMethod == "Insert") {
                _input = [_input];
            }

            apiService.post("eAxisAPI", organizationConfig.Entities.API.OrgEventEmailContacts.API[_apiMethod].Url, _input).then(function (response) {
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
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgEventEmailContacts.API.Delete.Url + OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.EmailTemplate.PK).then(function (response) {
                if (response.data.Response) {
                    var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK);

                    if (_index != -1) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].EmailTemplate = undefined;
                    }
                }
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
            });
        }

        function SaveEventActionTaskConfig() {
            var _apiMethod;
            if (!OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.PK) {
                var _input = {
                    OEG_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.OrgEventGroup.PK,
                    EVT_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                    PartyType_FK: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK,
                    TaskConfig: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.TaskConfig,
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };
                _apiMethod = "Insert";
            } else {
                var _input = OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig;
                _input.IsModified = true;
                _apiMethod = "Update";
            }

            if (_apiMethod == "Insert") {
                _input = [_input];
            }

            apiService.post("eAxisAPI", organizationConfig.Entities.API.OrgEventTask.API[_apiMethod].Url, _input).then(function (response) {
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
            apiService.get("eAxisAPI", organizationConfig.Entities.API.OrgEventTask.API.Delete.Url + OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.TaskConfig.PK).then(function (response) {
                if (response.data.Response) {
                    var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveEventAction.PK);

                    if (_index != -1) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.PartyTypeList[_index].TaskConfig = undefined;
                    }
                }
                OrganizationEventGroupCtrl.ePage.Masters.EventAction.EventActionModal.dismiss('cancel');
            });
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

        // Party Role Mapping
        function OnRoleBtnClick($item) {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty = angular.copy($item);

            GetRoleList();
        }

        function GetRoleList() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList = undefined;
            var _filter = {
                "SAP_Code": authService.getUserInfo().AppCode,
                "PartyCode": OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.Code,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.SecMappings.API.GetRoleByUserApp.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecMappings.API.GetRoleByUserApp.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList = response.data.Response;

                    if (OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList.length > 0) {
                        GetPartyRoleMappingList();
                    } else {
                        toastr.warning("No Role mapped with this Party...!");
                    }
                } else {
                    OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList = [];
                    toastr.warning("No Role mapped with this Party...!");
                }
            });
        }

        function GetPartyRoleMappingList() {
            var _filter = {
                "ItemName": "GRUP",
                "ItemCode": OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.Code,
                "Item_FK": OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.PK,

                "BasedOn": "EVENT",
                "BasedOn_FK": OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                "BasedOnCode": OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.EventCode,

                "OtherEntitySource": "ORG",
                "OtherEntity_FK": OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                "OtherEntityCode": OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,

                "TenantCode": authService.getUserInfo().TenantCode,
                "SAP_Code": authService.getUserInfo().AppCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.GroupRoleEventTypeOrganisation.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupRoleEventTypeOrganisation.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList.map(function (value1, key1) {
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
            return OrganizationEventGroupCtrl.ePage.Masters.EventAction.EditPartyRoleMappingModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "org-party-role-mapping-modal right",
                scope: $scope,
                template: `<div ng-include src="'PartyRoleMappingOrgEvent'"></div>`
            });
        }

        function CloseEditActivityModal() {
            OrganizationEventGroupCtrl.ePage.Masters.EventAction.EditPartyRoleMappingModal.dismiss('cancel');
        }

        function OnRoleClick($event, $item) {
            var checkbox = $event.target,
                check = checkbox.checked;

            if (check == true) {
                InsertOrgGroupRoleMapping($item);
            } else if (check == false) {
                var _isExist = OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList.some(function (value, key) {
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
                ItemCode: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.Code,
                Item_FK: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.PK,
                AccessTo: "ROLE",
                Access_FK: $item.PK,
                AccessCode: $item.Code,
                BasedOn: "EVENT",
                BasedOn_FK: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.Event_FK,
                BasedOnCode: OrganizationEventGroupCtrl.ePage.Masters.EventGroup.ActiveEventGroup.EventCode,
                OtherEntitySource: "ORG",
                OtherEntity_FK: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                OtherEntityCode: OrganizationEventGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                AdditionalEntitySource: "PARENT",
                AdditionalEntityCode: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.MappingObj.MappingCode,
                AdditionalEntity_FK: OrganizationEventGroupCtrl.ePage.Masters.EventAction.ActiveParty.MappingObj.PK,
                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode,
                TNT_FK: authService.getUserInfo().TenantPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true
            };

            apiService.post("authAPI", organizationConfig.Entities.API.GroupRoleEventTypeOrganisation.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    var _response = response.data.Response[0];
                    var _index = OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_response.Access_FK);

                    if (_index != -1) {
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList[_index].IsChecked = true;
                        OrganizationEventGroupCtrl.ePage.Masters.EventAction.RoleList[_index].MappingObj = _response;
                    }
                }
            });
        }

        function UpdateOrgGroupRoleMapping($event, $item) {
            var _input = $item.MappingObj;
            _input.IsModified = true;

            apiService.post("authAPI", organizationConfig.Entities.API.GroupRoleEventTypeOrganisation.API.Update.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {}
                }
            });
        }

        function DeleteOrgGroupRoleMapping($item) {
            apiService.get("authAPI", organizationConfig.Entities.API.GroupRoleEventTypeOrganisation.API.Delete.Url + $item.MappingObj.PK).then(function SuccessCallback(response) {
                if (response.data.Response) {}
            });
        }

        Init();
    }
})();
