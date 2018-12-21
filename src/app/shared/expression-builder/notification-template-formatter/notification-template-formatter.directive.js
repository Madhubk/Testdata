(function () {
    "use strict";

    angular
        .module("Application")
        .directive("notificationTemplateFormatter", NotificationTemplateFormatter);

    function NotificationTemplateFormatter($uibModal) {
        var _exports = {
            restrict: 'AE',
            templateUrl: "app/shared/expression-builder/notification-template-formatter/notification-template-formatter.html",
            scope: {
                input: "=",
                moduleCode: "=",
                key: "=",
                typeCode: "=",
            },
            link: Link
        };

        return _exports;

        function Link(scope, element, attr) {
            scope.NotificationTemplate = {};
            scope.NotificationTemplate.AddNewSection = AddNewSection;
            scope.NotificationTemplate.DeleteSection = DeleteSection;
            scope.NotificationTemplate.AddNewTotalFormula = AddNewTotalFormula;
            scope.NotificationTemplate.DeleteTotalFormula = DeleteTotalFormula;
            scope.NotificationTemplate.AddNewUIDataReference = AddNewUIDataReference;
            scope.NotificationTemplate.DeleteUIDataReference = DeleteUIDataReference;
            scope.NotificationTemplate.OpenGridConfig = OpenGridConfig;
            scope.NotificationTemplate.CloseGridConfigModal = CloseGridConfigModal;
            scope.NotificationTemplate.AddNewGridConfig = AddNewGridConfig;
            scope.NotificationTemplate.DeleteSectionGridConfig = DeleteSectionGridConfig;
            scope.NotificationTemplate.SaveSectionGridConfig = SaveSectionGridConfig;
            scope.NotificationTemplate.OnChangeSectionDataSource = OnChangeSectionDataSource;
            scope.NotificationTemplate.AddNewSearchInput = AddNewSearchInput;
            scope.NotificationTemplate.DeleteSectionSearchInput = DeleteSectionSearchInput;

            if (scope.input) {
                if (scope.input.DataObjs && scope.input.DataObjs.length > 0) {
                    scope.input.DataObjs.map(function (value, key) {
                        if (value.DataObject) {
                            if (typeof value.DataObject == "object") {
                                value.DataObject = JSON.stringify(value.DataObject);
                            }
                        }
                    });
                }
            }

            GetSectionDataSourceList();

            function AddNewSection() {
                var _section = {
                    "SectionName": "",
                    "DataSource": "",
                    "Member": "",
                    "IsApi": false,
                    "ApiName": "",
                    "HttpMethod": "",
                    "DataObject": "",
                    "RenderType": true,
                    "IsList": false,
                    "IsFilterEnabled": false,
                    "IsSelf": false,
                    "IsAutoHeader": false,
                    "AutoColumnWidth": "",
                    "GridConfig": [],
                };

                if (!scope.input.DataObjs) {
                    scope.input.DataObjs = [];
                }
                scope.input.DataObjs.push(_section);
            }

            function DeleteSection($item, $index) {
                scope.input.DataObjs.splice($index, 1);
            }

            function AddNewTotalFormula() {
                var _formula = {
                    ColumnNumber: "",
                    Formula: ""
                };

                if (!scope.input.TotalFormula) {
                    scope.input.TotalFormula = [];
                }
                scope.input.TotalFormula.push(_formula);
            }

            function DeleteTotalFormula($item, $index) {
                scope.input.TotalFormula.splice($index, 1);
            }

            function AddNewUIDataReference() {
                var _dataReference = {
                    "SField": "",
                    "MainEntity": "",
                    "SubEntity": "",
                    "MidEntity": "",
                    "FieldName": ""
                };

                if (!scope.input.UIDataReference) {
                    scope.input.UIDataReference = {};
                }

                if (!scope.input.UIDataReference.SearchInputConfig) {
                    scope.input.UIDataReference.SearchInputConfig = [];
                }
                scope.input.UIDataReference.SearchInputConfig.push(_dataReference);
            }

            function DeleteUIDataReference($item, $index) {
                scope.input.UIDataReference.SearchInputConfig.splice($index, 1);
            }

            function OpenGridConfig($item) {
                scope.NotificationTemplate.SelectedSection = $item;
                scope.NotificationTemplate.SelectedSectionCopy = angular.copy($item);

                EditGridConfigModalInstance().result.then(function (response) {}, function () {
                    CloseGridConfigModal();
                });
            }

            function EditGridConfigModalInstance() {
                return scope.NotificationTemplate.EditGridConfigModal = $uibModal.open({
                    animation: true,
                    keyboard: true,
                    backdrop: "static",
                    windowClass: "tc-edit-notification-grid-config-template-modal right",
                    scope: scope,
                    template: `<div ng-include src="'TCEditNotificationGridConfigTemplate'"></div>`
                });
            }

            function CloseGridConfigModal() {
                scope.NotificationTemplate.EditGridConfigModal.dismiss('cancel');
            }

            function AddNewGridConfig() {
                var _gridConfig = {
                    // TableName: "",
                    FieldName: "",
                    DataType: "",
                    TypeFormat: "",
                    DisplayName: "",
                    Sequence: ""
                };

                if (!scope.NotificationTemplate.SelectedSectionCopy.GridConfig) {
                    scope.NotificationTemplate.SelectedSectionCopy.GridConfig = [];
                }

                scope.NotificationTemplate.SelectedSectionCopy.GridConfig.push(_gridConfig);
            }

            function SaveSectionGridConfig() {
                var _index = scope.input.DataObjs.map(function (value, key) {
                    return value.SectionName;
                }).indexOf(scope.NotificationTemplate.SelectedSectionCopy.SectionName);

                if (_index !== -1) {
                    scope.input.DataObjs[_index].GridConfig = scope.NotificationTemplate.SelectedSectionCopy.GridConfig;

                    scope.input.DataObjs[_index].SearchInput = scope.NotificationTemplate.SelectedSectionCopy.SearchInput;
                }

                CloseGridConfigModal();
            }

            function GetSectionDataSourceList() {
                scope.NotificationTemplate.SectionDataSourceList = ['Parent', 'API', 'Local'];
            }

            function OnChangeSectionDataSource($item, dataObj) {
                ($item == 'API') ? dataObj.IsApi = true: dataObj.IsApi = false;
                ($item == 'API') ? dataObj.IsSelf = true: dataObj.IsSelf = false;
                ($item == 'Local') ? dataObj.RenderType = false: dataObj.RenderType = true;
            }

            function DeleteSectionGridConfig($item, $index) {
                scope.NotificationTemplate.SelectedSectionCopy.GridConfig.splice($index, 1);
            }

            function AddNewSearchInput() {
                var _searchInput = {
                    FieldName: "",
                    value: ""
                };

                if (!scope.NotificationTemplate.SelectedSectionCopy.SearchInput) {
                    scope.NotificationTemplate.SelectedSectionCopy.SearchInput = {};
                }
                if (!scope.NotificationTemplate.SelectedSectionCopy.SearchInput.SearchInput) {
                    scope.NotificationTemplate.SelectedSectionCopy.SearchInput.SearchInput = [];
                }

                scope.NotificationTemplate.SelectedSectionCopy.SearchInput.SearchInput.push(_searchInput);
            }

            function DeleteSectionSearchInput($item, $index) {
                scope.NotificationTemplate.SelectedSectionCopy.SearchInput.SearchInput.splice($index, 1);
            }
        }
    }
})();
