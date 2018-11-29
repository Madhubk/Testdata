/*
    Page : Prepare HBL Edit 
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ObtainDestuffEditController", ObtainDestuffEditController);

    ObtainDestuffEditController.$inject = ["$q", "helperService", "appConfig", "apiService", "APP_CONSTANT", "toastr", "authService", "errorWarningService"];

    function ObtainDestuffEditController($q, helperService, appConfig, apiService, APP_CONSTANT, toastr, errorWarningService) {
        var ObtainDestuffEditDirCtrl = this;

        function Init() {
            ObtainDestuffEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Obtain_Destuff_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            // DatePicker
            ObtainDestuffEditDirCtrl.ePage.Masters.DatePicker = {};
            ObtainDestuffEditDirCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ObtainDestuffEditDirCtrl.ePage.Masters.DatePicker.isOpen = [];
            ObtainDestuffEditDirCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ObtainDestuff();
            ObtainDestuffEditDirCtrl.ePage.Masters.TableProperties = {
                "HeaderProperties": [
                    {
                        "columnname": "Container No",
                        "isenabled": true,
                        "property": "containerno",
                        "position": "1",
                        "width": "200",
                        "display": false
                    },
                    {
                        "columnname": "Container Mode",
                        "isenabled": true,
                        "property": "containermode",
                        "position": "1",
                        "width": "200",
                        "display": false
                    },
                    {
                        "columnname": "Container Status",
                        "isenabled": true,
                        "property": "containerstatus",
                        "position": "1",
                        "width": "320",
                        "display": false
                    },
                    {
                        "columnname": "Delivery Mode",
                        "isenabled": true,
                        "property": "deliverymode",
                        "position": "1",
                        "width": "200",
                        "display": false
                    },
                    {
                        "columnname": "Is Empty Container",
                        "isenabled": true,
                        "property": "isemptycontainer",
                        "position": "1",
                        "width": "200",
                        "display": false
                    }
                ],
                "containerno": {
                    "isenabled": true,
                    "position": "2",
                    "width": "200"
                },
                "containermode": {
                    "isenabled": true,
                    "position": "3",
                    "width": "200"
                },
                "containerstatus": {
                    "isenabled": true,
                    "position": "4",
                    "width": "320"
                },
                "deliverymode": {
                    "isenabled": true,
                    "position": "5",
                    "width": "200"
                },
                "isemptycontainer": {
                    "isenabled": true,
                    "position": "6",
                    "width": "200"
                }
            }
        }

        // =============================== Prepare HBL Edit Start =================================
        function ObtainDestuff() {
            ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj = ObtainDestuffEditDirCtrl.taskObj;
            ObtainDestuffEditDirCtrl.ePage.Masters.Save = Save;
            ObtainDestuffEditDirCtrl.ePage.Masters.Complete = Complete;
            ObtainDestuffEditDirCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService
            ObtainDestuffEditDirCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange

            ObtainDestuffEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ObtainDestuffEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
            GetEntityObj();
            GetShipmentListing();
        }
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ObtainDestuffEditDirCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Meta": {}
                    }
                }
            };
            if (ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ObtainDestuffEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                        StandardMenuConfig();
                        _exports.Entities.Header.Data = response.data.Response;
                        console.log(_exports.Entities.Header.Data);
                        var obj = {
                            [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIShipmentHeader.ShipmentNo,
                            code: response.data.Response.UIShipmentHeader.ShipmentNo,
                            isNew: false
                        };
                        ObtainDestuffEditDirCtrl.currentShipment = obj;
                        ObtainDestuffEditDirCtrl.ePage.Masters.TableValues = {
                            "HeaderProperties": [
                                {
                                    "columnname": "Container Count",
                                    "isenabled": true,
                                    "property": "containercount",
                                    "position": "1",
                                    "width": "300",
                                    "display": false
                                }, {
                                    "columnname": "Container Type",
                                    "isenabled": true,
                                    "property": "containertype",
                                    "position": "2",
                                    "width": "300",
                                    "display": false
                                }, {
                                    "columnname": "Commodity",
                                    "isenabled": true,
                                    "property": "Commodity",
                                    "position": "3",
                                    "width": "300",
                                    "display": false
                                }
                            ],
                            "containercount": {
                                "isenabled": true,
                                "position": "1",
                                "width": "300"
                            },
                            "containertype": {
                                "isenabled": true,
                                "position": "2",
                                "width": "300"
                            },
                            "Commodity": {
                                "isenabled": true,
                                "position": "3",
                                "width": "300"
                            }
                        }
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function GetShipmentListing() {
            var _filter = {
                "SHP_FK": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ObtainDestuffEditDirCtrl.ePage.Masters.ConShpObj = response.data.Response;
                    if (ObtainDestuffEditDirCtrl.ePage.Masters.ConShpObj.length > 0) {
                        ObtainDestuffEditDirCtrl.ePage.Masters.ConShpObj.map(function (value, key) {
                            GetConList(value.CON_FK);
                        });
                    }
                }
            });
        }

        function GetConList(data) {
            if (data) {
                var _exports = {
                    "Entities": {
                        "Header": {
                            "Data": {},
                            "Meta": {}
                        }
                    }
                };
                apiService.get("eAxisAPI", appConfig.Entities.ConsolList.API.GetByID.Url + data).then(function (response) {
                    if (response.data.Response) {
                        ObtainDestuffEditDirCtrl.ePage.Entities.Header.ConData = response.data.Response;
                        _exports.Entities.Header.Data = response.data.Response;
                        var obj = {
                            [response.data.Response.UIConConsolHeader.ConsolNo]: {
                                ePage: _exports
                            },
                            label: response.data.Response.UIConConsolHeader.ConsolNo,
                            code: response.data.Response.UIConConsolHeader.ConsolNo,
                            isNew: false
                        };
                        ObtainDestuffEditDirCtrl.currentConsol = obj;
                        GetJobRoutesDetails(data);
                    }
                });
            }
        }

        function GetJobRoutesDetails(data) {
            var _filter = {
                "EntityRefKey": data,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ObtainDestuffEditDirCtrl.currentConsol[ObtainDestuffEditDirCtrl.currentConsol.label].ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                }
            });
        }

        function GeneralValidation() {
            ObtainDestuffEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ObtainDestuffEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
        }

        function Complete() {
            helperService.scrollElement('top')
            var _obj = {
                ModuleName: ["BookingBranch"],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    Code: "E0049"
                },
                GroupCode: "",
                RelatedBasicDetails: [],
                EntityObject: ObtainDestuffEditDirCtrl.currentShipment[ObtainDestuffEditDirCtrl.currentShipment.label].ePage.Entities.Header.Data,
            }
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[ObtainDestuffEditDirCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    BookingBranchCtrl.ePage.Masters.config.ShowErrorWarningModal($item);
                    GeneralValidation();
                } else {
                        ObtainDestuffEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                        ObtainDestuffEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                        ConSave();
                }
            });
        }

        function ConSave() {
            var _input = angular.copy(ObtainDestuffEditDirCtrl.ePage.Entities.Header.ConData);
            _input.UIConConsolHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ConsolList.API.Update.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    Save();
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function Save() {

            var _input = angular.copy(ObtainDestuffEditDirCtrl.ePage.Entities.Header.Data);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.isModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ObtainDestuffEditDirCtrl.ePage.Entities.Header.Data = response.data.Response;
                    response.data.Response.UIJobEntryNums.map(function (value, key) {
                        if (value.Category === "CUS") {
                            ObtainDestuffEditDirCtrl.ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                        }
                    });
                    SaveOnly();
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj
                    };

                    ObtainDestuffEditDirCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                ObtainDestuffEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                ObtainDestuffEditDirCtrl.ePage.Masters.CompleteBtnText = "complete";
                deferred.resolve(response);
                return deferred.promise;
            });
        }

        function StandardMenuConfig() {
            ObtainDestuffEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.ProcessName,
                "EntityRefKey": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ObtainDestuffEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true,
                "RowObj": ObtainDestuffEditDirCtrl.ePage.Entities.Header.Data
            };

            ObtainDestuffEditDirCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableRelatedDocument: true,
            };
            ObtainDestuffEditDirCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["BookingBranch"],
                Code: [ObtainDestuffEditDirCtrl.currentShipment.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_Test",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject: ObtainDestuffEditDirCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }
        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }
        // =============================== Prepare HBL Edit End =================================
        Init();
    }
})();
