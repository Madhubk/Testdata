(function () {
    "use strict";

    angular
        .module("Application")
        .directive("schedule", Schedule);

    Schedule.$inject = ["$uibModal"];

    function Schedule($uibModal) {
        let exports = {
            restrict: "EA",
            scope: {
                externalCode: "=",
                classSource: "=",
                configType: "=",
                relatedDetails: "=",
                sourceReference: "=",
                template: "=",
                dataentryObj: "=",
                mode: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on('click', $event => OpenModal());

            function OpenModal() {
                $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "schedule-modal right",
                    scope: scope,
                    templateUrl: "app/shared/schedule/schedule.html",
                    controller: "ScheduleController",
                    controllerAs: "ScheduleCtrl",
                    bindToController: true
                }).result.then(response => console.log(response), () => {});
            }
        }
    }

    angular
        .module("Application")
        .controller("ScheduleController", ScheduleController);

    ScheduleController.$inject = ["$uibModalInstance", "authService", "apiService", "helperService", "toastr", "appConfig", "confirmation", "APP_CONSTANT"];

    function ScheduleController($uibModalInstance, authService, apiService, helperService, toastr, appConfig, confirmation, APP_CONSTANT) {
        /* jshint validthis: true */
        let ScheduleCtrl = this;

        function Init() {
            ScheduleCtrl.ePage = {
                "Title": "",
                "Prefix": "Schedule",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ScheduleCtrl.ePage.Masters.Data = {
                External_Code: ScheduleCtrl.externalCode,
                ConfigType: ScheduleCtrl.configType,
                SourceReference: ScheduleCtrl.sourceReference,
                ClassSource: ScheduleCtrl.classSource,
                SAP_FK: authService.getUserInfo().AppPK
            };

            ScheduleCtrl.ePage.Masters.CloseScheduleModal = CloseScheduleModal;
            ScheduleCtrl.ePage.Masters.SaveSchedule = SaveSchedule;
            ScheduleCtrl.ePage.Masters.EditSchedule = EditSchedule;
            ScheduleCtrl.ePage.Masters.DeleteSchedule = DeleteScheduleConfirmation;
            ScheduleCtrl.ePage.Masters.SendNow = SendNow;
            ScheduleCtrl.ePage.Masters.Cancel = Cancel;
            ScheduleCtrl.ePage.Masters.AddNew = AddNew;

            ScheduleCtrl.ePage.Masters.IsEditView = false;

            ScheduleCtrl.ePage.Masters.SummernoteOptions = APP_CONSTANT.SummernoteOptions;

            // DatePicker
            ScheduleCtrl.ePage.Masters.DatePicker = {};
            ScheduleCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ScheduleCtrl.ePage.Masters.DatePicker.Options.minDate = new Date();
            ScheduleCtrl.ePage.Masters.DatePicker.isOpen = [];
            ScheduleCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ScheduleCtrl.ePage.Masters.SaveScheduleBtnTxt = "Save";
            ScheduleCtrl.ePage.Masters.IsDisableSaveScheduleBtn = false;

            ScheduleCtrl.ePage.Masters.SendNowBtnTxt = "Send Now";
            ScheduleCtrl.ePage.Masters.IsDisableSendNowBtn = false;

            GetConfigType();
            GetScheduledList();
            InitScheduleInfo();

            if (ScheduleCtrl.mode == 2) {
                AddNew();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ScheduleCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetConfigType() {
            ScheduleCtrl.ePage.Masters.ConfigTypeList = [{
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

        function GetScheduledList() {
            ScheduleCtrl.ePage.Masters.ScheduleList = undefined;
            let _filter = {
                SourceReference: ScheduleCtrl.sourceReference,
                ClassSource: ScheduleCtrl.classSource,
                SAP_FK: authService.getUserInfo().AppPK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataConfigScheduler.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    let _response = response.data.Response;
                    _response.map(value => {
                        value.SendNowBtnTxt = "Send Now";
                        value.IsDisableSendNowBtn = false;
                        value.NextScheduleOn = new Date(value.NextScheduleOn + "Z");
                        if (value.CustomContactInfo && value.CustomContactInfo.Template) {
                            if (typeof value.CustomContactInfo.Template == "string") {
                                value.CustomContactInfo.Template = JSON.parse(value.CustomContactInfo.Template);
                                value.CustomContactInfo.Template.ReportTemplateInput = JSON.stringify(value.CustomContactInfo.Template.ReportTemplateInput);
                            }
                        }
                    });

                    ScheduleCtrl.ePage.Masters.ScheduleList = _response;
                } else {
                    ScheduleCtrl.ePage.Masters.ScheduleList = [];
                }
            });
        }

        function AddNew() {
            ScheduleCtrl.ePage.Masters.IsEditView = true;
            NewSchedule();
        }

        function NewSchedule() {
            let _input = angular.copy(ScheduleCtrl.ePage.Masters.Data);
            _input.RelatedDetails = JSON.stringify(ScheduleCtrl.relatedDetails.RelatedDetail, undefined, 4);
            _input.CustomContactInfo = {
                MappingCode: "EMAIL_SCHEDULE",
                EntitySource: "USER_SCHEDULE",
                Template: {
                    NotificationType: "EMAIL",
                    IsIndividual: false,
                    ReportTemplateInput: JSON.stringify(ScheduleCtrl.relatedDetails.GridReport, undefined, 4)
                }
            };

            ScheduleCtrl.ePage.Masters.ActiveSchedule = _input;
        }

        function EditSchedule($item) {
            let _item = $item;
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

            ScheduleCtrl.ePage.Masters.ActiveSchedule = angular.copy(_item);
            ScheduleCtrl.ePage.Masters.IsEditView = true;
        }

        function Cancel() {
            ScheduleCtrl.ePage.Masters.IsEditView = false;
            NewSchedule();
        }

        function SaveSchedule() {
            ScheduleCtrl.ePage.Masters.SaveScheduleBtnTxt = "Please Wait...";
            ScheduleCtrl.ePage.Masters.IsDisableSaveScheduleBtn = true;

            let _item = angular.copy(ScheduleCtrl.ePage.Masters.ActiveSchedule);
            if (_item.CustomContactInfo) {
                _item.CustomContactInfo.ContactInfo = _item.CustomContactInfo.Template.To;
				_item.CustomContactInfo.IsModified = true;
                if (_item.CustomContactInfo.Template.ReportTemplateInput && typeof _item.CustomContactInfo.Template.ReportTemplateInput == "string") {
                    // _item.CustomContactInfo.Template.ReportTemplateInput = JSON.parse(_item.CustomContactInfo.Template.ReportTemplateInput);
                    _item.CustomContactInfo.Template = JSON.stringify(_item.CustomContactInfo.Template);
                }
                _item.CustomContactInfo.EntityRefCode = _item.Title;
            }

            _item.NextScheduleOn = new Date(_item.NextScheduleOn).toUTCString();
            _item.IsModified = true;
            let _input = _item.PK ? _item : [_item];
            let _api = ScheduleCtrl.ePage.Masters.ActiveSchedule.PK ? "Update" : "Insert";

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API[_api].Url, _input).then(response => {
                if (response.data.Response && response.data.Status === "Success") {
                    let _response = (_api === "Insert") ? response.data.Response[0] : response.data.Response;
                    _response.SendNowBtnTxt = "Send Now";
                    _response.IsDisableSendNowBtn = false;
                    _response.NextScheduleOn = new Date(_response.NextScheduleOn);
                    if (ScheduleCtrl.ePage.Masters.ActiveSchedule.PK) {
                        let _index = ScheduleCtrl.ePage.Masters.ScheduleList.findIndex(x => x.PK === _response.PK);

                        if (_index !== -1) {
                            ScheduleCtrl.ePage.Masters.ScheduleList[_index] = _response;
                        }
                    } else {
                        ScheduleCtrl.ePage.Masters.ScheduleList.push(_response);
                    }
                    NewSchedule();
                    ScheduleCtrl.ePage.Masters.IsEditView = false;
                    toastr.success("Scheduled Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }

                ScheduleCtrl.ePage.Masters.SaveScheduleBtnTxt = "Save";
                ScheduleCtrl.ePage.Masters.IsDisableSaveScheduleBtn = false;
            });
        }

        function DeleteScheduleConfirmation($item) {
            let modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions).then(result => DeleteSchedule($item), () => console.log("Cancelled"));
        }

        function DeleteSchedule($item) {
            apiService.get("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.Delete.Url + $item.PK).then(response => {
                if (response.data.Status == "Success") {
                    let _index = ScheduleCtrl.ePage.Masters.ScheduleList.findIndex(x => x.PK === $item.PK);

                    if (_index !== -1) {
                        ScheduleCtrl.ePage.Masters.ScheduleList.splice(_index, 1);
                        NewSchedule();
                    };
                } else {
                    toastr.error("Failed to Delete...!");
                }
            });
        }

        function CloseScheduleModal() {
            $uibModalInstance.dismiss('cancel');
        }

        function SendNow($item) {
            $item.SendNowBtnTxt = "Please Wait...";
            $item.IsDisableSendNowBtn = true;

            let _item = angular.copy($item);
            _item.NextScheduleOn = new Date(_item.NextScheduleOn).toUTCString();
            _item.IsModified = true;
            if (_item.CustomContactInfo) {
                _item.CustomContactInfo.ContactInfo = _item.CustomContactInfo.Template.To;
                if (_item.CustomContactInfo.Template.ReportTemplateInput && typeof _item.CustomContactInfo.Template.ReportTemplateInput == "string") {
                    // _item.CustomContactInfo.Template.ReportTemplateInput = JSON.parse(_item.CustomContactInfo.Template.ReportTemplateInput);
                    _item.CustomContactInfo.Template = JSON.stringify(_item.CustomContactInfo.Template);
                }
                _item.CustomContactInfo.EntityRefCode = _item.Title;
            }
            let _input = _item;

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.RunScheduleNow.Url, _input).then(response => {
                if (response.data.Response && response.data.Status === "Success") {
					toastr.success("Mail sent successfully...!");
				} else {
                    toastr.error("Failed to Send...!");
                }

                $item.SendNowBtnTxt = "Send Now";
                $item.IsDisableSendNowBtn = false;
            });
        }

        function InitScheduleInfo() {
            ScheduleCtrl.ePage.Masters.ScheduleInfo = {
                Type: {
                    ListSource: [],
                    OnChange: OnScheduleTypeChange
                }
            };

            GetScheduleInfoType();
        }

        function GetScheduleInfoType() {
            ScheduleCtrl.ePage.Masters.ScheduleInfo.Type.ListSource = [{
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
            ScheduleCtrl.ePage.Masters.ScheduleInfo.Type.ActiveScheduleType = $item;

            let _scheduleInfo = {};

            if (ScheduleCtrl.ePage.Masters.ScheduleInfo.Type.ActiveScheduleType.Code == "Daily") {
                _scheduleInfo = {
                    "ScheduleType": "Daily",
                    "Hour": "7,10",
                    "Enabled": true
                };
            } else if (ScheduleCtrl.ePage.Masters.ScheduleInfo.Type.ActiveScheduleType.Code == "DailyRepeat") {
                _scheduleInfo = {
                    "ScheduleType": "Daily",
                    "RepeatTask": "15",
                    "Enabled": true
                };
            } else if (ScheduleCtrl.ePage.Masters.ScheduleInfo.Type.ActiveScheduleType.Code == "Weekly") {
                _scheduleInfo = {
                    "ScheduleType": "Weekly",
                    "WeekDay": "TUE",
                    "Hour": "7",
                    "Enabled": true
                };
            }

            ScheduleCtrl.ePage.Masters.ActiveSchedule.ScheduleInfo = JSON.stringify(_scheduleInfo, undefined, 4);
        }

        Init();
    }
})();
