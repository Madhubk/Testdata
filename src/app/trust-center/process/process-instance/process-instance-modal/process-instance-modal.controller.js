(function () {
    "use strict;"

    angular
        .module("Application")
        .controller("ProcessInstanceModalController", ProcessInstanceModalController);

    ProcessInstanceModalController.$inject = ["$location", "authService", "apiService", "helperService", "appConfig", "toastr", "param", "$uibModalInstance"];

    function ProcessInstanceModalController($location, authService, apiService, helperService, appConfig, toastr, param, $uibModalInstance) {
        var ProcessInstanceModalCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ProcessInstanceModalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_ProcessInstanceModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            ProcessInstanceModalCtrl.ePage.Masters.emptyText = "-";
            try {
                ProcessInstanceModalCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk) {
                    InitProcessInstanceModal();
                }
            } catch (error) {
                console.log(error)
            }
        }

        function InitProcessInstanceModal() {
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal = {};
            ProcessInstanceModalCtrl.ePage.Masters.param = angular.copy(param);
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.Create = Create;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.Cancel = Cancel;
            ProcessInstanceModalCtrl.ePage.Masters.CompleteButtonText = "Save";
            ProcessInstanceModalCtrl.ePage.Masters.IsDisableComplete = false;

            InitProcessInstance();
            InitChildItem();
            InitRelatedInstance();
        }

        /** Process Instance */
        function InitProcessInstance() {
            var _processInfoJson = {};
            ProcessInstanceModalCtrl.ePage.Masters.Instance = {};
            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView = {};
            if (ProcessInstanceModalCtrl.ePage.Masters.param.Item) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView = ProcessInstanceModalCtrl.ePage.Masters.param.Item;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.ProcessName = ProcessInstanceModalCtrl.ePage.Masters.QueryString.Item.ProcessName;
            }
            if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2) {
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.CompleteInstanceNo = ProcessInstanceModalCtrl.ePage.Masters.param.Data.WKI_PSI_InstanceNo;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.CompleteStepNo = ProcessInstanceModalCtrl.ePage.Masters.param.Data.WSI_StepNo;
                ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.CompleteStatus =
                    ProcessInstanceModalCtrl.ePage.Masters.param.Data.WKI_Status;
            }

            // --------------
            if (ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson) {

                ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson = JSON.parse(ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson)
                _processInfoJson = ProcessInstanceModalCtrl.ePage.Masters.param.ProcessInfo.ProcessInfoJson.CompleteRules[0].WorkStepRules[0].Rules;
                _processInfoJson = JSON.parse(_processInfoJson);

                for (x in ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Labels) {
                    _processInfoJson[0].FilterInput.map(function (value, key) {
                        if (x == value.FieldName) {
                            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Labels[x] = value.InputName;
                        }
                    });
                }
            }
            ProcessMasterList();

        }

        function ProcessMasterList() {
            var _filter = {
                "SAP_FK": ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.EBPMProcessMasterList = response.data.Response;
                } else {
                    ProcessInstanceModalCtrl.ePage.Masters.Instance.EBPMProcessMasterList = [];
                }
            });
        }



        /*** Child Item */
        function InitChildItem() {
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.AddNewChildItem = AddNewChildItem;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.RemoveChildItemRecord = RemoveChildItemRecord;
        }

        function AddNewChildItem() {
            var _obj = {};
            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem.push(_obj);
        }

        function RemoveChildItemRecord(item, $index) {
            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.ChildItem.splice($index, 1);
        }

        /** Related Instance */
        function InitRelatedInstance() {
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.AddNewRelatedRecord = AddNewRelatedRecord;
            ProcessInstanceModalCtrl.ePage.Masters.ProcessInstanceModal.RemoveRelatedRecord = RemoveRelatedRecord;
        }

        function AddNewRelatedRecord() {
            var _obj = {};
            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related.push(_obj);
        }

        function RemoveRelatedRecord(item, $index) {
            ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.DataSlots.Related.splice($index, 1)
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        function Create() {
            ProcessInstanceModalCtrl.ePage.Masters.CompleteButtonText = "Please Wait...";
            ProcessInstanceModalCtrl.ePage.Masters.IsDisableComplete = true;
            var _api;
            var _input = angular.copy(ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView);
            _input.EntitySource = ProcessInstanceModalCtrl.ePage.Masters.Instance.FormView.EntityName;
            _input.SAP_FK = ProcessInstanceModalCtrl.ePage.Masters.QueryString.AppPk;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            _input.IsModified = true;
            _input.IsDeleted = false;

            if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 1) {
                _api = appConfig.Entities.EBPMEngine.API.InitiateProcess.Url;
            } else if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2) {
                _api = appConfig.Entities.EBPMEngine.API.CompleteProcess.Url;
            }

            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _obj = {
                        data: _response,
                        mode: ProcessInstanceModalCtrl.ePage.Masters.param.Mode
                    };

                    if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 1) {
                        toastr.success(_response.InstanceNo + '-' + _response.InstanceStatus + "Created Successfully with InstanceNo...!");
                    } else if (ProcessInstanceModalCtrl.ePage.Masters.param.Mode == 2) {
                        toastr.success("Completed Successfully....");
                    }
                    $uibModalInstance.close(_obj);
                }
            });
        }

        Init();
    }
})();