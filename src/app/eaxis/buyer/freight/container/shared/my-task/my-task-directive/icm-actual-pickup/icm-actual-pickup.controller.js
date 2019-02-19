(function () {
    "use strict";

    angular
        .module("Application")
        .controller("IcmActualPickupController", IcmActualPickupController);

    IcmActualPickupController.$inject = ["$window", "$timeout", "$q", "$injector", "APP_CONSTANT", "helperService", "apiService", "authService", "appConfig", "myTaskActivityConfig", "dynamicLookupConfig", "toastr"];

    function IcmActualPickupController($window, $timeout, $q, $injector, APP_CONSTANT, helperService, apiService, authService, appConfig, myTaskActivityConfig, dynamicLookupConfig, toastr) {
        var IcmActualPickupCtrl = this;
        dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            IcmActualPickupCtrl.ePage = {
                "Title": "",
                "Prefix": "Actual Pickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }
            };
            IcmActualPickupCtrl.ePage.Masters.DatePicker = {};
            IcmActualPickupCtrl.ePage.Masters.DatePicker.isOpen = [];
            IcmActualPickupCtrl.ePage.Masters.DatePicker.OptionsDel = APP_CONSTANT.DatePicker;
            IcmActualPickupCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            IcmActualPickupCtrl.ePage.Masters.Complete = Complete;
            IcmActualPickupCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            IcmActualPickupCtrl.ePage.Masters.CompleteBtn = "Update Actual Pickup";


            IcmActualPickupCtrl.ePage.Masters.emptyText = "-";
            if (IcmActualPickupCtrl.taskObj) {
                IcmActualPickupCtrl.ePage.Masters.TaskObj = IcmActualPickupCtrl.taskObj;
                GetEntityObj();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            IcmActualPickupCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function GetEntityObj() {
            if (IcmActualPickupCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                var _filter = {
                    "Batch_FK": IcmActualPickupCtrl.ePage.Masters.TaskObj.EntityRefKey
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.BuyerCntContainer.API.FindAllICM.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.FindAllICM.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        IcmActualPickupCtrl.ePage.Entities.Header.Data.ContainerList = response.data.Response;

                    }
                });
            }
        }

        function Complete() {
            IcmActualPickupCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            IcmActualPickupCtrl.ePage.Masters.CompleteBtn = "Please wait..";
            updateContainerList()
        }

        function updateContainerList() {
            var _containerInput = [];
            var _jobCommentsInput = [];
            IcmActualPickupCtrl.ePage.Entities.Header.Data.ContainerList.map(function (val, key) {
                var commentObj = {};
                commentObj.PK = "";
                commentObj.EntityRefKey = val.PK;
                commentObj.EntitySource = 'CNT';
                commentObj.EntityRefCode = val.ContainerNo;
                commentObj.ParentEntityRefKey = IcmActualPickupCtrl.ePage.Masters.TaskObj.EntityRefKey;
                commentObj.ParentEntityRefCode = IcmActualPickupCtrl.ePage.Masters.TaskObj.KeyReference;
                commentObj.ParentEntitySource = "POB";
                commentObj.Description = val.jobcomment;
                commentObj.CommentsType = "ACPIK";
                commentObj.PartyType_FK = authService.getUserInfo().PartyPK;
                commentObj.PartyType_Code = authService.getUserInfo().PartyCode;
                _jobCommentsInput.push(commentObj);

                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_DepartureActualPickup",
                        "PropertyNewValue": val.DepartureActualPickup
                    }, {
                        "PropertyName": "CNT_Batch_FK",
                        "PropertyNewValue": IcmActualPickupCtrl.ePage.Masters.TaskObj.EntityRefKey
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    jobcommentInsert(_jobCommentsInput);
                } else {
                    toastr.error("Save Failed...");
                    IcmActualPickupCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmActualPickupCtrl.ePage.Masters.CompleteBtn = "Update Actual Pickup";
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
                                Item: IcmActualPickupCtrl.ePage.Masters.TaskObj
                            };

                            IcmActualPickupCtrl.onComplete({
                                $item: _data
                            });
                            IcmActualPickupCtrl.onRefreshStatusCount({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                            IcmActualPickupCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                            IcmActualPickupCtrl.ePage.Masters.CompleteBtn = "Update Actual Pickup";
                        }
                    });
                } else {
                    console.log("Empty comments Response");
                    IcmActualPickupCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    IcmActualPickupCtrl.ePage.Masters.CompleteBtn = "Update Actual Pickup";
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": IcmActualPickupCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": IcmActualPickupCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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