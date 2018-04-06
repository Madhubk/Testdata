/*
    Page : Collect Payment for GST Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PaymentforGSTEditDirectiveController", PaymentforGSTEditDirectiveController);

    PaymentforGSTEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function PaymentforGSTEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var PaymentforGSTEditDirectiveCtrl = this;

        function Init() {
            PaymentforGSTEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj = PaymentforGSTEditDirectiveCtrl.taskObj;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.EntityObj = PaymentforGSTEditDirectiveCtrl.entityObj;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.Save = Save;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            PaymentforGSTEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!PaymentforGSTEditDirectiveCtrl.ePage.Masters.EntityObj) {
            //     GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            GetOrganizationList();
            GetDocumentTypeList();
            GetEntityObj();
            //     GetMasterDropdownList();
            // }
        }

        function IsSuppRequired() {
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "false",
                "DisplayName": "No"
            }];
        }

        function GetDocumentTypeList() {
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PaymentforGSTEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function GetOrganizationList() {
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSHA",
                "DisplayName": "DEMSUPSHA"
            }];
        }

        function GetEntityObj() {
            if (PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        PaymentforGSTEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function StandardMenuConfig() {
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    PaymentforGSTEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            PaymentforGSTEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(PaymentforGSTEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                PaymentforGSTEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                PaymentforGSTEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": PaymentforGSTEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": PaymentforGSTEditDirectiveCtrl.ePage.Masters.SuppRequired,
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": "",
                    "Labels": {
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
                },
                "IsModified": 'true',
                "IsDeleted": 'false',
            }

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        Init();
    }
})();