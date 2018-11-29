(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessInstanceWorkItemDetailsController", ProcessInstanceWorkItemDetailsController);

    ProcessInstanceWorkItemDetailsController.$inject = ["$scope", "apiService", "helperService", "authService", "appConfig", "$uibModal", "toastr", "$location"];

    function ProcessInstanceWorkItemDetailsController($scope, apiService, helperService, authService, appConfig, $uibModal, toastr, $location) {
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
            InitProcessInstance();
            InitUserPerformerList();
        }

        /**ProcessInstance */
        function InitProcessInstance() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.AbortWork = AbortWork;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.CompleteWork = CompleteWork;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.GetProcessInfo = GetProcessInfo;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.CloseProcessInfoJsonModal = CloseProcessInfoJsonModal;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ToggleProcessGroup = ToggleProcessGroup;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.AssignStartCompleteResponse = AssignStartCompleteResponse;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ViewEntityInfo = ViewEntityInfo;
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.CloseEntityInfo = CloseEntityInfo;

            GetDataSlot();
        }

        function GetDataSlot() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.NewDataSlot = {
                "ProcessName": "",
                "EntitySource": "",
                "EntityRefKey": "",
                "KeyReference": "",
                "CompleteInstanceNo": "",
                "CompleteStepNo": "",
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
                    "Val10": "",
                    "Val11": "",
                    "Val12": "",
                    "Val13": "",
                    "Val14": "",
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
                        "Val10": "",
                        "Val11": "Organisation",
                        "Val12": "Warehouse",
                        "Val13": "Company",
                        "Val14": "Department",
                    },
                    "ChildItem": [{
                        "EntitySource": "",
                        "EntityRefKey": "",
                        "KeyReference": ""
                    }],
                    "Related": [{
                        "CompleteInstanceNo": "",
                        "CompleteStepNo": "",
                        "Mode": ""
                    }]
                }
            };

            GetInstanceStepList();
        }

        function GetInstanceStepList() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.StepList = undefined;
            apiService.get("eAxisAPI", appConfig.Entities.EBPMWorkFlow.API.GetByInstanceNo.Url + ProcessInstanceWorkItemDetailsCtrl.ePage.Entities.Header.Data.InstanceNo).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response;

                    if (_response.GraphData) {
                        if (_response.GraphData.Step) {
                            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.StepList = _response.GraphData.Step;
                        }
                    }
                } else {
                    ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.StepList = [];
                }
            });
        }

        function GetProcessInfo($item) {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfoJson = {};
            var _filter = {
                "PK": $item.PK
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
                            if (typeof _response.CompleteRules == "string") {
                                _ProcessInfoJson.CompleteRules = JSON.parse(_response.CompleteRules);
                            }
                        }
                        if (_response.EBPMInputs) {
                            if (typeof _response.EBPMInputs == "string") {
                                _ProcessInfoJson.EBPMInputs = JSON.parse(_response.EBPMInputs);
                            }
                        }

                        ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfoJson = JSON.stringify(_ProcessInfoJson, null, 4);

                        ViewProcessInfo().result.then(function (response) {}, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            });
        }

        function ViewProcessInfo() {
            return ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfoJsonModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "process-info-json right",
                scope: $scope,
                template: `<div class="modal-header">
                                    <button type="button" class="close" ng-click="ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.CloseProcessInfoJsonModal()">&times;</button>
                                    <h5 class="modal-title" id="modal-title">
                                        <strong>Process Information</strong>
                                    </h5>
                                </div>
                                <div class="modal-body" id="modal-body">
                                    <div class="clearfix p-20">
                                        <div class="process-info-json-view" data-ng-bind-html="ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfoJson"></div>
                                    </div>
                                </div>`
            });
        }

        function CloseProcessInfoJsonModal() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfoJsonModal.dismiss("close");
        }

        function AssignStartCompleteResponse($item, member) {
            for (var x in $item) {
                if ($item[x] != null && $item[x] != undefined) {
                    if (x == "OtherConfig" || x == "RelatedProcess") {
                        if (typeof $item[x] == "string") {
                            $item[x] = JSON.parse($item[x]);
                        }
                    }
                    member[x] = $item[x];
                }
            }
        }

        function AbortWork($item) {
            var _input = {
                "InstanceNo": $item.PSI_InstanceNo,
                "StepNo": $item.WSI_StepNo,
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CancelKPI.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Status == "Success") {
                        AssignStartCompleteResponse(response.data.Response, $item);
                    } else {
                        toastr.error(response.data.Response);
                    }
                }
            });
        }

        function CompleteWork($item) {
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

            OpenCompleteWorkForm($item);
        }

        function OpenCompleteWorkForm($item) {
            var modalInstance = $uibModal.open({
                backdrop: "static",
                animation: true,
                keyboard: true,
                windowClass: "process-instance-mode-2 right",
                scope: $scope,
                templateUrl: "app/trust-center/process/process-instance/process-instance-modal/process-instance-modal.html",
                controller: 'ProcessInstanceModalController as ProcessInstanceModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Item": ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.NewDataSlot,
                            "Mode": 2,
                            "Data": $item,
                            "ProcessInfo": ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ProcessInfo
                        };
                        return exports;
                    }
                }
            }).result.then(function (response) {
                AssignStartCompleteResponse(response.data, $item);
            }, function () {
                console.log("Cancelled");
            });
        }

        function ToggleProcessGroup($item) {
            if (!$item.IsCollapsed) {
                $item.IsCollapsed = true;
            } else {
                $item.IsCollapsed = false;
            }

            $("." + $item.RootPath).toggle();
        }

        // Entity Info
        function ViewEntityInfo($item) {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ActiveProcess = undefined;
            if ($item.EntityInfo) {
                if ($item.EntityInfo.Fields) {
                    if ($item.EntityInfo.Fields.length > 0) {
                        ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ActiveProcess = angular.copy($item);
                    } else {
                        toastr.warning("No Entity Information...!");
                    }
                } else {
                    toastr.warning("No Entity Information...!");
                }
            } else {
                toastr.warning("No Entity Information...!");
            }
        }

        function CloseEntityInfo() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.ActiveProcess = undefined;
        }

        function InitUserPerformerList() {
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.Performer = {};
            ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.Performer.OnPerformerListClick = OnPerformerListClick;
        }

        function OnPerformerListClick($item) {
            var _input = {};
            if (authService.getUserInfo().AppCode == 'TC') {
                var _locationPop = $location.path().split("/").pop();
                ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_locationPop));

                if ($item.AccessMode == "GROUP") {
                    _input.USR_Groups = $item.Performer;

                } else if ($item.AccessMode == "ROLE") {
                    _input.USR_ROLES = $item.Performer;
                }
                window.open("#/TC/dynamic-list-view/UserProfile/" + helperService.encryptData(ProcessInstanceWorkItemDetailsCtrl.ePage.Masters.QueryString) + "?item=" + helperService.encryptData(_input), "_blank");
            } else {
                if ($item.AccessMode == "GROUP") {
                    var _queryString = {
                        USR_Groups: $item.Performer
                    };
                } else if ($item.AccessMode == "ROLE") {
                    var _queryString = {
                        USR_ROLES: $item.Performer
                    };
                }
                window.open("#/EA/dynamic-list-view/UserProfile?item=" + helperService.encryptData(_queryString));
            }
        }
        Init();
    }
})();
