(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExcelTemplateMenuController", ExcelTemplateMenuController);

    ExcelTemplateMenuController.$inject = ["helperService", "excelTemplateConfig", "appConfig", "apiService", "$uibModal", "$scope"];

    function ExcelTemplateMenuController(helperService, excelTemplateConfig, appConfig, apiService, $uibModal, $scope) {
        var ExcelTemplateMenuCtrl = this;

        function Init() {
            var currentExcelTemplate = ExcelTemplateMenuCtrl.currentExcelTemplate[ExcelTemplateMenuCtrl.currentExcelTemplate.label].ePage.Entities;

            ExcelTemplateMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ExcelTemplate",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentExcelTemplate,
            };

            InitExcelTemplate();
            InitTestTemplate();
        }

        function InitExcelTemplate() {
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate = {};
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView = {};
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView = angular.copy(ExcelTemplateMenuCtrl.ePage.Entities.Header.Data);
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.OpenNotificationTemplateModal = OpenNotificationTemplateModal;
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.CloseNotificationTemplateModal = CloseNotificationTemplateModal;
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.PrepareNotificationTemplate = PrepareNotificationTemplate;
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.SaveExcelTemplate = SaveExcelTemplate;

            ExcelTemplateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ExcelTemplateMenuCtrl.ePage.Masters.IsDisableSave = false;
        }

        function EditNotificationTemplateModalInstance() {
            return ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.EditNotificationModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "excel-template-edit-notification-modal right",
                scope: $scope,
                template: `<div ng-include src="'ExceltemplateEditNotification'"></div>`
            });
        }

        function CloseNotificationTemplateModal() {
            ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.EditNotificationModal.dismiss('cancel');
        }

        function OpenNotificationTemplateModal() {
            if (!ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.NotificationObject) {
                ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.NotificationObject = {};
            }

            if (ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value) {
                if (typeof ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value == "string") {
                    ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.NotificationObject = JSON.parse(ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value);
                }
            } else {
                ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.NotificationObject = {};
            }

            EditNotificationTemplateModalInstance().result.then(function (response) {}, function () {
                CloseNotificationTemplateModal();
            });
        }

        function PrepareNotificationTemplate() {
            if (ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.NotificationObject) {
                ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value = ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.NotificationObject;

                ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value = JSON.stringify(ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value, undefined, 2);
            } else {
                ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value = "{}";
            }

            CloseNotificationTemplateModal();
        }

        function SaveExcelTemplate() {
            ExcelTemplateMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ExcelTemplateMenuCtrl.ePage.Masters.IsDisableSave = true;

            var _input = ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.Upsert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView = response.data.Response[0];

                    var _isEmpty = angular.equals({}, ExcelTemplateMenuCtrl.ePage.Entities.Header.Data);

                    if (_isEmpty) {
                        var _index = excelTemplateConfig.TabList.map(function (value, key) {
                            return value.code;
                        }).indexOf("New");

                        if (_index !== -1) {
                            excelTemplateConfig.TabList[_index].label = ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.SourceEntityRefKey;
                            excelTemplateConfig.TabList[_index].code = ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.SourceEntityRefKey;
                            excelTemplateConfig.TabList[_index][ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView] = excelTemplateConfig.TabList[_index]["New"];

                            delete excelTemplateConfig.TabList[_index]["New"];

                            excelTemplateConfig.TabList[_index][ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView].ePage.Entities.Header.Data = ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView;
                        }
                    }
                }

                ExcelTemplateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ExcelTemplateMenuCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        //===== Template ======//

        function InitTestTemplate() {
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate = {};
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.OnTestTemplateBtnClick = OnTestTemplateBtnClick;
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.IsToggleTestTemplate = false;
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.OnExecuteTestTemplate = OnExecuteTestTemplate;
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.AddNewRow = AddNewRow;
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.RemoveRecord = RemoveRecord;

            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords = [];

            GetFileTypeList();
        }

        function GetFileTypeList() {
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.FileTypeList = [{
                "Code": "EXCEL",
                "Desc": "Excel"
            }, {
                "Code": "HTML",
                "Desc": "Html"
            }, {
                "Code": "PDF",
                "Desc": "PDF"
            }];
        }

        function isObject(value) {
            return value && typeof value === 'object' && value.constructor === Object;
        }

        function isArray(value) {
            return value && typeof value === 'object' && value.constructor === Array;
        }

        function OnTestTemplateBtnClick() {
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.IsToggleTestTemplate = !ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.IsToggleTestTemplate;

            if (ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value != null) {
                ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue = JSON.parse(angular.copy(ExcelTemplateMenuCtrl.ePage.Masters.ExcelTemplate.FormView.Value));

                if (ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue.DataObjs && ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue.DataObjs.length > 0) {
                    ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue.DataObjs.map(function (value, key) {
                        if (value.DataSource == "Local") {
                            if (value.DataObject) {
                                value.DataObject = JSON.parse(value.DataObject);
                            }
                        }
                    });
                }
            }

            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords = [];

            if (ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue) {
                if (isObject(ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue) == true) {
                    GetObjectValue(ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue);
                } else if (isArray(ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue) == true) {
                    GetArrayValue(ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue);
                } else {
                    GetStringValue(ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue);
                }
            }
        }

        function GetObjectValue($item) {
            for (var x in $item) {
                if (isObject($item[x]) == true) {
                    GetObjectValue($item[x]);
                } else if (isArray($item[x]) == true) {
                    GetArrayValue($item[x]);
                } else {
                    GetStringValue($item[x]);
                }
            }
        }

        function GetArrayValue($item) {
            if ($item.length > 0) {
                $item.map(function (value, key) {
                    if (isObject(value) == true) {
                        GetObjectValue(value)
                    } else if (isArray(value) == true) {
                        GetArrayValue(value);
                    } else {
                        GetStringValue(value);
                    }
                });
            }
        }

        function GetStringValue($item) {
            if (typeof ($item) !== "boolean" && typeof ($item) !== "number") {
                if ($item.indexOf("@") !== -1) {
                    if ($item.indexOf("/") > 1) {
                        var _index = $item.indexOf("/");
                        if (_index != -1) {
                            var _temp = $item.split("/")
                            var _fieldName = $item.split("/")[_temp.length - 1];
                        }
                    } else {
                        var _fieldName = $item;
                    }

                    var _obj = {
                        FieldName: _fieldName,
                        Value: ""
                    };

                    ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords.push(_obj);
                }
            }
        }

        function OnExecuteTestTemplate() {
            var _apiUrl;
            if (ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords.length > 0) {
                var _json = JSON.stringify(ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.JSONValue);

                ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords.map(function (value, key) {
                    if (_json.indexOf(value.FieldName) !== -1) {
                        if (value.Value) {
                            _json = _json.replace(value.FieldName, value.Value);
                        }
                    }
                });

                var _input = JSON.parse(angular.copy(_json));
                _input.FileType = ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.FileType;
                if (ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.FileType == "HTML") {
                    _input.IsLocal = true;
                }
                if (ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.FileType === "EXCEL" || ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.FileType === "PDF") {
                    _apiUrl = appConfig.Entities.Export.API.Excel.Url;
                } else if (ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.FileType === "HTML") {
                    _apiUrl = appConfig.Entities.Export.API.AsHtml.Url;
                }

                apiService.post("eAxisAPI", _apiUrl, _input).then(function (response) {
                    helperService.DownloadDocument(response.data.Response);
                });
            }
        }

        function AddNewRow() {
            var _obj = {};
            if (!ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords) {
                ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords = [];
            }

            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords.push(_obj);
        }

        function RemoveRecord($index) {
            ExcelTemplateMenuCtrl.ePage.Masters.TestTemplate.SearchKeywords.splice($index, 1);
        }

        Init();
    }
})();
