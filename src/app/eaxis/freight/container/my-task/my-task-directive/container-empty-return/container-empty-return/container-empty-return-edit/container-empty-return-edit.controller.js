/*
    Page : Container Empty Return
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerEmptyReturnEditController", ContainerEmptyReturnEditController);

    ContainerEmptyReturnEditController.$inject = ["$rootScope", "$q", "$injector", "helperService", "appConfig", "apiService", "APP_CONSTANT", "toastr", "authService", "errorWarningService"];

    function ContainerEmptyReturnEditController($rootScope, $q, $injector, helperService, appConfig, apiService, APP_CONSTANT, toastr, authService, errorWarningService) {
        var ContainerEmptyReturnEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {

            ContainerEmptyReturnEditCtrl.ePage = {
                "Title": "",
                "Prefix": "CONTAINER_EMPTY_RETURN",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            initContainer();
        }

        // =============================== Container Empty Return Edit Start =================================
        function initContainer() {
            // DatePicker
            ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj = ContainerEmptyReturnEditCtrl.taskObj;
            ContainerEmptyReturnEditCtrl.ePage.Masters.Complete = Complete;
            ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = {}
            ContainerEmptyReturnEditCtrl.ePage.Masters.DropDownMasterList = {};
            ContainerEmptyReturnEditCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            ContainerEmptyReturnEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ContainerEmptyReturnEditCtrl.ePage.Masters.SaveBtnText = "Save";
            ContainerEmptyReturnEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ContainerEmptyReturnEditCtrl.ePage.Masters.AlertBtnText = "send Alert";
            ContainerEmptyReturnEditCtrl.ePage.Masters.DocumentText = "Generate Document";
            ContainerEmptyReturnEditCtrl.ePage.Masters.Doc = false;
            ContainerEmptyReturnEditCtrl.ePage.Masters.DatePicker = {};
            ContainerEmptyReturnEditCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ContainerEmptyReturnEditCtrl.ePage.Masters.DatePicker.isOpen = [];
            ContainerEmptyReturnEditCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ContainerEmptyReturnEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ContainerEmptyReturnEditCtrl.ePage.Masters.JobDocumentCount = null;
            // Callback
            var _isEmpty = angular.equals({}, ContainerEmptyReturnEditCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                //   GetMastersList();
            }
            ContainerEmptyReturnEditCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                "OAD_CarrierAddressFK": helperService.metaBase(),
                "OAD_CreditorAddressFK": helperService.metaBase()
            };
            //console.log(ContainerEmptyReturnEditCtrl.ePage.Masters.DatePicker.Options)
            GetContainer();
            StandardMenuConfig();
            initValidation();
        }
        function GetContainer() {
            if (ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {

                apiService.get("eAxisAPI", appConfig.Entities.CntContainer.API.GetById.Url + ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ContainerEmptyReturnEditCtrl.currentContainer = response.data.Response;
                        ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data.UICntContainers = ContainerEmptyReturnEditCtrl.currentContainer;
                        console.log(ContainerEmptyReturnEditCtrl.currentContainer)
                        GetEntityObj();
                    }
                });
            }
        }
        function GetEntityObj() {

            if (ContainerEmptyReturnEditCtrl.currentContainer.CON_FK) {

                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": {},
                            "Meta": {}
                        }
                    }
                }
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + ContainerEmptyReturnEditCtrl.currentContainer.CON_FK).then(function (response) {
                    if (response.data.Response) {
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data = response.data.Response;
                        ContainerEmptyReturnEditCtrl.currentConsol = obj;
                        ContainerEmptyReturnEditCtrl.currentConsolHeader = ContainerEmptyReturnEditCtrl.currentConsol[ContainerEmptyReturnEditCtrl.currentConsol.label].ePage.Entities.Header.Data.UIConConsolHeader;
                        ContainerEmptyReturnEditCtrl.ePage.Entities = ContainerEmptyReturnEditCtrl.currentConsol[ContainerEmptyReturnEditCtrl.currentConsol.label].ePage.Entities;
                        ContainerEmptyReturnEditCtrl.ePage.Masters.CntList = ContainerEmptyReturnEditCtrl.currentConsol[ContainerEmptyReturnEditCtrl.currentConsol.label].ePage.Entities.Header.Data.UICntContainers;
                        ContainerEmptyReturnEditCtrl.ePage.Masters.ConsolDetails = response.data.Response.UIConShpMappings;
                        ContainerEmptyReturnEditCtrl.ePage.Masters.CntList = ContainerEmptyReturnEditCtrl.currentConsol;
                        console.log(ContainerEmptyReturnEditCtrl.currentConsol)
                        GetShipmentListing();
                    }
                });
            }
        }
        function GetShipmentListing() {
            var _filter = {
                "CON_FK": ContainerEmptyReturnEditCtrl.currentConsol[ContainerEmptyReturnEditCtrl.currentConsol.label].ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    ContainerEmptyReturnEditCtrl.currentConsol[ContainerEmptyReturnEditCtrl.currentConsol.label].ePage.Entities.Header.Data.UIConShpMappings = response.data.Response;
                    $rootScope.GetRotingList();
                    var shpFkList = response.data.Response;
                }
            });
        }
        function initValidation() {
            //ValidationFindall();
        }
        function ValidationFindall() {
            if (ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj) {
                errorWarningService.AddModuleToList("MyTask", ContainerEmptyReturnEditCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "CON",
                    SubModuleCode: "CON"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {
                });
                ContainerEmptyReturnEditCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
                ContainerEmptyReturnEditCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                ContainerEmptyReturnEditCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo];
            }
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ContainerEmptyReturnEditCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["CON_TYPE", "CON_PAYMENT", "CON_SI_FILING_TYPE"];
            var dynamicFindAllInput = [];
            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        ContainerEmptyReturnEditCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ContainerEmptyReturnEditCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        function Validation() {
            var tempArray = []
            if (ContainerEmptyReturnEditCtrl.ePage.Masters.DocListSource.length > 0) {
                ContainerEmptyReturnEditCtrl.ePage.Masters.DocListSource.map(function (val, key) {
                    if (val.DocumentType == 'MBL') {
                        tempArray.push(val);
                    }
                });
                if (tempArray.length > 0) {
                    errorWarningService.OnFieldValueChange("MyTask", ContainerEmptyReturnEditCtrl.taskObj.PSI_InstanceNo, true, 'E0013', false, undefined);
                } else {
                    errorWarningService.OnFieldValueChange("MyTask", ContainerEmptyReturnEditCtrl.taskObj.PSI_InstanceNo, false, 'E0013', false, undefined);
                }

            } else {
                errorWarningService.OnFieldValueChange("MyTask", ContainerEmptyReturnEditCtrl.taskObj.PSI_InstanceNo, false, 'E0013', false, undefined);
            }
        }
        function Complete() {

            //  Validation();
            // if (ContainerEmptyReturnEditCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length == 0) {
            ContainerEmptyReturnEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ContainerEmptyReturnEditCtrl.ePage.Masters.AlertBtnText = "Please Wait...";
            var _input = angular.copy(ContainerEmptyReturnEditCtrl.currentContainer);
            console.log(ContainerEmptyReturnEditCtrl.currentContainer)
            _input.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data = response.data.Response;
                    console.log("Complete");
                    console.log(ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data)
                    ConSave();
                    SaveOnly().then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj
                            };

                            ContainerEmptyReturnEditCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                        }
                        ContainerEmptyReturnEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        ContainerEmptyReturnEditCtrl.ePage.Masters.AlertBtnText = " send Alert";
                    });
                } else {
                    toastr.error("Save Failed...!");
                }
            });
            // } else {
            //     ShowErrorWarningModal(ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo);
            // }

        }
        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }
        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "EntitySource": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "KeyReference": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "IsModified": true
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        function ConSave() {
            var _input = angular.copy(ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data);
            _input.currentontainer.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    Save();
                    console.log(ContainerEmptyReturnEditCtrl.ePage.Entities.Header.Data);
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }
        function StandardMenuConfig() {
            ContainerEmptyReturnEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ContainerEmptyReturnEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ContainerEmptyReturnEditCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
            };
        }
        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }
        // =============================== Container Empty Return Edit End =================================
        Init();
    }
})();