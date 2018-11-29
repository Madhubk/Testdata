(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventExpressionFormatter", EventExpressionFormatter);

    function EventExpressionFormatter(toastr) {
        var _exports = {
            restrict: 'AE',
            templateUrl: "app/shared/expression-builder/expression-formatter/expression-formatter.html",
            scope: {
                expList: "=",
                isLogicalOperator: "=",
                isResult: "="
            },
            link: Link
        };

        return _exports;

        function Link(scope, element, attr) {
            scope.Expression = {};
            scope.Expression.AddExpressions = AddExpressions;
            scope.Expression.DeleteExpressions = DeleteExpressions;
            scope.Expression.AddParameters = AddExpressionParameters;
            scope.Expression.DeleteParameters = DeleteExpressionParameters;

            scope.Expression.LogicalOperatorList = [{
                "Code": "AND",
                "Name": "AND"
            }, {
                "Code": "OR",
                "Name": "OR"
            }];

            function AddExpressions(exp) {
                var _exp = {
                    SQL: "",
                    Parameters: []
                };

                (scope.isLogicalOperator) ? _exp.LogicalOperator = scope.Expression.LogicalOperatorList[0].Code: _exp.LogicalOperator = undefined;

                (scope.isResult) ? _exp.Result = false: _exp.Result = undefined;

                if (!scope.expList) {
                    scope.expList = [];
                }
                scope.expList.push(_exp);
            }

            function DeleteExpressions(exp, $index) {
                scope.expList.splice($index, 1);
            }

            function AddExpressionParameters(exp, parmeter) {
                var _param = {
                    fieldno: exp.FieldNo,
                    fieldname: exp.FieldName
                };

                if (_param.fieldno && _param.fieldname) {
                    exp.Parameters.push(_param);
                    exp.FieldNo = "";
                    exp.FieldName = "";
                } else {
                    toastr.warning("Please enter the Values...!");
                }
            }

            function DeleteExpressionParameters(exp, parmeter, $index) {
                exp.Parameters.splice($index, 1);
            }
        }
    }
})();
