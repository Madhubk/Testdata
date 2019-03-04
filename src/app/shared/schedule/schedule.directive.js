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
                template: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on('click', function ($event) {
                let modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "schedule-modal right",
                    scope: scope,
                    templateUrl: "app/shared/schedule/schedule.html",
                    controller: "ScheduleController",
                    controllerAs: "ScheduleCtrl",
                    bindToController: true
                }).result.then(
                    function (response) {
                        console.log(response);
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            });
        }
    }

    angular
        .module("Application")
        .controller("ScheduleController", ScheduleController);

    ScheduleController.$inject = ["$uibModalInstance", "authService", "apiService", "helperService", "toastr", "appConfig", "confirmation", "APP_CONSTANT"];

    function ScheduleController($uibModalInstance, authService, apiService, helperService, toastr, appConfig, confirmation, APP_CONSTANT) {
        /* jshint validthis: true */
        var ScheduleCtrl = this;

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
                SourceReference: ScheduleCtrl.sourceReference,
                ClassSource: ScheduleCtrl.classSource,
                ConfigType: ScheduleCtrl.configType,
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };

            ScheduleCtrl.ePage.Masters.CloseScheduleModal = CloseScheduleModal;
            ScheduleCtrl.ePage.Masters.SaveSchedule = SaveSchedule;
            ScheduleCtrl.ePage.Masters.EditSchedule = EditSchedule;
            ScheduleCtrl.ePage.Masters.DeleteSchedule = DeleteScheduleConfirmation;
            ScheduleCtrl.ePage.Masters.SendNow = SendNow;
            ScheduleCtrl.ePage.Masters.Cancel = Cancel;
            ScheduleCtrl.ePage.Masters.AddNew = AddNew;

            ScheduleCtrl.ePage.Masters.IsEditView = false;

            // DatePicker
            ScheduleCtrl.ePage.Masters.DatePicker = {};
            ScheduleCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ScheduleCtrl.ePage.Masters.DatePicker.Options.minDate = new Date();
            ScheduleCtrl.ePage.Masters.DatePicker.isOpen = [];
            ScheduleCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ScheduleCtrl.ePage.Masters.SaveScheduleBtnTxt = "Schedule";
            ScheduleCtrl.ePage.Masters.IsDisableSaveScheduleBtn = false;

            ScheduleCtrl.ePage.Masters.SendNowBtnTxt = "Send Now";
            ScheduleCtrl.ePage.Masters.IsDisableSendNowBtn = false;

            GetScheduledList();
            NewSchedule();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ScheduleCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetScheduledList() {
            ScheduleCtrl.ePage.Masters.ScheduleList = undefined;
            let _filter = angular.copy(ScheduleCtrl.ePage.Masters.Data);
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataConfigScheduler.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response && response.data.Response.length > 0) {
                    ScheduleCtrl.ePage.Masters.ScheduleList = response.data.Response;
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
            _input.RelatedDetails = JSON.stringify(ScheduleCtrl.relatedDetails);

            ScheduleCtrl.ePage.Masters.ActiveSchedule = _input;
        }

        function EditSchedule($item) {
            ScheduleCtrl.ePage.Masters.ActiveSchedule = angular.copy($item);

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
            _item.IsModified = true;
            let _input = _item.PK ? _item : [_item];
            let _api = ScheduleCtrl.ePage.Masters.ActiveSchedule.PK ? "Update" : "Insert";

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API[_api].Url, _input).then(function (response) {
                if (response.data.Response && response.data.Status === "Success") {
                    let _response = (_api === "Insert") ? response.data.Response[0] : response.data.Response;
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

                ScheduleCtrl.ePage.Masters.SaveScheduleBtnTxt = "Schedule";
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

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteSchedule($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteSchedule($item) {
            apiService.get("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.Delete.Url + $item.PK).then(function (response) {
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
            ScheduleCtrl.ePage.Masters.SendNowBtnTxt = "Please Wait...";
            ScheduleCtrl.ePage.Masters.IsDisableSendNowBtn = true;

            let _item = angular.copy($item);
            _item.IsModified = true;
            let _input = _item;

            apiService.post("eAxisAPI", appConfig.Entities.DataConfigScheduler.API.RunScheduleNow.Url, _input).then(function (response) {
                if (response.data.Response && response.data.Status === "Success") {} else {
                    toastr.error("Failed to Send...!");
                }

                ScheduleCtrl.ePage.Masters.SendNowBtnTxt = "Send Now";
                ScheduleCtrl.ePage.Masters.IsDisableSendNowBtn = false;
            });
        }

        Init();
    }
})();
