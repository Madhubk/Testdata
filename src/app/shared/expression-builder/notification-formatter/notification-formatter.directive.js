(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventNotificationFormatter", EventNotificationFormatter);

    function EventNotificationFormatter($location, $uibModal, authService, apiService, helperService, appConfig) {
        var _exports = {
            restrict: 'AE',
            templateUrl: "app/shared/expression-builder/notification-formatter/notification-formatter.html",
            scope: {
                notificationList: "=",
                moduleCode: "=",
                key: "=",
                typeCode: "=",
                isToListRef: "="
            },
            link: Link
        };

        return _exports;

        function Link(scope, element, attr) {
            scope.Notification = {};
            scope.Notification.AddNotification = AddNotification;
            scope.Notification.DeleteNotification = DeleteNotification;
            scope.Notification.AddNewNotificationTemplate = AddNewNotificationTemplate;
            scope.Notification.SaveNotificationTemplate = SaveNotificationTemplate;
            scope.Notification.CloseNotificationTemplateModal = CloseNotificationTemplateModal;
            scope.Notification.NotificationTemplateListSelect = NotificationTemplateListSelect;
            scope.Notification.GetNotificationTemplateList = GetNotificationTemplateList;
            scope.Notification.OnBlurAutoCompleteList = OnBlurAutoCompleteList;
            scope.Notification.QueryString = {};
            scope.Notification.NotificationTemplateListSource = [];
            scope.Notification.ToListSource = [{
                Code: "1",
                Description: "Organization Contacts"
            }, {
                Code: "2",
                Description: "Group / Role Users"
            }, {
                Code: "3",
                Description: "Group / Role and Organization"
            }];

            var _queryString = $location.path().split("/");
            if (_queryString.indexOf("TC") !== -1) {
                scope.Notification.QueryString = JSON.parse(helperService.decryptData($location.path().split("/").pop()));
            } else {
                scope.Notification.QueryString.SAP_FK = authService.getUserInfo().AppPK;
                scope.Notification.QueryString.AppCode = authService.getUserInfo().AppCode;
            }

            function GetNotificationTemplateList($viewValue) {
                var _filter = {
                    "Autocompletefield": $viewValue,
                    "SourceEntityRefKey": "Email Templates",
                    "EntitySource": "EXCELCONFIG",
                    "ModuleCode": scope.moduleCode,
                    "TenantCode": authService.getUserInfo().TenantCode,
                    "SAP_FK": scope.Notification.QueryString.AppPk
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
                };

                return apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + scope.Notification.QueryString.AppPk, _input).then(function SuccessCallback(response) {
                    return response.data.Response;
                });
            }

            function NotificationTemplateListSelect($item, $model, $label, $event) {}

            function OnBlurAutoCompleteList($event, $item) {
                $item.IsTemplateLoading = false;
                $item.IsTemplateNoResults = false;
            }

            function AddNotification(exp) {
                var _group = {
                    TemplateName: "",
                    Subject: "",
                    Parameters: "",
                    Attachment: [],
                    ToListRef:""
                };

                scope.notificationList.push(_group);
            }

            function DeleteNotification(exp, $index) {
                scope.notificationList.splice($index, 1);
            }

            function EditNotificationModalInstance() {
                return scope.Notification.EditNotificationModal = $uibModal.open({
                    animation: true,
                    keyboard: true,
                    backdrop: "static",
                    windowClass: "tc-edit-notification-template-modal right",
                    scope: scope,
                    template: `<div ng-include src="'TCEventEditNotificationTemplate'"></div>`
                });
            }

            function CloseNotificationTemplateModal() {
                scope.Notification.EditNotificationModal.dismiss('cancel');
            }

            function AddNewNotificationTemplate() {
                if (!scope.Notification.NotificationObject) {
                    scope.Notification.NotificationObject = {};
                }

                EditNotificationModalInstance().result.then(function (response) {}, function () {
                    CloseNotificationTemplateModal();
                });
            }

            function SaveNotificationTemplate() {
                var _input = {
                    SourceEntityRefKey: "Email Templates",
                    EntitySource: "EXCELCONFIG",
                    ModuleCode: scope.moduleCode,
                    Key: scope.key,
                    TypeCode: scope.typeCode,
                    Value: JSON.stringify(scope.Notification.NotificationObject),
                    IsJSON: true,
                    TenantCode: authService.getUserInfo().TenantCode,
                    SAP_FK: scope.Notification.QueryString.AppPk,
                    AppCode: scope.Notification.QueryString.AppCode,
                    IsModified: true
                };

                apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.Upsert.Url + scope.Notification.QueryString.AppPk, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            var _response = response.data.Response[0];
                            scope.Notification.NotificationTemplateListSource.push(_response);
                        }
                    } else {
                        toastr.error("Could not Save...!");
                    }
                    CloseNotificationTemplateModal();
                });
            }
        }
    }
})();
