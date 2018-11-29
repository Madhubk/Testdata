(function () {
    "use strict";

    angular
        .module("Application")
        .directive("delayReason", DelayReason);

    DelayReason.$inject = ["$templateCache"];

    function DelayReason($templateCache) {
        var _template = `<div class="clearfix delay-reason">
            <div class="clearfix p-20 text-center" data-ng-if = "!DelayReasonCtrl.ePage.Masters.DelayReason.ListSource">
                <i class="fa fa-spin fa-spinner font-120"></i>
            </div>
            <div class="clearfix p-20 text-center" data-ng-if = "DelayReasonCtrl.ePage.Masters.DelayReason.ListSource && DelayReasonCtrl.ePage.Masters.DelayReason.ListSource.length == 0">
                <i>No Records...!</i>
            </div>
            <div class="clearfix p-5 pl-15 pr-15 border-bottom" data-ng-repeat = "x in DelayReasonCtrl.ePage.Masters.DelayReason.ListSource" data-ng-if = "DelayReasonCtrl.ePage.Masters.DelayReason.ListSource && DelayReasonCtrl.ePage.Masters.DelayReason.ListSource.length > 0">
                <div class="checkbox pr-110">
                    <label>
                        <input type="checkbox" class="colored-blue" data-ng-click="DelayReasonCtrl.ePage.Masters.DelayReason.OnDelayReasonChange($event, x)" data-ng-model="x.IsChecked">
                        <span class="text">{{x.Name}}</span>
                    </label>
                    <!--<button class="btn btn-warning btn-xs" style="position:absolute; top:0; right:0;" data-ng-disabled= "!x.IsChecked" data-ng-click = "x.IsShowRemark = !x.IsShowRemark" data-ng-if="!x.CheckedData && !x.IsChecked">Add Remarks</button>-->
                    <button class="btn btn-warning btn-xs" style="position:absolute; top:0; right:0;" data-ng-disabled= "!x.IsChecked" data-ng-click = "x.IsShowRemark = false" data-ng-if="x.CheckedData && x.IsChecked && x.IsShowRemark">Close</button>
                    <button class="btn btn-info btn-xs" style="position:absolute; top:0; right:0;" data-ng-disabled= "!x.IsChecked" data-ng-click = "x.IsShowRemark = !x.IsShowRemark" data-ng-if="x.CheckedData && x.IsChecked && !x.IsShowRemark">Edit</button>
                    <button class="btn btn-xs btn-primary ml-20 pull-right" style="position:absolute; top:0; right:55px;" data-ng-click="DelayReasonCtrl.ePage.Masters.DelayReason.UpdateDelayReason(x)" data-ng-if="x.IsChecked && x.IsShowRemark">Update</button>
                </div>
                <div class="remarks-read-only p-5 pl-25" data-ng-if="x.IsChecked && !x.IsShowRemark">
                    <span data-ng-bind="x.Remarks"></span>
                </div>
                <div class="p-5" data-ng-if="x.IsChecked && x.IsShowRemark">
                    <textarea class="form-control no-resize" rows="3" placeholder="Remarks" data-ng-model="x.Remarks"></textarea>
                </div>
            </div>
        </div>`;
        $templateCache.put("DelayReason.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "DelayReason.html",
            controller: 'DelayReasonController',
            controllerAs: 'DelayReasonCtrl',
            bindToController: true,
            scope: {
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
