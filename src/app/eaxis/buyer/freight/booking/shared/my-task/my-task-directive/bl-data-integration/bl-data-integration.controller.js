(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BlDataIntegrationDirectiveController", BlDataIntegrationDirectiveController);

    BlDataIntegrationDirectiveController.$inject = ["helperService", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "$filter", "$timeout", "freightApiConfig"];

    function BlDataIntegrationDirectiveController(helperService, $q, apiService, authService, appConfig, toastr, errorWarningService, $filter, $timeout, freightApiConfig) {
        var BlDataIntegrationDirectiveCtrl = this;

        function Init() {
            BlDataIntegrationDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "BL-Data-Integration",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitPoUpload();
        }

        function InitPoUpload() {
            BlDataIntegrationDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            BlDataIntegrationDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask = BlDataIntegrationDirectiveCtrl.taskObj;
            BlDataIntegrationDirectiveCtrl.ePage.Masters.Complete = Complete;

            if (BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
            StandardMenuConfig();
        }

        function TaskGetById() {
            if (BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.getbyid.Url + BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.EntityObj = {};
                        BlDataIntegrationDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;

                    }
                });
            }
        }


        function Complete() {
            BlDataIntegrationDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Please wait..";
            BlDataIntegrationDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = true;
            $timeout(function () {
                CompleteWithSave();
            }, 1000);


        }

        function CompleteWithSave() {
            var _input = InputData(BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task completed succesfully...");
                } else {
                    toastr.error("Task completion failed...");
                }
            });
            BlDataIntegrationDirectiveCtrl.ePage.Masters.CompleteBtnTxt = "Complete";
            BlDataIntegrationDirectiveCtrl.ePage.Masters.CompleteBtnDisabled = false;
            var _data = {
                IsRefreshTask: true,
                IsRefreshStatusCount: true,
                Item: BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask
            };
            BlDataIntegrationDirectiveCtrl.onComplete({
                $item: _data
            });
        }


        function StandardMenuConfig() {
            BlDataIntegrationDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "EntityRefKey": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                // "ParentEntityRefKey": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.WSI_FK,
                // "ParentEntityRefCode": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                // "ParentEntitySource": BlDataIntegrationDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined
                // "IsDisableParentEntity": true,
                // "IsDisableAdditionalEntity": true
            };
            BlDataIntegrationDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };

            BlDataIntegrationDirectiveCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function InputData(_data) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": _data.WSI_StepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();