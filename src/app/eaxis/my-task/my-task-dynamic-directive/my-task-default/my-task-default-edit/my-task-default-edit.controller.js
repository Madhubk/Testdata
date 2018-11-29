(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MyTaskDefaultEditDirectiveController", MyTaskDefaultEditDirectiveController);

    MyTaskDefaultEditDirectiveController.$inject = ["helperService"];

    function MyTaskDefaultEditDirectiveController(helperService) {
        var MyTaskDefaultEditDirectiveCtrl = this;

        function Init() {
            MyTaskDefaultEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Default_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MyTaskDefaultEditDirectiveCtrl.ePage.Masters.Complete = CompleteTask;

            InitDynamicTab();

            if (MyTaskDefaultEditDirectiveCtrl.taskObj) {
                PrepareStandardMenuInput();
            }
        }

        function PrepareStandardMenuInput() {
            var _StandardMenuInput = {
                // Entity
                // "Entity": MyTaskDefaultEditDirectiveCtrl.taskObj.ProcessName,
                "Entity": MyTaskDefaultEditDirectiveCtrl.taskObj.WSI_StepCode,
                "Communication": null,
                "Config": undefined,
                "EntityRefKey": MyTaskDefaultEditDirectiveCtrl.taskObj.EntityRefKey,
                "EntityRefCode": MyTaskDefaultEditDirectiveCtrl.taskObj.KeyReference,
                "EntitySource": MyTaskDefaultEditDirectiveCtrl.taskObj.EntitySource,
                // Parent Entity
                "ParentEntityRefKey": MyTaskDefaultEditDirectiveCtrl.taskObj.WSI_FK,
                "ParentEntityRefCode": MyTaskDefaultEditDirectiveCtrl.taskObj.WSI_StepCode,
                "ParentEntitySource": MyTaskDefaultEditDirectiveCtrl.taskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": MyTaskDefaultEditDirectiveCtrl.taskObj.ParentEntityRefKey,
                "AdditionalEntityRefCode": MyTaskDefaultEditDirectiveCtrl.taskObj.ParentKeyReference,
                "AdditionalEntitySource": MyTaskDefaultEditDirectiveCtrl.taskObj.ParentEntitySource,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };

            MyTaskDefaultEditDirectiveCtrl.ePage.Masters.StandardMenuInput = _StandardMenuInput;
        }

        function InitDynamicTab() {
            MyTaskDefaultEditDirectiveCtrl.ePage.Masters.DynamicTab = {};
            MyTaskDefaultEditDirectiveCtrl.ePage.Masters.DynamicTab.ListSource = [{
                Code: "exceptrejectedit",
                Name: "Except Reject",
                Icon: "fa fa-plane",
                Obj: {}
            }, {
                Code: "exceptnotifyedit",
                Name: "Except Notify",
                Icon: "fa fa-circle-o",
                Obj: {}
            }, {
                Code: "approvalnotifyedit",
                Name: "Approval Notify",
                Icon: "fa fa-refresh",
                Obj: {}
            }, {
                Code: "dynamic-list",
                Name: "Dynamic List",
                Icon: "fa fa-file",
                Obj: {}
            }];

            MyTaskDefaultEditDirectiveCtrl.ePage.Masters.DynamicTab.Obj = {
                TabTitle: (MyTaskDefaultEditDirectiveCtrl.taskObj) ? MyTaskDefaultEditDirectiveCtrl.taskObj.KeyReference : ""
            };
        }

        function CompleteTask() {
            MyTaskDefaultEditDirectiveCtrl.onComplete({
                $item: {
                    IsRefreshStatusCount: true
                }
            });
        }

        Init();
    }
})();
