(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCScheduleController", TCScheduleController);

    TCScheduleController.$inject = ["$scope", "$location", "$uibModal", "authService", "apiService", "helperService", "toastr", "trustCenterConfig", "confirmation", "APP_CONSTANT"];

    function TCScheduleController($scope, $location, $uibModal, authService, apiService, helperService, toastr, trustCenterConfig, confirmation, APP_CONSTANT) {
        /* jshint validthis: true */
        let TCScheduleCtrl = this;
        let _queryString = $location.path().split("/").pop();

        function Init() {
            TCScheduleCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Schedule",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TCScheduleCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;
            TCScheduleCtrl.ePage.Masters.emptyText = "-";

            try {
                TCScheduleCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCScheduleCtrl.ePage.Masters.QueryString.AppPk) {
                    InitSchedule();
                    InitBreadcrumb();
                    InitApplication();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // #region Breadcrumb
        function InitBreadcrumb() {
            TCScheduleCtrl.ePage.Masters.Breadcrumb = {};
            TCScheduleCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCScheduleCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCScheduleCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCScheduleCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCScheduleCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "schedule",
                Description: "Schedule",
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }
        // #endregion

        // #region Application
        function InitApplication() {
            TCScheduleCtrl.ePage.Masters.Application = {};
            TCScheduleCtrl.ePage.Masters.Application.OnApplicationChange = OnApplicationChange;
        }

        function OnApplicationChange($item) {
            TCScheduleCtrl.ePage.Masters.Application.ActiveApplication = angular.copy($item);

            if (!TCScheduleCtrl.ePage.Masters.Application.ActiveApplication) {
                TCScheduleCtrl.ePage.Masters.Application.ActiveApplication = {
                    "PK": TCScheduleCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCScheduleCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCScheduleCtrl.ePage.Masters.QueryString.AppName
                };
            }

            GetScheduleList();
        }
        // #endregion

        // #region Schedule
        function InitSchedule() {
            TCScheduleCtrl.ePage.Masters.Schedule = {};
            TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = {};

            TCScheduleCtrl.ePage.Masters.Schedule.RedirectPagetList = [{
                Code: "FilterList",
                Description: "Filter List",
                Icon: "fa fa-filter",
                Link: "TC/filter-list",
                Color: "#405de6"
            }];

            TCScheduleCtrl.ePage.Masters.Schedule.OnScheduleClick = OnScheduleClick;
            TCScheduleCtrl.ePage.Masters.Schedule.AddNew = AddNew;
            TCScheduleCtrl.ePage.Masters.Schedule.Cancel = Cancel;
            TCScheduleCtrl.ePage.Masters.Schedule.Edit = Edit;
            TCScheduleCtrl.ePage.Masters.Schedule.Save = Save;
            TCScheduleCtrl.ePage.Masters.Schedule.Delete = DeleteConfirmation;
            TCScheduleCtrl.ePage.Masters.Schedule.SendNow = SendNow;
            TCScheduleCtrl.ePage.Masters.Schedule.OnExternalCodeChange = OnExternalCodeChange;
            TCScheduleCtrl.ePage.Masters.Schedule.OnConfigTypeChange = OnConfigTypeChange;

            TCScheduleCtrl.ePage.Masters.Schedule.SaveBtnText = "OK";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSaveBtn = false;

            TCScheduleCtrl.ePage.Masters.Schedule.DeleteBtnText = "Delete";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableDeleteBtn = false;

            TCScheduleCtrl.ePage.Masters.Schedule.SendNowBtnText = "Send Now";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSendNowBtn = false;

            // DatePicker
            TCScheduleCtrl.ePage.Masters.Schedule.DatePicker = {};
            TCScheduleCtrl.ePage.Masters.Schedule.DatePicker.Options = APP_CONSTANT.DatePicker;
            TCScheduleCtrl.ePage.Masters.Schedule.DatePicker.Options.minDate = new Date();
            TCScheduleCtrl.ePage.Masters.Schedule.DatePicker.isOpen = [];
            TCScheduleCtrl.ePage.Masters.Schedule.DatePicker.OpenDatePicker = OpenDatePicker;

            GetConfigType();
            GetEventList();
            InitScheduleInfo();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            TCScheduleCtrl.ePage.Masters.Schedule.DatePicker.isOpen[opened] = true;
        }

        function GetConfigType() {
            TCScheduleCtrl.ePage.Masters.Schedule.ConfigTypeList = [{
                Code: "Event",
                Description: "Event"
            }, {
                Code: "Email",
                Description: "Email"
            }, {
                Code: "ReportFields",
                Description: "Report Fields"
            }];
        }

        function OnConfigTypeChange() {
            if (TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.ConfigType != 'Event') {
                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.External_Code = null;
                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.External_FK = null;
            }
        }

        function GetEventList() {
            TCScheduleCtrl.ePage.Masters.Schedule.EventList = undefined;
            let _filter = {};
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.EventMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.EventMaster.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    TCScheduleCtrl.ePage.Masters.Schedule.EventList = response.data.Response;
                } else {
                    TCScheduleCtrl.ePage.Masters.Schedule.EventList = [];
                }
            });
        }

        function OnExternalCodeChange($item) {
            if ($item) {
                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.External_Code = $item.Code;
                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.External_FK = $item.PK;
            } else {
                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.External_Code = null;
                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.External_FK = null;
            }
        }

        function AddNew() {
            let _input = {
                SourceReference: "StandardExport",
                SAP_FK: TCScheduleCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            _input.CustomContactInfo = {
                Template: {
                    IsIndividual: false
                }
            };

            TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = _input;
            Edit();
        }

        function GetScheduleList() {
            TCScheduleCtrl.ePage.Masters.Schedule.ListSource = undefined;
            let _filter = {
                ClassSourceNotEquals: "USER_SCHEDULE",
                SAP_FK: TCScheduleCtrl.ePage.Masters.Application.ActiveApplication.PK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.DataConfigScheduler.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigScheduler.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response;
                    _response.map(value => {
                        value.NextScheduleOn = new Date(value.NextScheduleOn + "Z");
                        if (value.CustomContactInfo && value.CustomContactInfo.Template) {
                            if (typeof value.CustomContactInfo.Template == "string") {
                                value.CustomContactInfo.Template = JSON.parse(value.CustomContactInfo.Template);
                                value.CustomContactInfo.Template.ReportTemplateInput = JSON.stringify(value.CustomContactInfo.Template.ReportTemplateInput);
                            }
                        }
                    });

                    TCScheduleCtrl.ePage.Masters.Schedule.ListSource = _response;
                    OnScheduleClick(TCScheduleCtrl.ePage.Masters.Schedule.ListSource[0]);
                } else {
                    TCScheduleCtrl.ePage.Masters.Schedule.ListSource = [];
                    OnScheduleClick();
                }
            });
        }

        function OnScheduleClick($item) {
            TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = angular.copy($item);
            TCScheduleCtrl.ePage.Masters.Schedule.ActiveScheduleCopy = angular.copy($item);

            if (TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule) {
                TCScheduleCtrl.ePage.Masters.GenerateScriptInput = {
                    ObjectName: "DataConfigScheduler",
                    ObjectId: TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.PK
                };
                TCScheduleCtrl.ePage.Masters.GenerateScriptConfig = {
                    IsEnableTable: false,
                    IsEnablePK: false,
                    IsEnableTenant: false
                };

                let _item = TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule;
                if (_item.ScheduleInfo) {
                    if (typeof _item.ScheduleInfo == "string") {
                        _item.ScheduleInfo = JSON.parse(_item.ScheduleInfo);
                    }
                    _item.ScheduleInfo = JSON.stringify(_item.ScheduleInfo, undefined, 4);
                }
                if (_item.RelatedDetails) {
                    if (typeof _item.RelatedDetails == "string") {
                        _item.RelatedDetails = JSON.parse(_item.RelatedDetails);
                    }
                    _item.RelatedDetails = JSON.stringify(_item.RelatedDetails, undefined, 4);
                }
                if (_item.CustomContactInfo && _item.CustomContactInfo.Template) {
                    if (typeof _item.CustomContactInfo.Template == "string") {
                        _item.CustomContactInfo.Template = JSON.parse(_item.CustomContactInfo.Template);
                    }
                    if (_item.CustomContactInfo.Template.ReportTemplateInput) {
                        if (typeof _item.CustomContactInfo.Template.ReportTemplateInput == "string") {
                            _item.CustomContactInfo.Template.ReportTemplateInput = JSON.parse(_item.CustomContactInfo.Template.ReportTemplateInput);
                        }
                        if (typeof _item.CustomContactInfo.Template.ReportTemplateInput == "string") {
                            _item.CustomContactInfo.Template.ReportTemplateInput = JSON.parse(_item.CustomContactInfo.Template.ReportTemplateInput);
                        }
                        _item.CustomContactInfo.Template.ReportTemplateInput = JSON.stringify(_item.CustomContactInfo.Template.ReportTemplateInput, undefined, 4);
                    }
                }

                TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = _item;
            }
        }

        function OpenEditModal() {
            return TCScheduleCtrl.ePage.Masters.Schedule.EditModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "right",
                scope: $scope,
                template: `<div ng-include src="'TCSccheduleEdit'"></div>`
            });
        }

        function Cancel() {
            if (!TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule) {
                if (TCScheduleCtrl.ePage.Masters.Schedule.ListSource.length > 0) {
                    TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = angular.copy(TCScheduleCtrl.ePage.Masters.Schedule.ListSource[0]);
                } else {
                    TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = undefined;
                }
            } else if (TCScheduleCtrl.ePage.Masters.Schedule.ActiveScheduleCopy) {
                let _index = TCScheduleCtrl.ePage.Masters.Schedule.ListSource.findIndex(value => value.PK === TCScheduleCtrl.ePage.Masters.Schedule.ActiveScheduleCopy.PK);

                if (_index !== -1) {
                    TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = angular.copy(TCScheduleCtrl.ePage.Masters.Schedule.ListSource[_index]);
                }
            }

            TCScheduleCtrl.ePage.Masters.Schedule.EditModal.dismiss('cancel');
        }

        function Edit() {
            TCScheduleCtrl.ePage.Masters.Schedule.SaveBtnText = "OK";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSaveBtn = false;

            OpenEditModal().result.then(response => {}, () => Cancel());
        }

        function DeleteConfirmation() {
            let _options = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, _options).then(result => Delete(), () => {});
        }

        function Delete() {
            TCScheduleCtrl.ePage.Masters.Schedule.DeleteBtnText = "Please Wait...";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableDeleteBtn = true;

            apiService.get("eAxisAPI", trustCenterConfig.Entities.API.DataConfigScheduler.API.Delete.Url + TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.PK).then(response => {
                if (response.data.Response) {
                    let _index = TCScheduleCtrl.ePage.Masters.Schedule.ListSource.findIndex(value => value.PK === TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.PK);

                    if (_index !== -1) {
                        TCScheduleCtrl.ePage.Masters.Schedule.ListSource.splice(_index, 1);
                        if (TCScheduleCtrl.ePage.Masters.Schedule.ListSource.length > 0) {
                            TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule = angular.copy(TCScheduleCtrl.ePage.Masters.Schedule.ListSource[0]);
                        } else {
                            OnScheduleClick();
                        }
                    }
                } else {
                    toastr.error("Could not Delete...!");
                }

                TCScheduleCtrl.ePage.Masters.Schedule.DeleteBtnText = "Delete";
                TCScheduleCtrl.ePage.Masters.Schedule.IsDisableDeleteBtn = false;
            });
        }

        function Save() {
            TCScheduleCtrl.ePage.Masters.Schedule.SaveBtnText = "Please Wait...";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSaveBtn = true;

            let _item = angular.copy(TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule);
            if (_item.CustomContactInfo) {
                _item.CustomContactInfo.ContactInfo = _item.CustomContactInfo.Template.To;
                if (_item.CustomContactInfo.Template.ReportTemplateInput && typeof _item.CustomContactInfo.Template.ReportTemplateInput == "string") {
                    // _item.CustomContactInfo.Template.ReportTemplateInput = JSON.parse(_item.CustomContactInfo.Template.ReportTemplateInput);
                    _item.CustomContactInfo.Template = JSON.stringify(_item.CustomContactInfo.Template);
                }
                _item.CustomContactInfo.EntityRefCode = _item.Title;
            }

            _item.NextScheduleOn = new Date(_item.NextScheduleOn).toUTCString();
            _item.IsModified = true;
            let _input = _item.PK ? _item : [_item];
            let _api = TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.PK ? "Update" : "Insert";

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigScheduler.API[_api].Url, _input).then(response => {
                if (response.data.Response) {
                    let _response = (_api === "Insert") ? response.data.Response[0] : response.data.Response;
                    _response.NextScheduleOn = new Date(_response.NextScheduleOn);
                    if (TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.PK) {
                        let _index = TCScheduleCtrl.ePage.Masters.Schedule.ListSource.findIndex(x => x.PK === _response.PK);

                        if (_index !== -1) {
                            TCScheduleCtrl.ePage.Masters.Schedule.ListSource[_index] = _response;
                        }
                    } else {
                        TCScheduleCtrl.ePage.Masters.Schedule.ListSource.push(_response);
                    }

                    OnScheduleClick(_response);
                } else {
                    toastr.error("Could not Save...!");
                }

                TCScheduleCtrl.ePage.Masters.Schedule.SaveBtnText = "OK";
                TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSaveBtn = false;
                TCScheduleCtrl.ePage.Masters.Schedule.EditModal.dismiss('cancel');
            });
        }
        // #endregion        

        function InitScheduleInfo() {
            TCScheduleCtrl.ePage.Masters.Schedule.ScheduleInfo = {
                Type: {
                    ListSource: [],
                    OnChange: OnScheduleTypeChange
                }
            };

            GetScheduleInfoType();
        }

        function GetScheduleInfoType() {
            TCScheduleCtrl.ePage.Masters.Schedule.ScheduleInfo.Type.ListSource = [{
                Code: "Daily",
                Description: "Daily",
            }, {
                Code: "DailyRepeat",
                Description: "Daily Repeat",
            }, {
                Code: "Weekly",
                Description: "Weekly",
            }];
        }

        function OnScheduleTypeChange($item) {
            TCScheduleCtrl.ePage.Masters.Schedule.ScheduleInfo.Type.ActiveScheduleType = $item;

            let _scheduleInfo = {};

            if (TCScheduleCtrl.ePage.Masters.Schedule.ScheduleInfo.Type.ActiveScheduleType.Code == "Daily") {
                _scheduleInfo = {
                    "ScheduleType": "Daily",
                    "Hour": "7,10",
                    "Enabled": true
                };
            } else if (TCScheduleCtrl.ePage.Masters.Schedule.ScheduleInfo.Type.ActiveScheduleType.Code == "DailyRepeat") {
                _scheduleInfo = {
                    "ScheduleType": "Daily",
                    "RepeatTask": "15",
                    "Enabled": true
                };
            } else if (TCScheduleCtrl.ePage.Masters.Schedule.ScheduleInfo.Type.ActiveScheduleType.Code == "Weekly") {
                _scheduleInfo = {
                    "ScheduleType": "Weekly",
                    "WeekDay": "TUE",
                    "Hour": "7",
                    "Enabled": true
                };
            }

            TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule.ScheduleInfo = JSON.stringify(_scheduleInfo, undefined, 4);
        }

        function SendNow() {
            TCScheduleCtrl.ePage.Masters.Schedule.SendNowBtnText = "Please Wait";
            TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSendNowBtn = true;

            let _input = angular.copy(TCScheduleCtrl.ePage.Masters.Schedule.ActiveSchedule);
            _input.NextScheduleOn = new Date(_input.NextScheduleOn).toUTCString();
            if (_input.CustomContactInfo) {
                _input.CustomContactInfo.ContactInfo = _input.CustomContactInfo.Template.To;
                if (_input.CustomContactInfo.Template.ReportTemplateInput && typeof _input.CustomContactInfo.Template.ReportTemplateInput == "string") {
                    // _input.CustomContactInfo.Template.ReportTemplateInput = JSON.parse(_input.CustomContactInfo.Template.ReportTemplateInput);
                    _input.CustomContactInfo.Template = JSON.stringify(_input.CustomContactInfo.Template);
                }
                _input.CustomContactInfo.EntityRefCode = _input.Title;
            }
            _input.IsModified = true;

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.DataConfigScheduler.API.RunScheduleNow.Url, _input).then(response => {
                if (response.data.Response && response.data.Status === "Success") {} else {
                    toastr.error("Failed to Send...!");
                }

                TCScheduleCtrl.ePage.Masters.Schedule.SendNowBtnText = "Send Now";
                TCScheduleCtrl.ePage.Masters.Schedule.IsDisableSendNowBtn = false;
            });
        }

        Init();
    }
})();
