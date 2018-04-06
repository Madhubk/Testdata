(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessInstanceWorkItemDetailsController", ProcessInstanceWorkItemDetailsController);

    ProcessInstanceWorkItemDetailsController.$inject = ["$scope", "$timeout", "apiService", "processinstanceConfig", "helperService", "authService", "appConfig", "$uibModal", "trustCenterConfig"];

    function ProcessInstanceWorkItemDetailsController($scope, $timeout, apiService, processinstanceConfig, helperService, authService, appConfig, $uibModal, trustCenterConfig) {
        /* jshint validthis: true */
        var ProcessInstanceWorkItemDetailsCtrl = this;

        function Init() {
            var currentProcessInstance = ProcessInstanceWorkItemDetailsCtrl.currentProcessInstance[ProcessInstanceWorkItemDetailsCtrl.currentProcessInstance.label].ePage.Entities;
            ProcessInstanceWorkItemDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Process_Instance",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProcessInstance,
            };

            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem = {};
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.OnActionClick = OnActionClick;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.NewDataSlot = processinstanceConfig.Entities.Header.Meta.DataSlot;

            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.Mode = 2;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.WorkItem = [];

            // InitWorkItemList();
            InitProcessInstance();
            InitProcessInfo();
        }

        /** WorkItemDetails */
        // function InitWorkItemList() {
        //     ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItemList = [];
        //     ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem = trustCenterConfig.Entities.ProcessInstanceWorkItem;

        //Grid for WorkItemDetails
        //     ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.gridConfig = ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.Grid.GridConfig;
        //     ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.gridConfig.columnDef = ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.Grid.ColumnDef;

        //     GetWorkItemList();
        // }

        // function GetWorkItemDetails() {
        //     ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.GridData = undefined;
        //     $timeout(function () {
        //         ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItem.GridData = ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItemList.ListSource;
        //     });
        // }

        // function GetWorkItemList() {
        //     var _filter = {
        //         // PSI_InstanceNo: ProcessInstanceWorkItemDetailsCtrl.ePage.Entities.Header.Data.InstanceNo
        //     };
        //     var _input = {
        //         "searchInput": helperService.createToArrayOfObject(_filter),
        //         "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAll.FilterID
        //     };

        //     apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAll.Url, _input).then(function (response) {
        //         if (response.data.Response) {
        //             ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItemList.ListSource = response.data.Response;
        //         } else {
        //             ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInstanceWorkItemList.ListSource = [];
        //         }

        //     });
        // }

        function OnActionClick($item) {
            var _WorkItem = [];
            if ($item.CompleteRules) {
                if (typeof $item.CompleteRules == "string") {
                    $item.CompleteRules = JSON.parse($item.CompleteRules);
                }
                $item.CompleteRules.map(function (val, key) {
                    if (val.WorkStepRules) {
                        if (typeof val.WorkStepRules == "string") {
                            val.WorkStepRules = JSON.parse(val.WorkStepRules);
                        }
                        val.WorkStepRules.map(function (val1, key1) {
                            if (val1.Rules) {
                                if (typeof val1.Rules == "string") {
                                    val1.Rules = JSON.parse(val1.Rules);
                                }
                                val1.Rules.map(function (val2, key2) {
                                    if (val2.FilterInput) {
                                        if (typeof val2.FilterInput == "string") {
                                            val2.FilterInput = JSON.parse(val2.FilterInput);
                                        }
                                        val2.FilterInput.map(function (val3, key3) {
                                            _WorkItem.push(val3);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }

            for (var x in ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.NewDataSlot.DataSlots.Labels) {
                _WorkItem.map(function (value, key) {
                    if (value.FieldName == x) {
                        ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.NewDataSlot.DataSlots.Labels[x] = value.InputName;
                    }
                });
            }

            OpenEditForm(ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.NewDataSlot, 2, $item);
        }

        function OpenEditForm($item, mode, data) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "process-instance",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-instance/process-instance-modal/process-instance-modal.html",
                controller: 'ProcessInstanceModalController as ProcessInstanceModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Item": $item,
                            "Mode": mode,
                            "Data": data,
                            "ProcessInfo": ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {
                GetByInstance();
            }, function () {
                console.log("Cancelled");
            })
        }

        function SelectedGridRow($item) {
            if ($item.action == "link") {
                OnActionClick($item.data);
            }
        }

        /**ProcessInstance */
        function InitProcessInstance() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ListSource = {};
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.OnExecuteClick = OnExecuteClick;
            GetByInstance();
        }

        function GetByInstance() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ListSource = undefined;
            apiService.get("eAxisAPI", appConfig.Entities.EBPMWorkFlow.API.GetByInstanceNo.Url + ProcessInstanceWorkItemDetailsCtrl.ePage.Entities.Header.Data.InstanceNo).then(function (response) {
                if (response.data.Response) {
                    ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ListSource = response.data.Response.GraphData.Step;
                } else {
                    ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ListSource = [];
                }
            });
        }

        function OnExecuteClick($item) {
            OnInfoClick($item, "complete");
        }

        /** Process Info Click */
        function InitProcessInfo() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo = {};
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.OnInfoClick = OnInfoClick;
        }

        function OnInfoClick($item, btnType) {
            if ($item) {
                ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo.ActiveWorkItemList = $item;
            } else {
                ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo.ActiveWorkItemList = undefined;
            }
            GetWorkItemList(btnType);
        }

        function GetWorkItemList(btnType) {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo.ProcessInfoJson = {};
            var _filter = {
                "PK": ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo.ActiveWorkItemList.WKI_PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        var _ProcessInfoJson = {};

                        if (_response.CompleteRules) {
                            _ProcessInfoJson.CompleteRules = JSON.parse(_response.CompleteRules);
                        }
                        if (_response.EBPMInputs) {
                            _ProcessInfoJson.EBPMInputs = JSON.parse(_response.EBPMInputs);
                        }
                        ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo.ProcessInfoJson = JSON.stringify(_ProcessInfoJson, null, 4);
                    }
                }

                if (btnType == "complete") {
                    OnActionClick(ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo.ActiveWorkItemList);
                }
            });
        }

        Init();
    }
})();