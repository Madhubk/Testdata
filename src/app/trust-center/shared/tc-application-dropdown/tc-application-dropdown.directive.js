(function () {
  "use strict";

  angular
    .module("Application")
    .directive("tcApplicationDropdown", TCApplicationDropdown);

  TCApplicationDropdown.$inject = ["helperService", "authService", "apiService", "trustCenterConfig"];

  function TCApplicationDropdown(helperService, authService, apiService, trustCenterConfig) {
    var exports = {
      restrict: "E",
      template: `<select chosen class="form-control" data-ng-model="Application.ActiveApplication.PK"  data-ng-options="x.PK as x.AppName for x in Application.ListSource | orderBy: 'AppName'" data-ng-change="Application.OnApplicationChange((Application.ListSource | filter: {'PK': Application.ActiveApplication.PK})[0])" search-contains="true">
      </select>`,
      scope: {
        queryString: "=",
        onApplicationChange: "&",
      },
      link: Link
    };
    return exports;

    function Link(scope, ele, attr) {

      function Init() {
        scope.Application = {};

        try {
          scope.Application.QueryString = angular.copy(scope.queryString);
          if (scope.Application.QueryString.AppPk) {
            if (trustCenterConfig.Entities.ApplicationList) {
              scope.Application.ListSource = trustCenterConfig.Entities.ApplicationList;

              if (scope.Application.ListSource.length > 0) {
                var _index = scope.Application.ListSource.map(function (value, key) {
                  return value.PK;
                }).indexOf(scope.Application.QueryString.AppPk);

                if (_index !== -1)
                  OnApplicationChange(scope.Application.ListSource[_index]);
                else
                  OnApplicationChange(scope.Application.ListSource[0]);
              } else {
                scope.Application.ListSource = [];
              }
            } else {
              GetAplicationList();
            }
          }
        } catch (error) {
          console.log(error);
        }

        scope.Application.OnApplicationChange = OnApplicationChange;
      }

      function GetAplicationList() {
        scope.Application.ListSource = undefined;

        var _filter = {
          "USR_FK": authService.getUserInfo().UserPK,
          "PageSize": 100,
          "PageNumber": 1,
          "SortColumn": "SAP_AppCode",
          "SortType": "ASC"
        };
        var _input = {
          "searchInput": helperService.createToArrayOfObject(_filter),
          "FilterID": trustCenterConfig.Entities.API.SecApp.API.FindAllAccess.FilterID
        };

        apiService.post("authAPI", trustCenterConfig.Entities.API.SecApp.API.FindAllAccess.Url, _input).then(function SuccessCallBack(response) {
          if (response.data.Response) {
            scope.Application.ListSource = angular.copy(response.data.Response);
            trustCenterConfig.Entities.ApplicationList = angular.copy(response.data.Response);

            if (scope.Application.ListSource.length > 0) {
              var _index = scope.Application.ListSource.map(function (value, key) {
                return value.PK;
              }).indexOf(scope.Application.QueryString.AppPk);

              if (_index !== -1)
                OnApplicationChange(scope.Application.ListSource[_index]);
              else
                OnApplicationChange(scope.Application.ListSource[0]);
            } else {
              scope.Application.ListSource = [];
            }
          }
        });
      }

      function OnApplicationChange($item) {
        scope.Application.ActiveApplication = angular.copy($item);

        if (!scope.Application.ActiveApplication)
          scope.Application.ActiveApplication = {};

        scope.onApplicationChange({
          $item: scope.Application.ActiveApplication
        });
      }

      Init();
    }
  }
})();
