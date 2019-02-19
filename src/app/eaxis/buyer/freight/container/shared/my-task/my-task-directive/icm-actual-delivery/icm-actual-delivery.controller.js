(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IcmActualDeliveryController", IcmActualDeliveryController);

    IcmActualDeliveryController.$inject = ["$window", "$timeout", "$q", "$injector", "APP_CONSTANT", "helperService", "apiService", "authService", "appConfig", "myTaskActivityConfig", "dynamicLookupConfig", "toastr"];

    function IcmActualDeliveryController($window, $timeout, $q, $injector, APP_CONSTANT, helperService, apiService, authService, appConfig, myTaskActivityConfig, dynamicLookupConfig, toastr) {
        var IcmActualDeliveryCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            IcmActualDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Actual Delivery",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }
            };
            IcmActualDeliveryCtrl.ePage.Masters.DatePicker = {};
            IcmActualDeliveryCtrl.ePage.Masters.DatePicker.isOpen = [];
            IcmActualDeliveryCtrl.ePage.Masters.DatePicker.OptionsDel = APP_CONSTANT.DatePicker;
            IcmActualDeliveryCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            IcmActualDeliveryCtrl.ePage.Masters.Complete = Complete;
            IcmActualDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IcmActualDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Actual Delivery";


            IcmActualDeliveryCtrl.ePage.Masters.emptyText = "-";
            if (IcmActualDeliveryCtrl.taskObj) {
                IcmActualDeliveryCtrl.ePage.Masters.TaskObj = IcmActualDeliveryCtrl.taskObj;
                GetEntityObj();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            IcmActualDeliveryCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function GetEntityObj() {
            if (IcmActualDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                var _filter = {
                    "Batch_FK": IcmActualDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAllICM.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.FindAllICM.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        IcmActualDeliveryCtrl.ePage.Entities.Header.Data.ContainerList = response.data.Response;
                        myTaskActivityConfig.Entities.ContainerList = IcmActualDeliveryCtrl.ePage.Entities.Header.Data.ContainerList;
                        myTaskActivityConfig.Entities.TaskObj = IcmActualDeliveryCtrl.ePage.Masters.TaskObj;

                    }
                });
            }
        }

        function Complete() {
            IcmActualDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            IcmActualDeliveryCtrl.ePage.Masters.CompleteBtn = "Please wait..";
            updateContainerList()
        }

        function updateContainerList() {
            var _containerInput = [];
            var _jobCommentsInput = [];
            IcmActualDeliveryCtrl.ePage.Entities.Header.Data.ContainerList.map(function (val, key) {
                var commentObj = {};
                commentObj.PK = "";
                commentObj.EntityRefKey = val.PK;
                commentObj.EntitySource = 'CNT';
                commentObj.EntityRefCode = val.ContainerNo;
                commentObj.ParentEntityRefKey = IcmActualDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey;
                commentObj.ParentEntityRefCode = IcmActualDeliveryCtrl.ePage.Masters.TaskObj.KeyReference;
                commentObj.ParentEntitySource = "POB";
                commentObj.Description = val.jobcomment;
                commentObj.CommentsType = "ACDLV";
                commentObj.PartyType_FK = authService.getUserInfo().PartyPK;
                commentObj.PartyType_Code = authService.getUserInfo().PartyCode;
                _jobCommentsInput.push(commentObj);

                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_ActualDelivery",
                        "PropertyNewValue": val.ActualDelivery
                    }, {
                        "PropertyName": "CNT_Batch_FK",
                        "PropertyNewValue": IcmActualDeliveryCtrl.ePage.Masters.TaskObj.EntityRefKey
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    jobcommentInsert(_jobCommentsInput);
                } else {
                    toastr.error("Save Failed...");
                    IcmActualDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmActualDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Actual Delivery";
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
                                Item: IcmActualDeliveryCtrl.ePage.Masters.TaskObj
                            };

                            IcmActualDeliveryCtrl.onComplete({
                                $item: _data
                            });
                            IcmActualDeliveryCtrl.onRefreshStatusCount({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                            IcmActualDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            IcmActualDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Actual Delivery";
                        }
                    });
                } else {
                    console.log("Empty comments Response");
                    IcmActualDeliveryCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmActualDeliveryCtrl.ePage.Masters.CompleteBtn = "Update Actual Delivery";
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IcmActualDeliveryCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IcmActualDeliveryCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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