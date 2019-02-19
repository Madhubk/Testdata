(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IcmActualEmptyReturnController", IcmActualEmptyReturnController);

    IcmActualEmptyReturnController.$inject = ["$window", "$timeout", "$q", "$injector", "APP_CONSTANT", "helperService", "apiService", "authService", "appConfig", "myTaskActivityConfig", "dynamicLookupConfig", "toastr"];

    function IcmActualEmptyReturnController($window, $timeout, $q, $injector, APP_CONSTANT, helperService, apiService, authService, appConfig, myTaskActivityConfig, dynamicLookupConfig, toastr) {
        var IcmActualEmptyReturnCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            IcmActualEmptyReturnCtrl.ePage = {
                "Title": "",
                "Prefix": "Actual Empty Return",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }
            };
            IcmActualEmptyReturnCtrl.ePage.Masters.DatePicker = {};
            IcmActualEmptyReturnCtrl.ePage.Masters.DatePicker.isOpen = [];
            IcmActualEmptyReturnCtrl.ePage.Masters.DatePicker.OptionsDel = APP_CONSTANT.DatePicker;
            IcmActualEmptyReturnCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            IcmActualEmptyReturnCtrl.ePage.Masters.Complete = Complete;
            IcmActualEmptyReturnCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IcmActualEmptyReturnCtrl.ePage.Masters.CompleteBtn = "Update Actual Empty Return";


            IcmActualEmptyReturnCtrl.ePage.Masters.emptyText = "-";
            if (IcmActualEmptyReturnCtrl.taskObj) {
                IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj = IcmActualEmptyReturnCtrl.taskObj;
                GetEntityObj();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            IcmActualEmptyReturnCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function GetEntityObj() {
            if (IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                var _filter = {
                    "Batch_FK": IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.EntityRefKey
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAllICM.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.FindAllICM.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        IcmActualEmptyReturnCtrl.ePage.Entities.Header.Data.ContainerList = response.data.Response;
                        myTaskActivityConfig.Entities.ContainerList = IcmActualEmptyReturnCtrl.ePage.Entities.Header.Data.ContainerList;
                        myTaskActivityConfig.Entities.TaskObj = IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj;

                    }
                });
            }
        }

        function Complete() {
            IcmActualEmptyReturnCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            IcmActualEmptyReturnCtrl.ePage.Masters.CompleteBtn = "Please wait..";
            updateContainerList()
        }

        function updateContainerList() {
            var _containerInput = [];
            var _jobCommentsInput = [];
            IcmActualEmptyReturnCtrl.ePage.Entities.Header.Data.ContainerList.map(function (val, key) {
                var commentObj = {};
                commentObj.PK = "";
                commentObj.EntityRefKey = val.PK;
                commentObj.EntitySource = 'CNT';
                commentObj.EntityRefCode = val.ContainerNo;
                commentObj.ParentEntityRefKey = IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.EntityRefKey;
                commentObj.ParentEntityRefCode = IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.KeyReference;
                commentObj.ParentEntitySource = "POB";
                commentObj.Description = val.jobcomment;
                commentObj.CommentsType = "ACERN";
                commentObj.PartyType_FK = authService.getUserInfo().PartyPK;
                commentObj.PartyType_Code = authService.getUserInfo().PartyCode;
                _jobCommentsInput.push(commentObj);

                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_EmptyReturnedOn",
                        "PropertyNewValue": val.EmptyReturnedOn
                    }, {
                        "PropertyName": "CNT_Batch_FK",
                        "PropertyNewValue": IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.EntityRefKey
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    jobcommentInsert(_jobCommentsInput);
                } else {
                    toastr.error("Save Failed...");
                    IcmActualEmptyReturnCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmActualEmptyReturnCtrl.ePage.Masters.CompleteBtn = "Update Actual Empty Return";
                }
            });


        }

        function jobcommentInsert(_jobCommentsInput) {
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsInput).then(function (response) {
                if (response.data.Response) {
                    SaveOnly().then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj
                            };

                            IcmActualEmptyReturnCtrl.onComplete({
                                $item: _data
                            });
                            IcmActualEmptyReturnCtrl.onRefreshStatusCount({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                            IcmActualEmptyReturnCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            IcmActualEmptyReturnCtrl.ePage.Masters.CompleteBtn = "Update Actual Empty Return";
                        }
                    });
                } else {
                    console.log("Empty comments Response");
                    IcmActualEmptyReturnCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmActualEmptyReturnCtrl.ePage.Masters.CompleteBtn = "Update Actual Empty Return";
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IcmActualEmptyReturnCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": ""

                }
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }


        Init();
    }
})();