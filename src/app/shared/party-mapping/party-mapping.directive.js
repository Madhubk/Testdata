(function () {
	"use strict";

	angular
		.module("Application")
		.directive("partyMapping", PartyMapping);

	PartyMapping.$inject = ["$location", "$uibModal", "apiService", "appConfig", "authService", "helperService", "toastr"];

	function PartyMapping($location, $uibModal, apiService, appConfig, authService, helperService, toastr) {
		var _exports = {
			restrict: 'AE',
			templateUrl: "app/shared/party-mapping/party-mapping.html",
			scope: {
				mappingInput: "=",
				isDefault: "=",
				isRestricted: "="
			},
			link: Link
		};

		return _exports;

		function Link(scope, element, attr) {
			function Init() {
				try{
					InitPartMapping();
					InitRoleMapping();
				} catch(ex){
					console.log(ex);
				}
			}

			// region Party
			function InitPartMapping() {
				scope.PartyMapping = {};

				scope.PartyMapping.OnPartiesClick = OnPartyClick;
				scope.PartyMapping.UpdatePartyMapping = UpdatePartyMapping;

				GetPartyList();
			}

			function GetPartyList() {
				scope.PartyMapping.PartyList = undefined;
				var _filter = {
					"SAP_FK": scope.mappingInput.SAP_FK,
				};
				var _input = {
					"searchInput": helperService.createToArrayOfObject(_filter),
					"FilterID": appConfig.Entities.SecParties.API.FindAll.FilterID
				};

				apiService.post("authAPI", appConfig.Entities.SecParties.API.FindAll.Url, _input).then(function SuccessCallback(response) {
					if (response.data.Response) {
						scope.PartyMapping.PartyList = response.data.Response;

						if (response.data.Response.length > 0) {
							GetPartiesMappingList();
						}
					} else {
						scope.PartyMapping.PartyList = [];
					}
				});
			}

			function GetPartiesMappingList() {
				var _filter = {
					"MappingCode": scope.mappingInput.MappingCode,

					"AccessTo": scope.mappingInput.AccessTo,
					"Access_FK": scope.mappingInput.Access_FK,
					"AccessCode": scope.mappingInput.AccessCode,

					"BasedOn": scope.mappingInput.BasedOn,
					"BasedOn_FK": scope.mappingInput.BasedOn_FK,
					"BasedOnCode": scope.mappingInput.BasedOnCode,

					"OtherEntitySource": scope.mappingInput.OtherEntitySource,
					"OtherEntity_FK": scope.mappingInput.OtherEntity_FK,
					"OtherEntityCode": scope.mappingInput.OtherEntityCode,

					"OtherEntitySource_2": scope.mappingInput.OtherEntitySource_2,
					"OtherEntity_FK_2": scope.mappingInput.OtherEntity_FK_2,
					"OtherEntityCode_2": scope.mappingInput.OtherEntityCode_2,

					"OtherEntitySource_3": scope.mappingInput.OtherEntitySource_3,
					"OtherEntity_FK_3": scope.mappingInput.OtherEntity_FK_3,
					"OtherEntityCode_3": scope.mappingInput.OtherEntityCode_3,

					"OtherEntitySource_4": scope.mappingInput.OtherEntitySource_4,
					"OtherEntity_FK_4": scope.mappingInput.OtherEntity_FK_4,
					"OtherEntityCode_4": scope.mappingInput.OtherEntityCode_4,

					"SAP_FK": scope.mappingInput.SAP_FK,
					"TNT_FK": authService.getUserInfo().TenantPK
				};
				var _input = {
					"searchInput": helperService.createToArrayOfObject(_filter),
					"FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
				};

				apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
					if (response.data.Response) {
						if (response.data.Response.length > 0) {
							scope.PartyMapping.PartyList.map(function (value1, key1) {
								response.data.Response.map(function (value2, key2) {
									if (value1.PK === value2.Item_FK) {
										value1.IsChecked = true;
										value1.MappingObj = value2;
									}
								});
							});
						}
					}
				});
			}

			function OnPartyClick($event, $item) {
				var checkbox = $event.target,
					check = checkbox.checked,
					_input = {};

				if (check == true) {
					_input = {
						"MappingCode": scope.mappingInput.MappingCode,
						"ChildMappingCode": scope.mappingInput.ChildMappingCode,
						"ItemName": "GRUP",
						"ItemCode": $item.Code,
						"Item_FK": $item.PK,

						"AccessTo": scope.mappingInput.AccessTo,
						"Access_FK": scope.mappingInput.Access_FK,
						"AccessCode": scope.mappingInput.AccessCode,

						"BasedOn": scope.mappingInput.BasedOn,
						"BasedOn_FK": scope.mappingInput.BasedOn_FK,
						"BasedOnCode": scope.mappingInput.BasedOnCode,

						"OtherEntitySource": scope.mappingInput.OtherEntitySource,
						"OtherEntity_FK": scope.mappingInput.OtherEntity_FK,
						"OtherEntityCode": scope.mappingInput.OtherEntityCode,

						"OtherEntitySource_2": scope.mappingInput.OtherEntitySource_2,
						"OtherEntity_FK_2": scope.mappingInput.OtherEntity_FK_2,
						"OtherEntityCode_2": scope.mappingInput.OtherEntityCode_2,

						"OtherEntitySource_3": scope.mappingInput.OtherEntitySource_3,
						"OtherEntity_FK_3": scope.mappingInput.OtherEntity_FK_3,
						"OtherEntityCode_3": scope.mappingInput.OtherEntityCode_3,

						"OtherEntitySource_4": scope.mappingInput.OtherEntitySource_4,
						"OtherEntity_FK_4": scope.mappingInput.OtherEntity_FK_4,
						"OtherEntityCode_4": scope.mappingInput.OtherEntityCode_4,

						"SAP_Code": scope.mappingInput.SAP_Code,
						"SAP_FK": scope.mappingInput.SAP_FK,
						"TenantCode": authService.getUserInfo().TenantCode,
						"TNT_FK": authService.getUserInfo().TenantPK,
						"IsJson": true,
						"IsResticted": false,
						"IsModified": true
					};

					(scope.isDefault) ? _input.IsDefault = true: _input.IsDefault = false;

				} else if (check == false) {
					_input = $item.MappingObj;
					_input.IsModified = true;
					_input.IsDeleted = true;
				}

				apiService.post("authAPI", appConfig.Entities.SecMappings.API.UpsertUserWithRole.Url, [_input]).then(function SuccessCallback(response) {
					if (response.data.Response) {
						if (response.data.Response.length > 0) {
							$item.IsChecked = true;
							$item.MappingObj = response.data.Response[0];
						}
					}
				});
			}

			function UpdatePartyMapping($event, $item) {
				var _input = $item.MappingObj;
				_input.IsModified = true;

				if (!scope.isDefault) {
					apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
						if (response.data.Response) {
							if (response.data.Response.length > 0) {}
						}
					});
				}
			}
			// endregion

			// region Role
			function InitRoleMapping() {
				scope.RoleMapping = {};

				scope.RoleMapping.EditRole = EditRole;
				scope.RoleMapping.CloseEditActivityModal = CloseEditActivityModal;
				scope.RoleMapping.OnRoleClick = OnRoleClick;
				scope.RoleMapping.UpdateRoleMapping = UpdateRoleMapping;
			}

			function GetRoleList() {
				var _location = $location.path();
				var _filter = {
					"MappingCode": "GRUP_ROLE_APP_TNT",
					"Item_FK": scope.RoleMapping.ActiveParty.PK,
					"ItemCode": scope.RoleMapping.ActiveParty.PartyName,
					"ItemName": "Parties",
					"TenantCode": authService.getUserInfo().TenantCode
				};

				if (_location.indexOf("/TC/") != -1) {
					var _queryString = $location.path().split("/").pop();
					var _appPK = JSON.parse(helperService.decryptData(_queryString)).AppPk;

					_filter.SAP_FK = _appPK;
				} else {
					_filter.SAP_FK = authService.getUserInfo().AppPK;
				}

				var _input = {
					"searchInput": helperService.createToArrayOfObject(_filter),
					"FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
				};

				apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
					if (response.data.Response) {
						if (response.data.Response.length > 0) {
							scope.PartyMapping.PartyList.map(function (value, key) {
								value.Role = response.data.Response;
							});

							GetRoleMappingList();
						} else {
							toastr.warning("No Role mapped with this Party...!");
						}
					} else {
						toastr.warning("No Role mapped with this Party...!");
					}
				});
			}

			function EditRoleModalInstance() {
				return scope.RoleMapping.EditRoleModal = $uibModal.open({
					animation: true,
					keyboard: true,
					windowClass: "party-mapping-role right",
					scope: scope,
					template: `<div ng-include src="'PartyMappingRole'"></div>`
				});
			}

			function EditRole($item) {
				scope.RoleMapping.ActiveParty = $item;
				GetRoleList();
			}

			function GetRoleMappingList() {
				var _filter = {
					"MappingCode": scope.mappingInput.ChildMappingCode,
					"ItemName": "GRUP",
					"ItemCode": scope.RoleMapping.ActiveParty.Code,
					"Item_FK": scope.RoleMapping.ActiveParty.PK,

					"BasedOn": scope.mappingInput.AccessTo,
					"BasedOn_FK": scope.mappingInput.Access_FK,
					"BasedOnCode": scope.mappingInput.AccessCode,

					"TenantCode": authService.getUserInfo().TenantCode,
					"SAP_Code": scope.mappingInput.SAP_Code,
				};
				var _input = {
					"searchInput": helperService.createToArrayOfObject(_filter),
					"FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
				};

				apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function SuccessCallback(response) {
					if (response.data.Response) {
						if (response.data.Response.length > 0) {
							scope.RoleMapping.ActiveParty.Role.map(function (value1, key1) {
								response.data.Response.map(function (value2, key2) {
									if (value1.Access_FK === value2.Access_FK) {
										value1.IsChecked = true;
										value1.IsAccessChecked = true;
										value1.MappingObj = value2;
									}
								});
							});
						}

						EditRoleModalInstance().result.then(function (response) {}, function () {
							console.log("Cancelled");
						});
					}
				});
			}

			function CloseEditActivityModal() {
				scope.RoleMapping.EditRoleModal.dismiss('cancel');
			}

			function OnRoleClick($event, $item) {
				var checkbox = $event.target,
					check = checkbox.checked;

				$item.IsAccessChecked = check;
				if (check == true) {
					var _input = {
						"MappingCode": scope.mappingInput.ChildMappingCode,
						"ItemName": "GRUP",
						"ItemCode": scope.RoleMapping.ActiveParty.Code,
						"Item_FK": scope.RoleMapping.ActiveParty.PK,

						"AccessCode": $item.AccessCode,
						"Access_FK": $item.Access_FK,
						"AccessTo": $item.AccessTo,

						"AdditionalEntitySource": "PARENT",
						"AdditionalEntityCode": scope.RoleMapping.ActiveParty.MappingObj.MappingCode,
						"AdditionalEntity_FK": scope.RoleMapping.ActiveParty.MappingObj.PK,

						"BasedOn_FK": scope.mappingInput.Access_FK,
						"BasedOnCode": scope.mappingInput.AccessCode,
						"BasedOn": scope.mappingInput.AccessTo,

						"OtherEntitySource": scope.mappingInput.BasedOn,
						"OtherEntity_FK": scope.mappingInput.BasedOn_FK,
						"OtherEntityCode": scope.mappingInput.BasedOnCode,

						"OtherEntitySource_2": scope.mappingInput.OtherEntitySource,
						"OtherEntity_FK_2": scope.mappingInput.OtherEntity_FK,
						"OtherEntityCode_2": scope.mappingInput.OtherEntityCode,

						"OtherEntitySource_3": scope.mappingInput.OtherEntitySource_2,
						"OtherEntity_FK_3": scope.mappingInput.OtherEntity_FK_2,
						"OtherEntityCode_3": scope.mappingInput.OtherEntityCode_2,

						"OtherEntitySource_4": scope.mappingInput.OtherEntitySource_3,
						"OtherEntity_FK_4": scope.mappingInput.OtherEntity_FK_3,
						"OtherEntityCode_4": scope.mappingInput.OtherEntityCode_3,

						"SAP_Code": scope.mappingInput.SAP_Code,
						"SAP_FK": scope.mappingInput.SAP_FK,
						"TenantCode": authService.getUserInfo().TenantCode,
						"TNT_FK": authService.getUserInfo().TenantPK,

						"IsJson": false,
						"IsDefault": false,
						"IsResticted": false,
						"IsModified": true
					};

					InsertRoleMapping($item, _input);
				} else if (check == false) {
					var _isExist = scope.RoleMapping.ActiveParty.Role.some(function (value, key) {
						return value.IsChecked;
					});
					if (_isExist) {
						var _input = $item.MappingObj;
						_input.IsModified = true;
						_input.IsDeleted = true;

						InsertRoleMapping($item, _input);
					} else {
						$item.IsChecked = true;
						toastr.warning("Could not delete... Minimum One Role Required...!");
					}
				}
			}

			function InsertRoleMapping($item, input) {
				apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [input]).then(function SuccessCallback(response) {
					if (response.data.Response) {
						if (response.data.Response.length > 0) {
							$item.IsChecked = true;
							$item.MappingObj = response.data.Response[0];
						}
					}
				});
			}

			function UpdateRoleMapping($event, $item) {
				var _input = $item.MappingObj;
				_input.IsModified = true;

				if (!scope.isDefault || ($event && $item.IsAccessChecked)) {
					apiService.post("authAPI", appConfig.Entities.SecMappings.API.Upsert.Url, [_input]).then(function SuccessCallback(response) {
						if (response.data.Response) {
							if (response.data.Response.length > 0) {}
						}
					});
				}
			}
			// endregion

			Init();
		}
	}
})();
