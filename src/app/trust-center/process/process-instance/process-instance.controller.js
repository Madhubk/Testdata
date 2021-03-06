(function () {
    "use strict;"

    angular
        .module("Application")
        .controller("ProcessInstanceController", ProcessInstanceController);

    ProcessInstanceController.$inject = ["$scope", "$timeout", "$location", "helperService", "processinstanceConfig", "toastr", "$uibModal", "authService"];

    function ProcessInstanceController($scope, $timeout, $location, helperService, processinstanceConfig, toastr, $uibModal, authService) {
        var ProcessInstanceCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessInstanceCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_Process",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": processinstanceConfig.Entities
            };

            ProcessInstanceCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                ProcessInstanceCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (ProcessInstanceCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitInstance();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            ProcessInstanceCtrl.ePage.Masters.Breadcrumb = {};
            ProcessInstanceCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            var _breadcrumbTitle = "";
            if (ProcessInstanceCtrl.ePage.Masters.QueryString.BreadcrumbTitle) {
                _breadcrumbTitle = " (" + ProcessInstanceCtrl.ePage.Masters.QueryString.BreadcrumbTitle + ")";
            }

            ProcessInstanceCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ProcessInstanceCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ProcessInstanceCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ProcessInstanceCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "process",
                Description: "Process",
                Link: "TC/process",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": ProcessInstanceCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ProcessInstanceCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ProcessInstanceCtrl.ePage.Masters.QueryString.AppName,
                },
                IsActive: false
            }, {
                Code: "processinstance",
                Description: "Process Instance" + _breadcrumbTitle,
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

        function InitInstance() {
            // For list directive
            ProcessInstanceCtrl.ePage.Masters.taskName = "ProcessInstance";
            ProcessInstanceCtrl.ePage.Masters.dataentryName = "ProcessInstance";
            ProcessInstanceCtrl.ePage.Masters.config = ProcessInstanceCtrl.ePage.Entities;

            ProcessInstanceCtrl.ePage.Masters.BaseFilter = {
                "PSM_FK": ProcessInstanceCtrl.ePage.Masters.QueryString.Item.PK
            };

            ProcessInstanceCtrl.ePage.Masters.ProcessInstance = [];
            processinstanceConfig.TabList = [];
            ProcessInstanceCtrl.ePage.Masters.TabList = [];
            ProcessInstanceCtrl.ePage.Masters.activeTabIndex = 0;
            ProcessInstanceCtrl.ePage.Masters.IsTabClick = false;
            ProcessInstanceCtrl.ePage.Masters.IsNewProcessInstanceClicked = false;

            // Functions
            ProcessInstanceCtrl.ePage.Masters.CreateNewProcessInstance = CreateNewProcessInstance;
            ProcessInstanceCtrl.ePage.Masters.AddTab = AddTab;
            ProcessInstanceCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ProcessInstanceCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ProcessInstanceCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ProcessInstanceCtrl.ePage.Masters.IsInstanceNo = true;
            ProcessInstanceCtrl.ePage.Masters.ProcessInstance.NewDataSlot = ProcessInstanceCtrl.ePage.Entities.Header.Meta.DataSlot;
            ProcessInstanceCtrl.ePage.Masters.ProcessInstance.Mode = 1;
            // GetProcessInstanceDataSlots();
        }

        function GetProcessInstanceDataSlots() {
            ProcessInstanceCtrl.ePage.Masters.ProcessInstance.DataSlot = {
                "ProcessName": "UNLOAD",
                "EntitySource": "ORD",
                "EntityRefKey": "3872BEA7-47A7-4FBA-9C1F-00007C9E3578",
                "KeyReference": "ORD0012",
                "CompleteInstanceNo": 2127,
                "CompleteStepNo": 1,
                "DataSlots": {
                    "Val1": "True",
                    "Val2": "True",
                    "Val3": "True",
                    "Val4": "True",
                    "Val5": "True",
                    "Val6": "True",
                    "Val7": "True",
                    "Val8": "True",
                    "Val9": "True",
                    "Val10": "True",
                    "IsOrganisationBased": "True",
                    "IsCompanyBased": "True",
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
                    },
                    "ChildItem": [{
                        "EntitySource": "ORD1",
                        "EntityRefKey": "3872BEA7-47A7-4FBA-9C1F-00007C9E3578",
                        "KeyReference": "ORD002"
                    }],
                    "Related": [{
                        "CompleteInstanceNo": "ORD1",
                        "CompleteStepNo": "3872BEA7-47A7-4FBA-9C1F-00007C9E3578",
                        "Mode": "ORD002"
                    }]
                }
            }
        }

        function CreateNewProcessInstance($item, mode) {
            var _winClass = "process-instance-mode-1";
            (mode == 1) ? _winClass = "process-instance-mode-1": _winClass = "process-instance-mode-2";
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: false,
                keyboard: false,
                windowClass: "right " + _winClass,
                scope: $scope,
                templateUrl: "app/trust-center/process/process-instance/process-instance-modal/process-instance-modal.html",
                controller: 'ProcessInstanceModalController as ProcessInstanceModalCtrl',
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
                if (response.mode == 1) {
                    response.data;
                    helperService.refreshGrid();
                }
            }, function () {
                console.log("Cancelled");
            });
        }

        function AddTab(currentProcessInstance, isNew) {
            var _isExist = ProcessInstanceCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentProcessInstance.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                ProcessInstanceCtrl.ePage.Masters.IsTabClick = true;
                var _currentProcessInstance = undefined;
                if (!isNew) {
                    _currentProcessInstance = currentProcessInstance.entity;
                } else {
                    _currentProcessInstance = currentProcessInstance;
                }
                processinstanceConfig.GetTabDetails(_currentProcessInstance, isNew).then(function (response) {
                    ProcessInstanceCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ProcessInstanceCtrl.ePage.Masters.activeTabIndex = ProcessInstanceCtrl.ePage.Masters.TabList.length;
                        ProcessInstanceCtrl.ePage.Masters.CurrentActiveTab(currentProcessInstance.entity);
                        ProcessInstanceCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("Order Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentProcessInstance) {
            event.preventDefault();
            event.stopPropagation();
            var _currentProcessInstance = currentProcessInstance[currentProcessInstance.label].ePage.Entities;
            ProcessInstanceCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab($item) {
            var _objectId;
            if ($item.label) {
                _objectId = $item[$item.label].ePage.Entities.Header.Data.PK;
                PrepareTaskFlowGraphInput($item[$item.label].ePage.Entities.Header.Data);
            } else {
                _objectId = $item.PK;
                PrepareTaskFlowGraphInput($item);
            }

            ProcessInstanceCtrl.ePage.Masters.GenerateScriptInput = {
                ObjectName: "EBPM_ProcessInstance",
                ObjectId: _objectId
            };
            ProcessInstanceCtrl.ePage.Masters.GenerateScriptConfig = {
                IsEnableTable: false,
                IsEnablePK: false,
                IsEnableTenant: false
            };
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ProcessInstanceCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function PrepareTaskFlowGraphInput($item) {
            ProcessInstanceCtrl.ePage.Masters.TaskFlowGraphInput = {
                // Entity
                "EntityRefKey": $item.PK,
                "EntityRefCode": $item.InstanceNo,
                "EntitySource": "TSK",
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": $item,
                "Entity": "Process"
            };
        }



        Init();
    }
})();
