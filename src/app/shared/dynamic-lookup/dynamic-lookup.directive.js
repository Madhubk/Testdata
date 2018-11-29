(function () {
    'user strict';

    angular
        .module('Application')
        .directive('dynamicLookup', DynamicLookup);

    DynamicLookup.$inject = ["$templateCache"];

    function DynamicLookup($templateCache) {
        var _template = `<input class="form-control input-sm" type="text" placeholder="{{DynamicLookupCtrl.placeholder}}" data-ng-disabled="DynamicLookupCtrl.isDisabled" data-ng-model="DynamicLookupCtrl.myNgModel" uib-typeahead="x[DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay] as x[DynamicLookupCtrl.ePage.Masters.LookupConfig.UIDisplay] + ' -' + x[DynamicLookupCtrl.ePage.Masters.LookupConfig.DisplayColumns] for x in DynamicLookupCtrl.ePage.Masters.GetAutoCompleteList($viewValue)" typeahead-editable="DynamicLookupCtrl.IsEditable" typeahead-wait-ms="200" typeahead-loading="DynamicLookupCtrl.ePage.Masters.IsLoading" typeahead-no-results="DynamicLookupCtrl.ePage.Masters.NoRecords" typeahead-append-to-body='true' typeahead-on-select="DynamicLookupCtrl.ePage.Masters.AutoCompleteOnSelect($item, $model, $label)" data-ng-blur="DynamicLookupCtrl.ePage.Masters.OnBlurLookup()" data-ng-change="DynamicLookupCtrl.ePage.Masters.OnChangeLookup()">
        <div class="clearfix dropdown-menu typeahead" data-ng-if="DynamicLookupCtrl.ePage.Masters.NoRecords" style="display: block !important; font-size: 12px;">
            <div class="auto-complete-no-result" style="padding: 0 10px;">No Results Found!</div>
        </div>
        <div class="clearfix dropdown-menu typeahead" data-ng-if="DynamicLookupCtrl.ePage.Masters.IsLoading" style="display: block !important; font-size: 12px;">
            <div class="auto-complete-no-result" style="padding: 0 10px;">
                <i class="fa fa-spin fa-spinner"></i>
            </div>
        </div>`;
        $templateCache.put("DynamicLookup.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "DynamicLookup.html",
            controller: "DynamicLookupController",
            controllerAs: "DynamicLookupCtrl",
            scope: {
                myNgModel: '=',
                obj: "=",
                pageName: "=",
                controlId: "=",
                controlKey: "=",
                autoCompleteOnSelect: "&",
                placeholder: "@",
                isDisabled: "=",
                isEditable: "="
            },
            link: Link,
            bindToController: true
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
