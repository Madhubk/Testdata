(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessWorkStepController", ProcessWorkStepController);

    ProcessWorkStepController.$inject = ["$scope", "$location", "authService", "apiService", "helperService", "appConfig", "toastr", "confirmation", "jsonEditModal", "$uibModal"];

    function ProcessWorkStepController($scope, $location, authService, apiService, helperService, appConfig, toastr, confirmation, jsonEditModal, $uibModal) {
        /* jshint validthis: true */
        var ProcessWorkStepCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessWorkStepCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessWorkStep",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessWorkStepCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                ProcessWorkStepCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitProcessWorkStep();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ProcessWorkStepCtrl.ePage.Masters.Breadcrumb = {};
            ProcessWorkStepCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle="";
            if(ProcessWorkStepCtrl.ePage.Masters.QueryString.BreadcrumbTitle)
            {
                _breadcrumbTitle = " (" + ProcessWorkStepCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            ProcessWorkStepCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "configuration",
                Description: "Configuration",
                Link: "TC/dashboard/" + helperService.encryptData('{"Type":"Configuration", "BreadcrumbTitle": "Configuration"}'),
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "process",
                Description: "Process",
                Link: "TC/process",
                IsRequireQueryString: true,
                QueryStringObj:{
                    "AppPk":ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode":ProcessWorkStepCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName":ProcessWorkStepCtrl.ePage.Masters.QueryString.AppName,
                },
                IsActive: false
            }, {
                Code: "processworkstep",
                Description: "Process Work Step" + _breadcrumbTitle,
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        function InitProcessWorkStep() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep = {};
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.EditStep = EditStep;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.CloseStep = CloseStep;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OpenJsonModal = OpenJsonModal;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OnAccessClick = OnAccessClick;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.OnProcessWorkStepClick = OnProcessWorkStepClick;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.AddNewStep = AddNewStep;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepListClick = ProcessWorkStepListClick;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.Save = Save;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RemoveRecord = Delete;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.InitStepNoHoverIn = InitStepNoHoverIn;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.InitStepNoHoverOut = InitStepNoHoverOut;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SelectedIconColor = SelectedIconColor;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.GetProcessWorkStepList = GetProcessWorkStepList;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SaveBtnText = "Save";
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.IsDisableSaveBtn = false;

            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.RulesList = ["BEFORE_INIT", "AFTER_INIT", "BEFORE_COMPLETE", "AFTER_COMPLETE"];

            GetProcessWorkStepList();
            GetTypeList();
        }

        function GetTypeList() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.TypeList = [{
                Code: "ACTIVITY",
                Name: "ACTIVITY"
            }, {
                Code: "DECISION",
                Name: "DECISION"
            }, {
                Code: "END",
                Name: "END"
            }];
        }

        function OpenJsonModal($item, modelName) {
            var modalDefaults = {
                resolve: {
                    param: function () {
                        var exports = {
                            "Data": $item[modelName]
                        };
                        return exports;
                    }
                }
            };

            jsonEditModal.showModal(modalDefaults, {})
                .then(function (result) {
                    $item[modelName] = result;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function GetProcessWorkStepList() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = undefined;
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = undefined;
            var _filter = {
                "PSM_FK": ProcessWorkStepCtrl.ePage.Masters.QueryString.Item.PK,
                "SortColumn": "WSI_StepNo",
                "SortType": "ASC",
                "PageSize": "100",
                "PageNumber": "1",
                "SAP_FK": ProcessWorkStepCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkStepInfo.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepInfo.API.DynamicFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = response.data.Response;
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepListCopy = angular.copy(response.data.Response);
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.map(function (val, key) {
                        val["Mode"] = [{
                            "BEFORE_INIT": "BEFORE_INIT",
                            "AFTER_INIT": "AFTER_INIT",
                            "BEFORE_COMPLETE": "BEFORE_COMPLETE",
                            "AFTER_COMPLETE": "AFTER_COMPLETE"
                        }];

                        if (val.OtherConfig && typeof val.OtherConfig == "string") {
                            val.OtherConfig = JSON.parse(val.OtherConfig);
                        }
                    });

                    ProcessWorkStepListClick(ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[0]);
                } else {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList = [];
                }
            });
        }

        function OnAccessClick($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "process-work-step-access-edit right",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-work-step/process-work-step-access/process-work-step-access.html",
                controller: 'ProcessWorkStepAccessModalController as ProcessWorkStepAccessModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function AddNewStep(stepType) {
            var _stepNo = 1;
            var _stepNoList = [];

            if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList) {
                if (ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.length > 0) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.map(function (value, key) {
                        _stepNoList.push(value.StepNo);
                    });

                    if (_stepNoList.length == 0) {
                        _stepNoList.push(1);
                    }
                    Array.prototype.max = function () {
                        return Math.max.apply(null, this);
                    };

                    _stepNo = _stepNoList.max() + 1;
                } else {
                    _stepNo = 1;
                }
            }

            var _obj = {
                "StepNo": _stepNo,
                "StepCode": ProcessWorkStepCtrl.ePage.Masters.QueryString.Item.ProcessCode + "_" + _stepNo,
                "StepType": stepType
            };

            if (stepType == "END") {
                _obj.StepCode = stepType;
                _obj.StepName = stepType;
                _obj.Description = stepType;
                _obj.CompletedStepName = stepType;
            }

            Save(_obj);
        }

        function EditStepModalPopup() {
            return ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "process-work-step",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-work-step/process-work-step-modal.html"
            });
        }

        function EditStep($item) {
            EditStepModalPopup().result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseStep() {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.modalInstance.dismiss('cancel');
        }

        function ProcessWorkStepListClick($item) {
            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = $item;
        }

        function OnProcessWorkStepClick($item, mode) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "process-work-step-rules",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-work-step/process-work-step-rules/process-work-step-rules.html",
                controller: 'ProcessWorkStepRulesController as ProcessWorkStepRulesCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Item": $item,
                            "Mode": mode
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {
                GetProcessWorkStepList();
            }, function () {
                console.log("Cancelled");
            });
        }

        function Save($item) {
            var _isEmpty = angular.equals({}, $item);

            if (!_isEmpty) {
                if ($item.StepNo) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SaveBtnText = "Please Wait...";
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.IsDisableSaveBtn = true;

                    var _input = angular.copy($item);

                    _input.IsModified = true;
                    _input.IsDeleted = false;
                    _input.PSM_FK = ProcessWorkStepCtrl.ePage.Masters.QueryString.Item.PK;
                    if (typeof _input.OtherConfig == "object") {
                        _input.OtherConfig = JSON.stringify(_input.OtherConfig);
                    }

                    apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepInfo.API.Upsert.Url, [_input]).then(function (response) {
                        if (response.data.Response) {
                            var _response = response.data.Response[0];
                            if ($item.PK) {
                                var _index = ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.map(function (value, key) {
                                    return value.PK;
                                }).indexOf(_response.PK);

                                if (_index !== -1) {
                                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[_index] = _response;

                                    if (_response.OtherConfig && typeof _response.OtherConfig == "string") {
                                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList[_index].OtherConfig = JSON.parse(_response.OtherConfig);
                                    }
                                }
                            } else {
                                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.push(_response);
                                EditStep(_response);
                            }

                            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = _response;
                        } else {
                            ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps = undefined;
                        }

                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.SaveBtnText = "Save";
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.IsDisableSaveBtn = false;
                    });
                } else {
                    toastr.warning("Please Enter Step No.");
                }
            }
        }

        function Delete($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveRecord($item, $index) {
            if ($item.PK) {
                $item.IsModified = true;
                $item.IsDeleted = true;
                var _input = [$item];

                apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepInfo.API.Upsert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.splice($index, 1);
                    }
                });
            } else {
                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ProcessWorkStepList.splice($index, 1);
            }
        }

        function InitStepNoHoverIn($item) {
            $("#ProcessWorkStepNo" + $item.InitStepNo).addClass('highlight');
        }

        function InitStepNoHoverOut($item) {
            $("#ProcessWorkStepNo" + $item.InitStepNo).removeClass('highlight');
        }

        function SelectedIconColor($item, type) {
            if ($item) {
                if (!ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig) {
                    ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig = {};
                }

                ProcessWorkStepCtrl.ePage.Masters.ProcessWorkStep.ActiveProcessWorkSteps.OtherConfig[type] = $item;
            }
        }

        Init();
    }

})();
