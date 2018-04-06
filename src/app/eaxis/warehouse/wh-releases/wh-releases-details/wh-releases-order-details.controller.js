(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleaseOrderModalController", ReleaseOrderModalController);

    ReleaseOrderModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "param", "confirmation", "outwardConfig", "releaseConfig"];

    function ReleaseOrderModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, helperService, toastr, param, confirmation, outwardConfig, releaseConfig) {
        var ReleaseOrderModalCtrl = this;

        function Init() {
            ReleaseOrderModalCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderLines_modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            ReleaseOrderModalCtrl.ePage.Masters.Config = releaseConfig;
            ReleaseOrderModalCtrl.ePage.Masters.param = param;
            ReleaseOrderModalCtrl.ePage.Masters.Index = param.List.indexOf(param.Data);
            // ReleaseOrderModalCtrl.ePage.Masters.Save = Save;
            ReleaseOrderModalCtrl.ePage.Masters.Validation = Validation;
            ReleaseOrderModalCtrl.ePage.Masters.Cancel = Cancel;
            ReleaseOrderModalCtrl.ePage.Masters.SaveButtonText = "Save";
            ReleaseOrderModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";

            GetByIdLines();

        }

        function GetByIdLines() {
            apiService.get("eAxisAPI", param.currentRelease.Header.API.OutwardGetByID.Url + param.Data.PK).then(function (response) {
                if (response.data.Response) {
                    ReleaseOrderModalCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                    var _queryString = {
                        PK: ReleaseOrderModalCtrl.ePage.Masters.OutwardDetails.UIWmsOutwardHeader.PK,
                        WorkOrderID: ReleaseOrderModalCtrl.ePage.Masters.OutwardDetails.UIWmsOutwardHeader.WorkOrderID
                    };
                    outwardConfig.GetTabDetails(_queryString, false).then(function (response) {
                        ReleaseOrderModalCtrl.ePage.Masters.TabList = response;
                    });
                }
            });
        }

        function Validation($item, IsSave) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = ReleaseOrderModalCtrl.ePage.Masters.param.currentRelease.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ReleaseOrderModalCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ReleaseOrderModalCtrl.ePage.Masters.param.currentRelease.Header.Validations) {
                ReleaseOrderModalCtrl.ePage.Masters.Config.RemoveApiErrors(ReleaseOrderModalCtrl.ePage.Masters.param.currentRelease.Header, $item.label);
            }

            if (_errorcount.length == 0) {
                if (IsSave == 'Save') {
                    save($item);
                } else {
                    SaveClose($item);
                }

            } else {
                angular.forEach(_errorcount, function (value, key) {
                    toastr.error(value.Code + '-' + value.Message);
                });


            }
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            ReleaseOrderModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";

            if (ReleaseOrderModalCtrl.ePage.Masters.Index != -1) {
                _input.UIWmsOutwardHeader.IsModified = true;

                apiService.post("eAxisAPI", param.currentRelease.Header.API.UpdateOutward.Url, _input).then(function (responses) {
                    if (responses.data.Response) {
                        ReleaseOrderModalCtrl.ePage.Masters.SaveButtonText = "Save";
                        param.List[ReleaseOrderModalCtrl.ePage.Masters.Index] = responses.data.Response.UIWmsOutwardHeader;
                        toastr.success("Line Saved Successfully..")
                    }
                });
            }
        }

        function SaveClose($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            ReleaseOrderModalCtrl.ePage.Masters.SaveCloseButtonText = "Please wait...";

            if (ReleaseOrderModalCtrl.ePage.Masters.Index != -1) {

                _input.UIWmsOutwardHeader.IsModified = true;
                apiService.post("eAxisAPI", param.currentRelease.Header.API.UpdateOutward.Url, _input).then(function (responses) {
                    if (responses.data.Response) {
                        ReleaseOrderModalCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                        param.List[ReleaseOrderModalCtrl.ePage.Masters.Index] = responses.data.Response.UIWmsOutwardHeader;
                        toastr.success("Line Saved Successfully..")
                        $uibModalInstance.dismiss('close');
                    }
                });

            }
        }

        function Cancel() {
            if (param.Action == 'edit') {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Close?',
                    bodyText: 'Would you like to close without saving your changes?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        param.List[ReleaseOrderModalCtrl.ePage.Masters.Index] = ReleaseOrderModalCtrl.ePage.Masters.OutwardDetailsCopy;
                        $uibModalInstance.dismiss('close');
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {

                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Close?',
                    bodyText: 'Would you like to close without saving your changes?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        $uibModalInstance.dismiss('close');
                    }, function () {
                        console.log("Cancelled");
                    });
            }

        }

        Init();
    }
})();