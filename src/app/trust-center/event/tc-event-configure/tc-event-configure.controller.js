(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEventConfigureController", TCEventConfigureController);

    TCEventConfigureController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "eventConfig", "confirmation", "trustCenterConfig", "jsonEditModal"];

    function TCEventConfigureController($scope, $location, $uibModal, authService, apiService, helperService, toastr, eventConfig, confirmation, trustCenterConfig, jsonEditModal) {
        /* jshint validthis: true */
        var TCEventConfigureCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            var currentEvent = TCEventConfigureCtrl.currentEvent[TCEventConfigureCtrl.currentEvent.label].ePage.Entities;

            TCEventConfigureCtrl.ePage = {
                "Title": "",
                "Prefix": "Event_Configure",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentEvent,
            };

            TCEventConfigureCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCEventConfigureCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCEventConfigureCtrl.ePage.Masters.QueryString.AppPk) {
                    InitParties();
                    InitRule();
                    InitEventGroupMapping();
                    InitEventGroup();
                    InitEvent();
                }

                TCEventConfigureCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "EventMaster",
                    ObjectId: TCEventConfigureCtrl.ePage.Entities.Header.Data.PK
                };
                TCEventConfigureCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };
            } catch (error) {
                console.log(error)
            }

            TCEventConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
            TCEventConfigureCtrl.ePage.Masters.IsDisableSave = false;

            TCEventConfigureCtrl.ePage.Masters.SaveEvent = SaveEvent;
        }

        // region Event
        function InitEvent() {
            TCEventConfigureCtrl.ePage.Masters.Event = {};
            TCEventConfigureCtrl.ePage.Masters.Event.FormView = {};
            TCEventConfigureCtrl.ePage.Masters.Event.OnPartyTypeChange = OnPartyTypeChange;
            TCEventConfigureCtrl.ePage.Masters.Event.OpenJsonModal = OpenJsonModal;

            TCEventConfigureCtrl.ePage.Masters.Event.FormView = angular.copy(TCEventConfigureCtrl.ePage.Entities.Header.Data);

            GetPartiesList();

            var _isEmpty = angular.equals({}, TCEventConfigureCtrl.ePage.Masters.Event.FormView);

            if (!_isEmpty) {
                PreparePartyMappingInput();
                GetEventConfigFieldsList();
                GetEventConfigList();
                GetEventGroupList();
            } else {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.Priority = "1";
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.EntitySource = "GENERAL";
            }

            if (eventConfig.Entities.Header.Meta.Module.ListSource.length > 0) {
                TCEventConfigureCtrl.ePage.Masters.Event.ModuleListSource = eventConfig.Entities.Header.Meta.Module.ListSource;
            } else {
                GetModuleList();
            }

            InitNotification();
            InitTaskConfig();
        }

        function GetModuleList() {
            TCEventConfigureCtrl.ePage.Masters.Event.ModuleListSource = undefined;
            var _filter = {
                "TypeCode": "MODULE_MASTER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.CfxTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.CfxTypes.API.FindAll.Url + TCEventConfigureCtrl.ePage.Masters.QueryString.AppPk, _input).then(function (response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.Event.ModuleListSource = response.data.Response;
                    eventConfig.Entities.Header.Meta.Module.ListSource = response.data.Response;

                    // TCEventConfigureCtrl.ePage.Masters.Event.FormView.Module = TCEventConfigureCtrl.ePage.Masters.Event.ModuleListSource[2].Key;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Event.ModuleListSource = [];
                    eventConfig.Entities.Header.Meta.Module.ListSource = [];
                }
            });
        }

        function OnPartyTypeChange($item) {
            if ($item) {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.PartyType_Code = $item.GroupName;
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.PartyType_FK = $item.PK;
            } else {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.PartyType_Code = undefined;
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.PartyType_FK = undefined;
            }
        }

        function SaveEvent() {
            TCEventConfigureCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TCEventConfigureCtrl.ePage.Masters.IsDisableSave = true;

            var _input = TCEventConfigureCtrl.ePage.Masters.Event.FormView;
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventMaster.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, TCEventConfigureCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = eventConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            eventConfig.TabList[_index].label = TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code;
                            eventConfig.TabList[_index].code = TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code;
                            eventConfig.TabList[_index][TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code] = eventConfig.TabList[_index]["New"];

                            delete eventConfig.TabList[_index]["New"];

                            eventConfig.TabList[_index][TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code].ePage.Entities.Header.Data = TCEventConfigureCtrl.ePage.Masters.Event.FormView;

                            PreparePartyMappingInput();
                            GetEventConfigFieldsList();
                            GetEventConfigList();
                        }
                    }
                }

                TCEventConfigureCtrl.ePage.Masters.SaveButtonText = "Save";
                TCEventConfigureCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function OpenJsonModal(objName) {
            var _json = TCEventConfigureCtrl.ePage.Masters.Event.FormView[objName];
            if (_json !== undefined && _json !== null && _json !== '' && _json !== ' ') {
                try {
                    if (typeof JSON.parse(_json) == "object") {
                        var modalDefaults = {
                            resolve: {
                                param: function () {
                                    var exports = {
                                        "Data": TCEventConfigureCtrl.ePage.Masters.Event.FormView[objName]
                                    };

                                    return exports;
                                }
                            }
                        };

                        jsonEditModal.showModal(modalDefaults, {})
                            .then(function (result) {
                                TCEventConfigureCtrl.ePage.Masters.Event.FormView[objName] = result;
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

        // Notification
        function InitNotification() {
            TCEventConfigureCtrl.ePage.Masters.Event.Notification = {};

            TCEventConfigureCtrl.ePage.Masters.Event.Notification.OnEditNotification = OnEditNotification;
            TCEventConfigureCtrl.ePage.Masters.Event.Notification.CloseNotificationModal = CloseNotificationModal;
            TCEventConfigureCtrl.ePage.Masters.Event.Notification.PrepareNotification = PrepareNotification;
        }

        function EditNotificationModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Event.EditNotificationModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-notification-modal right",
                scope: $scope,
                template: `<div ng-include src="'TCEventEditNotification'"></div>`
            });
        }

        function CloseNotificationModal() {
            TCEventConfigureCtrl.ePage.Masters.Event.EditNotificationModal.dismiss('cancel');
        }

        function OnEditNotification() {
            if (!TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup) {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup = [];
            }

            if (TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationConfig) {
                if (typeof TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationConfig == "string") {
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationConfig);
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup = [];
            }

            EditNotificationModalInstance().result.then(function (response) {}, function () {
                CloseNotificationModal();
            });
        }

        function PrepareNotification() {
            if (TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup) {
                if (TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup.length > 0) {
                    var _Group = angular.copy(TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationGroup);

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
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationConfig = _Group;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationConfig = "[]";
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.NotificationConfig = "[]";
            }

            CloseNotificationModal();
        }

        // Task Config
        function InitTaskConfig() {
            TCEventConfigureCtrl.ePage.Masters.Event.TaskConfig = {};

            TCEventConfigureCtrl.ePage.Masters.Event.TaskConfig.OnEditTaskConfig = OnEditTaskConfig;
            TCEventConfigureCtrl.ePage.Masters.Event.TaskConfig.CloseTaskConfigModal = CloseTaskConfigModal;
            TCEventConfigureCtrl.ePage.Masters.Event.TaskConfig.PrepareTaskConfig = PrepareTaskConfig;
        }

        function EditTaskConfigModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Event.EditTaskConfigModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-task-config-modal right",
                scope: $scope,
                template: `<div ng-include src="'TCEventEditTaskConfig'"></div>`
            });
        }

        function CloseTaskConfigModal() {
            TCEventConfigureCtrl.ePage.Masters.Event.EditTaskConfigModal.dismiss('cancel');
        }

        function OnEditTaskConfig() {
            if (!TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup) {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup = [];
            }

            if (TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfig) {
                if (typeof TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfig == "string") {
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfig);
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup = []
            }

            EditTaskConfigModalInstance().result.then(function (response) {}, function () {
                CloseTaskConfigModal();
            });
        }

        function PrepareTaskConfig() {
            if (TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup) {
                if (TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup.length > 0) {
                    var _Group = angular.copy(TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfigGroup);

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
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfig = _Group;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfig = "[]";
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Event.FormView.TaskConfig = "[]";
            }

            CloseTaskConfigModal();
        }

        // endregion

        // region Parties
        function InitParties() {
            TCEventConfigureCtrl.ePage.Masters.Parties = {};
        }

        function PreparePartyMappingInput() {
            TCEventConfigureCtrl.ePage.Masters.Parties.MappingInput = {
                MappingCode: "GRUP_EVTYP_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_EVTYP_APP_TNT",

                AccessTo: "EVENT",
                Access_FK: TCEventConfigureCtrl.ePage.Masters.Event.FormView.PK,
                AccessCode: TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code,

                SAP_FK: TCEventConfigureCtrl.ePage.Masters.QueryString.AppPk,
                SAP_Code: TCEventConfigureCtrl.ePage.Masters.QueryString.AppCode,

                PartyMappingAPI: "GroupEventType",
                PartyRoleMappingAPI: "GroupRoleEventType"
            };
        }

        function GetPartiesList() {
            TCEventConfigureCtrl.ePage.Masters.Parties.PartiesListSource = undefined;
            var _filter = {
                "SAP_FK": TCEventConfigureCtrl.ePage.Masters.QueryString.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.SecParties.API.FindAll.FilterID
            };

            apiService.post("authAPI", trustCenterConfig.Entities.API.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.Parties.PartiesListSource = response.data.Response;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Parties.PartiesListSource = [];
                }
            });
        }
        // endregion

        // region Rule
        function InitRule() {
            TCEventConfigureCtrl.ePage.Masters.Rule = {};

            TCEventConfigureCtrl.ePage.Masters.Rule.AddNewEventConfigField = AddNewEventConfigField;
            TCEventConfigureCtrl.ePage.Masters.Rule.EditEventConfigField = EditEventConfigField;
            TCEventConfigureCtrl.ePage.Masters.Rule.CloseEventConfigFields = CloseEventConfigFields;
            TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsSave = EventConfigFieldsSave;
            TCEventConfigureCtrl.ePage.Masters.Rule.OnConfigChange = OnConfigChange;

            TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigSaveBtnText = "Save";
            TCEventConfigureCtrl.ePage.Masters.Rule.IsDisableEventConfigSaveBtn = false;

            TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = [];

            InitExpression();
            InitRelatedInput();
            InitUpdateRules();
        }

        function GetEventConfigList() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigListSource = undefined;
            var _filter = {
                "ConfigType": "Event",
                "TenantCode": authService.getUserInfo().TenantCode,
                "AppCode": TCEventConfigureCtrl.ePage.Masters.QueryString.AppCode,
                "SAP_FK": TCEventConfigureCtrl.ePage.Masters.QueryString.AppPk,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfig.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfig.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigListSource = response.data.Response;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigListSource = [];
                }
            });
        }

        function OnConfigChange($item) {
            if ($item) {
                GetFieldList($item);
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = [];
            }
        }

        function GetFieldList($item) {
            TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = undefined;
            var _filter = {
                "SAP_FK": TCEventConfigureCtrl.ePage.Masters.QueryString.AppPk,
                "TableName": $item.ClassSource
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = response.data.Response;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = [];
                }
            });
        }

        function GetEventConfigFieldsList() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsListSource = undefined;
            var _filter = {
                "DAC_ConfigType": "Event",
                "External_Code": TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code,
                "External_FK": TCEventConfigureCtrl.ePage.Masters.Event.FormView.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsListSource = response.data.Response;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsListSource = [];
                }
            });
        }

        function AddNewEventConfigField($item, type) {
            TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField = {
                DAC_ConfigType: "Event",
                ExpressionType: "GENERAL",
                EntitySource: "GENERAL",
                EntityRefCode: "General",
                External_Code: TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code,
                External_FK: TCEventConfigureCtrl.ePage.Masters.Event.FormView.PK
            };

            if (type !== "Main") {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Self_FK = $item.PK;
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.External_Code = $item.External_Code;
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.External_FK = $item.External_FK;

                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ItemType = TCEventConfigureCtrl.ePage.Masters.Rule.Expression.ItemTypeList[0];
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ItemType = "Main";
            }

            TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = [];

            EditEventConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditEventConfigField($item) {
            TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField = angular.copy($item);

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput != '' && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput != ' ') {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput);
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = JSON.stringify(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput, undefined, 2);
            }

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression != '' && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression != ' ') {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression);
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = JSON.stringify(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression, undefined, 2);
            }

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules != '' && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules != ' ') {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules);
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = JSON.stringify(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules, undefined, 2);
            }

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.DAC_FK) {
                var _index = TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigListSource.map(function (value, key) {
                    return value.PK;
                }).indexOf(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.DAC_FK);

                if (_index != -1) {
                    GetFieldList(TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigListSource[_index])
                }
            }

            TCEventConfigureCtrl.ePage.Masters.Rule.FieldNameList = [];

            EditEventConfigModalInstance().result.then(function (response) {}, function () {});
        }

        function EditEventConfigModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Rule.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-modal right",
                scope: $scope,
                template: `<div ng-include src="'EventConfigFields'"></div>`
            });
        }

        function CloseEventConfigFields() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EditModal.dismiss('cancel');
        }

        function EventConfigFieldsSave() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigSaveBtnText = "Please Wait...";
            TCEventConfigureCtrl.ePage.Masters.Rule.IsDisableEventConfigSaveBtn = true;

            var _input = angular.copy(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField);
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigFields.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.PK) {
                            var _index = TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsListSource.map(function (value, key) {
                                return value.PK;
                            }).indexOf(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.PK);

                            if (_index !== -1) {
                                TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsListSource[_index] = response.data.Response[0];
                            }
                        } else {
                            TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigFieldsListSource.push(response.data.Response[0]);
                        }

                        CloseEventConfigFields();
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCEventConfigureCtrl.ePage.Masters.Rule.EventConfigSaveBtnText = "Save";
                TCEventConfigureCtrl.ePage.Masters.Rule.IsDisableEventConfigSaveBtn = false;
            });
        }

        // Expression
        function InitExpression() {
            TCEventConfigureCtrl.ePage.Masters.Rule.Expression = {};

            TCEventConfigureCtrl.ePage.Masters.Rule.Expression.ItemTypeList = ["Segment"];
            TCEventConfigureCtrl.ePage.Masters.Rule.Expression.ExpressionTypeList = ["GENERAL", "EXPRESSION"];

            TCEventConfigureCtrl.ePage.Masters.Rule.Expression.OnEditExpression = OnEditExpression;
            TCEventConfigureCtrl.ePage.Masters.Rule.Expression.CloseEditExpressionModal = CloseEditExpressionModal;
            TCEventConfigureCtrl.ePage.Masters.Rule.Expression.PrepareExpression = PrepareExpression;
        }

        function EditExpressionModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Rule.EditExpressionModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-expression-modal right",
                scope: $scope,
                template: `<div ng-include src="'editExpression'"></div>`
            });
        }

        function CloseEditExpressionModal() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EditExpressionModal.dismiss('cancel');

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression != '' && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression != ' ') {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression);
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = JSON.stringify(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression, undefined, 2);
            }
        }

        function OnEditExpression() {
            if (!TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup) {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup = [];
            }

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression) {
                if (typeof TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression == "string") {
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression);
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup = [];
            }

            EditExpressionModalInstance().result.then(function (response) {}, function () {
                CloseEditExpressionModal();
            });
        }

        function PrepareExpression() {
            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup) {
                if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup.length > 0) {
                    var _Group = angular.copy(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.ExpressionGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value1, key1) {
                            if (value1.Expressions.length > 0) {
                                value1.Expressions.map(function (value2, key2) {
                                    delete value2.FieldNo;
                                    delete value2.FieldName;
                                });
                            }
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = _Group;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = "[]";
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.Expression = "[]";
            }

            CloseEditExpressionModal();
        }

        // Related Input
        function InitRelatedInput() {
            TCEventConfigureCtrl.ePage.Masters.Rule.RelatedInput = {};

            TCEventConfigureCtrl.ePage.Masters.Rule.RelatedInput.OnEditRelatedInput = OnEditRelatedInput;
            TCEventConfigureCtrl.ePage.Masters.Rule.RelatedInput.CloseEditRelatedInputModal = CloseEditRelatedInputModal;
            TCEventConfigureCtrl.ePage.Masters.Rule.RelatedInput.PrepareRelatedInput = PrepareRelatedInput;
        }

        function PrepareRelatedInput() {
            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup) {
                if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup.length > 0) {
                    var _Group = angular.copy(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = _Group;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = "[]";
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = "[]";
            }

            CloseEditRelatedInputModal();
        }

        function EditRelatedInputModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Rule.EditRelatedInputModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-related-input-modal right",
                scope: $scope,
                template: `<div ng-include src="'editRelatedInput'"></div>`
            });
        }

        function CloseEditRelatedInputModal() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EditRelatedInputModal.dismiss('cancel');

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput != '' && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput != ' ') {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput);
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput = JSON.stringify(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput, undefined, 2);
            }
        }

        function OnEditRelatedInput() {
            if (!TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup) {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup = [];
            }

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput) {
                if (typeof TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput == "string") {
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInput);
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.RelatedInputGroup = [];
            }

            EditRelatedInputModalInstance().result.then(function (response) {}, function () {
                CloseEditRelatedInputModal();
            });
        }

        // Update Rules
        function InitUpdateRules() {
            TCEventConfigureCtrl.ePage.Masters.Rule.UpdateRules = {};

            TCEventConfigureCtrl.ePage.Masters.Rule.UpdateRules.OnEditUpdateRules = OnEditUpdateRules;
            TCEventConfigureCtrl.ePage.Masters.Rule.UpdateRules.CloseEditUpdateRulesModal = CloseEditUpdateRulesModal;
            TCEventConfigureCtrl.ePage.Masters.Rule.UpdateRules.PrepareUpdateRules = PrepareUpdateRules;
        }

        function PrepareUpdateRules() {
            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup) {
                if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup.length > 0) {
                    var _Group = angular.copy(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup);

                    if (_Group.length > 0) {
                        _Group.map(function (value, key) {
                            delete value.FieldNo;
                            delete value.FieldName;
                        });
                    }

                    if (typeof _Group == "object") {
                        _Group = JSON.stringify(_Group);
                    }
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = _Group;
                } else {
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = "[]";
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = "[]";
            }

            CloseEditUpdateRulesModal();
        }

        function EditUpdateRulesModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Rule.EditUpdateRulesModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-update-rules-modal right",
                scope: $scope,
                template: `<div ng-include src="'editUpdateRules'"></div>`
            });
        }

        function CloseEditUpdateRulesModal() {
            TCEventConfigureCtrl.ePage.Masters.Rule.EditUpdateRulesModal.dismiss('cancel');

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules != '' && TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules != ' ') {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules);
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules = JSON.stringify(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules, undefined, 2);
            }
        }

        function OnEditUpdateRules() {
            if (!TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup) {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup = [];
            }

            if (TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules) {
                if (typeof TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules == "string") {
                    TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup = JSON.parse(TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRules);
                }
            } else {
                TCEventConfigureCtrl.ePage.Masters.Rule.ActiveConfigField.UpdateRulesGroup = [];
            }

            EditUpdateRulesModalInstance().result.then(function (response) {}, function () {
                CloseEditUpdateRulesModal();
            });
        }

        // endregion

        // region Event Group Mapping
        function InitEventGroupMapping() {
            TCEventConfigureCtrl.ePage.Masters.EventGroup = {};

            TCEventConfigureCtrl.ePage.Masters.EventGroup.OnEventGroupClick = OnEventGroupClick;
        }

        function GetEventGroupList() {
            TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource = undefined;
            var _filter = {
                // EVT_Code: TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code,
                // EVT_FK: TCEventConfigureCtrl.ePage.Masters.Event.FormView.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EventGroup.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetEventGroupMappingList();
                    }
                } else {
                    TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource = [];
                }
            });
        }

        function GetEventGroupMappingList() {
            var _filter = {
                EVT_Code: TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code,
                EVT_FK: TCEventConfigureCtrl.ePage.Masters.Event.FormView.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EventGroupMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventGroupMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.EVG_FK) {
                                    value1.IsChecked = true;
                                    value1.MappingObj = value2;
                                }
                            });
                        });
                    }
                }
            });
        }

        function OnEventGroupClick($event, $item) {
            var checkbox = $event.target,
                check = checkbox.checked,
                _input = {};

            if (check == true) {
                _input = {
                    "EVG_FK": $item.PK,
                    "EVT_Code": TCEventConfigureCtrl.ePage.Masters.Event.FormView.Code,
                    "EVT_Description": TCEventConfigureCtrl.ePage.Masters.Event.FormView.Description,
                    "EVT_FK": TCEventConfigureCtrl.ePage.Masters.Event.FormView.PK,
                    "IsModified": true
                };
            } else if (check == false) {
                _input = $item.MappingObj;
                _input.IsModified = true;
                _input.IsDeleted = true;
            }

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventGroupMapping.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.IsChecked = true;
                        $item.MappingObj = response.data.Response[0];
                    }
                }
            });
        }
        // endregion

        // region Event Group
        function InitEventGroup() {
            TCEventConfigureCtrl.ePage.Masters.Group = {};

            TCEventConfigureCtrl.ePage.Masters.Group.CreateEventGroup = CreateEventGroup;
            TCEventConfigureCtrl.ePage.Masters.Group.EditEventGroup = EditEventGroup;
            TCEventConfigureCtrl.ePage.Masters.Group.SaveEventGroup = SaveEventGroup;
            TCEventConfigureCtrl.ePage.Masters.Group.DeleteEventGroup = DeleteEventGroupCinfirmation;
            TCEventConfigureCtrl.ePage.Masters.Group.CloseEventGroupModal = CloseEventGroupModal;

            TCEventConfigureCtrl.ePage.Masters.Group.SaveBtnTxt = "Save";
            TCEventConfigureCtrl.ePage.Masters.Group.IsDisabledSaveBtn = false;
            TCEventConfigureCtrl.ePage.Masters.Group.DeleteBtnTxt = "Delete";
            TCEventConfigureCtrl.ePage.Masters.Group.IsDisabledDeleteBtn = false;
            TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup = {};
        }

        function CreateEventGroup() {
            TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup.Priority = 1;
            TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup.Type = "GENERAL";
            TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup.EntitySource = "GENERAL";

            EditEventGroupModalInstance().result.then(function (response) {}, function () {
                CloseEventGroupModal();
            });
        }

        function EditEventGroup($item, $index) {
            TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup = $item;
            EditEventGroupModalInstance().result.then(function (response) {}, function () {
                CloseEventGroupModal();
            });
        }

        function EditEventGroupModalInstance() {
            return TCEventConfigureCtrl.ePage.Masters.Group.EditEventGroupModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-edit-event-group-modal right",
                scope: $scope,
                template: `<div ng-include src="'editEventGroup'"></div>`
            });
        }

        function CloseEventGroupModal() {
            TCEventConfigureCtrl.ePage.Masters.Group.EditEventGroupModal.dismiss('cancel');
        }

        function SaveEventGroup() {
            TCEventConfigureCtrl.ePage.Masters.Group.SaveBtnTxt = "Please Wait...";
            TCEventConfigureCtrl.ePage.Masters.Group.IsDisabledSaveBtn = true;

            var _input = angular.copy(TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup);
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventGroup.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _index = TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource.map(function (value, key) {
                            return value.PK;
                        }).indexOf(TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup.PK);

                        if (_index !== -1) {
                            TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource[_index] = response.data.Response[0];
                        } else {
                            TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource.push(response.data.Response[0]);
                        }
                    }
                } else {
                    toastr.error("Could not Save...!");
                }

                TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup = undefined;
                TCEventConfigureCtrl.ePage.Masters.Group.SaveBtnTxt = "Save";
                TCEventConfigureCtrl.ePage.Masters.Group.IsDisabledSaveBtn = false;
                CloseEventGroupModal();
            });
        }

        function DeleteEventGroupCinfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteEventGroup();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteEventGroup() {
            TCEventConfigureCtrl.ePage.Masters.Group.DeleteBtnTxt = "Please Wait...";
            TCEventConfigureCtrl.ePage.Masters.Group.IsDisabledDeleteBtn = true;

            var _input = angular.copy(TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup);
            _input.IsModified = true;
            _input.IsDeleted = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventGroup.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _index = TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource.map(function (value, key) {
                        return value.PK;
                    }).indexOf(TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup.PK);

                    if (_index !== -1) {
                        TCEventConfigureCtrl.ePage.Masters.EventGroup.ListSource.splice(_index, 1);
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCEventConfigureCtrl.ePage.Masters.Group.ActiveEventGroup = undefined;
                TCEventConfigureCtrl.ePage.Masters.Group.DeleteBtnTxt = "Delete";
                TCEventConfigureCtrl.ePage.Masters.Group.IsDisabledDeleteBtn = false;
                CloseEventGroupModal();
            });
        }

        Init();
    }
})();
