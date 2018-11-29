(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdConfirmBuyerOrcDirectiveController", OrdConfirmBuyerOrcDirectiveController);

    OrdConfirmBuyerOrcDirectiveController.$inject = ["$timeout", "helperService", "apiService", "appConfig", "APP_CONSTANT", "errorWarningService", "toastr"];

    function OrdConfirmBuyerOrcDirectiveController($timeout, helperService, apiService, appConfig, APP_CONSTANT, errorWarningService, toastr) {
        var OrdConfirmBuyerOrcDirectiveCtrl = this;

        function Init() {
            OrdConfirmBuyerOrcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Confirm",
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

            InitOrderConfirmation();
        }

        function InitOrderConfirmation() {
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask = OrdConfirmBuyerOrcDirectiveCtrl.taskObj;
            if (OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
            // DatePicker
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker = {};
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.Save = Save;
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Confirm No";
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.CommonErrorObjInput = CommonErrorObjInput;
        }

        function TaskGetById() {
            if (OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.UIOrderList = OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrderList;
                        response.data.Response.UIOrderList.push(response.data.Response.UIOrder_Buyer);
                        OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                        OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                        ValidationCall();
                    } else {}
                });
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ValidationCall() {
            // validation findall call
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "ORDER_CONFIRM",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: ["EC021", "EC020"]
            };

            errorWarningService.GetErrorCodeList(_obj);
            
            $timeout(function () {
                OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].GlobalErrorWarningList;
                OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo];
            });
        }

        function Save() {
            CommonErrorObjInput(['EC021', 'EC020']);
            $timeout(function () {
                OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Pleae wait...";
                OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = true;
                var _errorcount = errorWarningService.Modules.MyTask.Entity[OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    var _updateInput = [];
                    var _tempObj = {
                        "EntityRefPK": OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                        "Properties": [{
                            "PropertyName": "POH_ConfirmDate",
                            "PropertyNewValue": OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ConfirmDate
                        }, {
                            "PropertyName": "POH_ConfirmNo",
                            "PropertyNewValue": OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ConfirmNo
                        }]
                    };
                    _updateInput.push(_tempObj);
                    apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.updaterecords.Url, _updateInput).then(function (response) {
                        if (response.data.Response) {
                            TaskComplete();
                        } else {
                            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Confirm No";
                            OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                            toastr.error("Save Failed...");
                        }
                    });
                } else {
                    OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Confirm No";
                    OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                }
            });
        }

        function TaskComplete() {
            var _inputObj = {
                "CompleteInstanceNo": OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                "CompleteStepNo": OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.WSI_StepNo,
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
                toastr.success("Successfully saved...");
                OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.SaveButtonText = "Update Confirm No";
                OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.IsDisableSave = false;
                var _data = {
                    IsCompleted: true,
                    Item: OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask
                };

                OrdConfirmBuyerOrcDirectiveCtrl.onComplete({
                    $item: _data
                });
            });
        }

        function CommonErrorObjInput(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [OrdConfirmBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "ORDER_CONFIRM",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: OrdConfirmBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? code : []
            };
            errorWarningService.ValidateValue(_obj);
        }
        Init();
    }
})();