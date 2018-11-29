(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProcessWorkStepDirectiveController", ProcessWorkStepDirectiveController);

    ProcessWorkStepDirectiveController.$inject = ["helperService"];

    function ProcessWorkStepDirectiveController( helperService) {
        /* jshint validthis: true */
        var ProcessWorkStepDirectiveCtrl = this;

        function Init() {
            ProcessWorkStepDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Rules_List",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            ProcessWorkStepDirectiveCtrl.ePage.Masters.Gate = "AND";

            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput = {
                'FieldName': '',
                'CompareOperator': 'Equals',
                'LogicalOperator': 'AND',
                'FilterID': 'DUMMY',
                'InputName': '',
                'Value': ''
            };

            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules = {
                'LogicalOperator': ProcessWorkStepDirectiveCtrl.ePage.Masters.Gate,
                'FilterInput': []
            };

            ProcessWorkStepDirectiveCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.AddNewGroup = AddNewGroup;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.DeleteFilter = DeleteFilter;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.DeleteGroup = DeleteGroup;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.OnGateChange = OnGateChange;

            ProcessWorkStepDirectiveCtrl.ePage.Masters.OnLogicalOperatorChange = OnLogicalOperatorChange;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.OnInstanceChange = OnInstanceChange;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.OnCompareOperatorChange = OnCompareOperatorChange;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.OnOperatorChange = OnOperatorChange;

            GetLogicalOperatorList();
            GetCompareList();
        }

        function GetLogicalOperatorList() {
            ProcessWorkStepDirectiveCtrl.ePage.Masters.OperatorList = [{
                "Code": "AND",
                "Name": "AND"
            }, {
                "Code": "OR",
                "Name": "OR"
            }];
        }

        function GetCompareList() {
            ProcessWorkStepDirectiveCtrl.ePage.Masters.CompareList = [{
                "Code": "Equals",
                "Name": "Equals"
            }, {
                "Code": "Contains",
                "Name": "Contains"
            }, {
                "Code": "NotEquals",
                "Name": "NotEquals"
            }, {
                "Code": "StartsWith",
                "Name": "StartsWith"
            }, {
                "Code": "EndsWith",
                "Name": "EndsWith"
            }, {
                "Code": "In",
                "Name": "In"
            }];
        }

        function OnLogicalOperatorChange($item, obj) {
            obj.LogicalOperator = $item.Code
        }

        function OnInstanceChange($item, obj) {
            obj.InputName = $item.InputName;
            obj.Value = $item.Value;
            obj.FieldName = $item.FieldName;
            obj.DataType = $item.DataType;

            if (ProcessWorkStepDirectiveCtrl.mode != 1) {
                obj.DataType = "String";
            }
        }

        function OnCompareOperatorChange($item, obj) {
            obj.CompareOperator = $item.Code;
        }

        function OnOperatorChange($item, obj) {
            obj.LogicalOperator = $item.Code;
        }

        function AddNewRow($item) {
            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput.GroupId = $item.GroupId;

            if (ProcessWorkStepDirectiveCtrl.mode != 1) {
                ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput.DataType = "String";
            }

            $item.FilterInput.push(angular.copy(ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput));
        }

        function DeleteFilter(obj, $item, $index) {
            obj.FilterInput.splice($index, 1);
        }

        function DeleteGroup($item, $index) {
            ProcessWorkStepDirectiveCtrl.input.splice($index, 1)
        }

        function AddNewGroup() {
            if (ProcessWorkStepDirectiveCtrl.input == null) {
                ProcessWorkStepDirectiveCtrl.input = [];
            }

            var _groupId = ProcessWorkStepDirectiveCtrl.input.length + 1;

            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules.GroupId = _groupId;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules.LogicalOperator = ProcessWorkStepDirectiveCtrl.ePage.Masters.Gate;
            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules.FilterInput = [];

            if (ProcessWorkStepDirectiveCtrl.mode == 1) {
                if (ProcessWorkStepDirectiveCtrl.instanceList) {
                    if (ProcessWorkStepDirectiveCtrl.instanceList.length > 0) {
                        ProcessWorkStepDirectiveCtrl.instanceList.map(function (value, key) {
                            var _EmptyFilterInput = {
                                'FieldName': value.FieldName,
                                'CompareOperator': 'Equals',
                                'LogicalOperator': 'AND',
                                'Value': value.Value,
                                'InputName': value.InputName,
                                'DataType': value.DataType,
                                'FilterID': 'DUMMY',
                                'GroupId': _groupId,
                            };
                            ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules.FilterInput.push(_EmptyFilterInput);
                        });
                    }
                }
            } else {
                ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput.GroupId = _groupId;
                ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput.DataType = "String";
                OnInstanceChange(ProcessWorkStepDirectiveCtrl.instanceList[0], ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput);
                ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules.FilterInput.push(angular.copy(ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyFilterInput));
            }

            ProcessWorkStepDirectiveCtrl.input.push(angular.copy(ProcessWorkStepDirectiveCtrl.ePage.Masters.EmptyWorkStepRules));
        }

        function OnGateChange() {
            if (ProcessWorkStepDirectiveCtrl.input) {
                if (ProcessWorkStepDirectiveCtrl.input.length > 0) {
                    ProcessWorkStepDirectiveCtrl.input.map(function (value, key) {
                        value.LogicalOperator = ProcessWorkStepDirectiveCtrl.ePage.Masters.Gate;
                    });
                }
            }
        }

        Init();
    }
})();
