(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IcmPlannedDeliveryController", IcmPlannedDeliveryController);

    IcmPlannedDeliveryController.$inject = ["$window", "$timeout", "$q", "$injector", "APP_CONSTANT", "helperService", "apiService", "authService", "appConfig", "myTaskActivityConfig", "dynamicLookupConfig", "toastr"];

    function IcmPlannedDeliveryController($window, $timeout, $q, $injector, APP_CONSTANT, helperService, apiService, authService, appConfig, myTaskActivityConfig, dynamicLookupConfig, toastr) {
        var IcmPlannedDeliveryCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            IcmPlannedDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Planned Delivery",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }
            };
            IcmPlannedDeliveryCtrl.ePage.Masters.DatePicker = {};
            IcmPlannedDeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            IcmPlannedDeliveryCtrl.ePage.Masters.DatePicker.OptionsDel = APP_CONSTANT.DatePicker;
            IcmPlannedDeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            IcmPlannedDeliveryCtrl.ePage.Masters.Complete = Complete;
            IcmPlannedDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IcmPlannedDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Planned Delivery";


            IcmPlannedDeliveryCtrl.ePage.Masters.emptyText = "-";
            if (IcmPlannedDeliveryCtrl.taskObj) {
                IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj = IcmPlannedDeliveryCtrl.taskObj;
                GetEntityObj();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            IcmPlannedDeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function GetEntityObj() {
            if (IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                var _filter = {
                    "Batch_FK": IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAllICM.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.FindAllICM.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        IcmPlannedDeliveryCtrl.ePage.Entities.Header.Data.ContainerList = response.data.Response;
                    }
                });
            }
        }

        function Complete() {
            IcmPlannedDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            IcmPlannedDeliveryCtrl.ePage.Masters.CompleteBtn = "Please wait..";
            updateContainerList()
        }

        function updateContainerList() {
            var _containerInput = [];
            var _jobCommentsInput = [];
            IcmPlannedDeliveryCtrl.ePage.Entities.Header.Data.ContainerList.map(function (val, key) {
                var commentObj = {};
                commentObj.PK = "";
                commentObj.EntityRefKey = val.PK;
                commentObj.EntitySource = 'CNT';
                commentObj.EntityRefCode = val.ContainerNo;
                commentObj.ParentEntityRefKey = IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey;
                commentObj.ParentEntityRefCode = IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.KeyReference;
                commentObj.ParentEntitySource = "POB";
                commentObj.Description = val.jobcomment;
                commentObj.CommentsType = "PLDLV";
                commentObj.PartyType_FK = authService.getUserInfo().PartyPK;
                commentObj.PartyType_Code = authService.getUserInfo().PartyCode;
                _jobCommentsInput.push(commentObj);

                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_PlannedDelivery",
                        "PropertyNewValue": val.PlannedDelivery
                    }, {
                        "PropertyName": "CNT_Batch_FK",
                        "PropertyNewValue": IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    jobcommentInsert(_jobCommentsInput);
                } else {
                    toastr.error("Save Failed...");
                    IcmPlannedDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmPlannedDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Planned Delivery";
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
                                Item: IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj
                            };

                            IcmPlannedDeliveryCtrl.onComplete({
                                $item: _data
                            });
                            IcmPlannedDeliveryCtrl.onRefreshStatusCount({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                            IcmPlannedDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            IcmPlannedDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Planned Delivery";
                        }
                    });
                } else {
                    console.log("Empty comments Response");
                    IcmPlannedDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmPlannedDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Planned Delivery";
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IcmPlannedDeliveryCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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