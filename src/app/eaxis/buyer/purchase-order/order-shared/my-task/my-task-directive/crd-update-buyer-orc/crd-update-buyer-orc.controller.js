(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CrdUpdateBuyerOrcDirectiveController", CrdUpdateBuyerOrcDirectiveController);

    CrdUpdateBuyerOrcDirectiveController.$inject = ["$q", "$timeout", "helperService", "apiService", "appConfig", "APP_CONSTANT", "errorWarningService", "toastr"];

    function CrdUpdateBuyerOrcDirectiveController($q, $timeout, helperService, apiService, appConfig, APP_CONSTANT, errorWarningService, toastr) {
        var CrdUpdateBuyerOrcDirectiveCtrl = this;

        function Init() {
            CrdUpdateBuyerOrcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_CRD_Update",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIOrderList": []
                        }
                    }
                }
            };

            InitSFU();
            TaskGetById();
        }

        function InitSFU() {
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask = CrdUpdateBuyerOrcDirectiveCtrl.taskObj;
            if (CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            // DatePicker
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker = {};
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.Save = Save;
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Cargo Ready Date";
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
        }

        function TaskGetById() {
            if (CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.UIOrderList = CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrderList;
                        response.data.Response.UIOrderList.push(response.data.Response.UIOrder_Buyer);
                        CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ValidationCall();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ValidationCall() {
            // validation findall call
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "CRD"
                },
                // GroupCode: "BUYER_ORD_TRANS",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: ["E2010"]
            };

            errorWarningService.GetErrorCodeList(_obj);
            $timeout(function () {
                CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].GlobalErrorWarningList;
                CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo];
            });
        }

        function Save() {
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Pleae wait...";
            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = true;
            CommonErrorObjInput();
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    var _updateInput = [];
                    var _tempObj = {
                        "EntityRefPK": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                        "Properties": [{
                            "PropertyName": "POH_CargoReadyDate",
                            "PropertyNewValue": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.CargoReadyDate
                        }, {
                            "PropertyName": "POH_Comments",
                            "PropertyNewValue": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.Comments
                        }, {
                            "PropertyName": "POH_OrderStatus",
                            "PropertyNewValue": "CRD"
                        }]
                    };
                    _updateInput.push(_tempObj);
                    apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.updaterecords.Url, _updateInput).then(function (response) {
                        if (response.data.Response) {
                            (CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.Comments) ? JobCommentInsert(response.data.Response).then(function (response) {
                                if (response.data.Status == "Success") {
                                    TaskComplete();
                                } else {
                                    toastr.error("Save failed...");
                                    CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Cargo Ready Date";
                                    CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                                }
                            }): TaskComplete();
                        } else {
                            toastr.error("Save Failed...");
                            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Cargo Ready Date";
                            CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                        }
                    });
                } else {
                    CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Cargo Ready Date";
                    CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            var _jobCommentsArray = [];
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                "EntitySource": "CRD",
                "Comments": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.Comments
            }
            _jobCommentsArray.push(_jobCommentsInput);
            // job comments api call
            if (_jobCommentsArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsArray).then(function (response) {
                    if (response.data.Response) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject('failed');
                        CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Cargo Ready Date";
                        CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                    }
                });
                return deferred.promise;
            }
        }

        function TaskComplete() {
            var _inputObj = {
                "EntityRefCode": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefCode,
                "EntityRefKey": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "CompleteInstanceNo": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                "CompleteStepNo": CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.closecrd.Url, _inputObj).then(function (response) {
                toastr.success("Successfully saved...");
                CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Cargo Ready Date";
                CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                var _data = {
                    IsCompleted: true,
                    Item: CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask
                };

                CrdUpdateBuyerOrcDirectiveCtrl.onComplete({
                    $item: _data
                });
            });
        }

        function CommonErrorObjInput() {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [CrdUpdateBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "CRD"
                },
                // GroupCode: "BUYER_ORD_TRANS",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: CrdUpdateBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: ["E2010"]
            };
            errorWarningService.ValidateValue(_obj);
        }

        Init();
    }
})();