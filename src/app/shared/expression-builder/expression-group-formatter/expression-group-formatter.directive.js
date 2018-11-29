(function () {
    "use strict";

    angular
        .module("Application")
        .directive("eventExpressionGroupFormatter", EventExpressionGroupFormatter);

    function EventExpressionGroupFormatter() {
        var _exports = {
            restrict: 'AE',
            templateUrl: "app/shared/expression-builder/expression-group-formatter/expression-group-formatter.html",
            scope: {
                expGroupList: "=",
                isLogicalOperator: "="
            },
            link: Link
        };

        return _exports;

        function Link(scope, element, attr) {
            scope.ExpressionGroup = {};
            scope.ExpressionGroup.AddExpressionGroup = AddExpressionGroup;
            scope.ExpressionGroup.DeleteExpressionGroup = DeleteExpressionGroup;

            scope.ExpressionGroup.LogicalOperatorList = [{
                "Code": "AND",
                "Name": "AND"
            }, {
                "Code": "OR",
                "Name": "OR"
            }];

            function AddExpressionGroup(exp) {
                var _group = {
					Result: false,
					Expressions: []
				};

                (scope.isLogicalOperator) ? _group.LogicalOperator = scope.ExpressionGroup.LogicalOperatorList[0].Code: _group.LogicalOperator = undefined;

                (scope.isResult) ? _group.Result = false: _group.Result = undefined;

                scope.expGroupList.push(_group);
            }

            function DeleteExpressionGroup(exp, $index) {
                scope.expGroupList.splice($index, 1);
            }
        }
    }
})();
