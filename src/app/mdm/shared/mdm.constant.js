(function () {
    'use strict';

    var MDM_CONSTANT = {
        ocLazyLoadModules: [
            // -------------MDM-------------
            // region
            {
                name: 'MD',
                files: [
                    'app/mdm/shared/mdm.css',
                    'app/mdm/shared/mdm.controller.js'
                ]
            }, {
                name: 'MDHome',
                files: [
                    'app/mdm/home/home.css',
                    'app/mdm/home/home.controller.js'
                ]
            }, {
                name: 'MDDashboard',
                files: [
                    'app/mdm/dashboard/dashboard.css',
                    'app/mdm/dashboard/dashboard.controller.js'
                ]
            },
            // endregion
            // -------------Organization-------------
            // region
            {
                name: 'organization',
                files: [
                    'app/mdm/organization/organization.css',
                    'app/mdm/organization/organization.controller.js',
                    'app/mdm/organization/organization-config.factory.js'
                ]
            }, {
                name: 'organizationMenu',
                files: [
                    'app/mdm/organization/organization-menu/organization-menu.css',
                    'app/mdm/organization/organization-menu/organization-menu.controller.js',
                    'app/mdm/organization/organization-menu/organization-menu.directive.js'
                ]
            }, {
                name: 'organizationGeneral',
                files: [
                    'app/mdm/organization/general/organization-general.css',
                    'app/mdm/organization/general/organization-general.controller.js',
                    'app/mdm/organization/general/organization-general.directive.js'
                ]
            }, {
                name: 'organizationGeneralModal',
                files: [
                    'app/mdm/organization/general/organization-general-modal/general-modal.css',
                    'app/mdm/organization/general/organization-general-modal/general-modal.controller.js'
                ]
            }, {
                name: 'organizationAddress',
                files: [
                    'app/mdm/organization/address/organization-address.css',
                    'app/mdm/organization/address/organization-address.controller.js',
                    'app/mdm/organization/address/organization-address.directive.js'
                ]
            }, {
                name: 'organizationAddressModal',
                files: [
                    'app/mdm/organization/address/organization-address-modal/address-modal.css',
                    'app/mdm/organization/address/organization-address-modal/address-modal.controller.js'
                ]
            }, {
                name: 'organizationContact',
                files: [
                    'app/mdm/organization/contact/organization-contact.css',
                    'app/mdm/organization/contact/organization-contact.controller.js',
                    'app/mdm/organization/contact/organization-contact.directive.js'
                ]
            }, {
                name: 'organizationContactModal',
                files: [
                    'app/mdm/organization/contact/organization-contact-modal/contact-modal.css',
                    'app/mdm/organization/contact/organization-contact-modal/contact-modal.controller.js'
                ]
            }, {
                name: 'organizationCompany',
                files: [
                    'app/mdm/organization/company/organization-company.css',
                    'app/mdm/organization/company/organization-company.controller.js',
                    'app/mdm/organization/company/organization-company.directive.js'
                ]
            }, {
                name: 'organizationCompanyModal',
                files: [
                    'app/mdm/organization/company/org-company-modal/org-company-modal.css',
                    'app/mdm/organization/company/org-company-modal/org-company-modal.controller.js'
                ]
            }, {
                name: 'organizationEmployee',
                files: [
                    'app/mdm/organization/employee/organization-employee.css',
                    'app/mdm/organization/employee/organization-employee.controller.js',
                    'app/mdm/organization/employee/organization-employee.directive.js'
                ]
            }, {
                name: 'organizationEmployeeModal',
                files: [
                    'app/mdm/organization/employee/org-employee-modal/org-employee-modal.css',
                    'app/mdm/organization/employee/org-employee-modal/org-employee-modal.controller.js'
                ]
            }, {
                name: 'organizationRelatedParties',
                files: [
                    'app/mdm/organization/relatedparties/organization-relatedparties.css',
                    'app/mdm/organization/relatedparties/organization-relatedparties.controller.js',
                    'app/mdm/organization/relatedparties/organization-relatedparties.directive.js'
                ]
            }, {
                name: 'organizationRelatedPartiesModal',
                files: [
                    'app/mdm/organization/relatedparties/org-relatedparties-modal/org-relatedparties-modal.css',
                    'app/mdm/organization/relatedparties/org-relatedparties-modal/org-relatedparties-modal.controller.js'
                ]
            }, {
                name: 'organizationGenRelatedParties',
                files: [
                    'app/mdm/organization/generalrelatedparties/organization-generalrelatedparties.css',
                    'app/mdm/organization/generalrelatedparties/organization-generalrelatedparties.controller.js',
                    'app/mdm/organization/generalrelatedparties/organization-generalrelatedparties.directive.js'
                ]
            }, {
                name: 'organizationGenRelatedPartiesModal',
                files: [
                    'app/mdm/organization/generalrelatedparties/org-generalrelatedparties-modal/org-generalrelatedparties-modal.css',
                    'app/mdm/organization/generalrelatedparties/org-generalrelatedparties-modal/org-generalrelatedparties-modal.controller.js'
                ]
            }, {
                name: 'organizationVisibility',
                files: [
                    'app/mdm/organization/visibility/organization-visibility.css',
                    'app/mdm/organization/visibility/organization-visibility.controller.js',
                    'app/mdm/organization/visibility/organization-visibility.directive.js'
                ]
            }, {
                name: 'organizationConsignee',
                files: [
                    'app/mdm/organization/consignee/organization-consignee.css',
                    'app/mdm/organization/consignee/organization-consignee.controller.js',
                    'app/mdm/organization/consignee/organization-consignee.directive.js'
                ]
            }, {
                name: 'organizationConsigneeModal',
                files: [
                    'app/mdm/organization/consignee/consignee-modal/consignee-modal.css',
                    'app/mdm/organization/consignee/consignee-modal/consignee-modal.controller.js'
                ]
            }, {
                name: 'organizationConsigneeDocModal',
                files: [
                    'app/mdm/organization/consignee/consignee-doc-modal/consignee-doc-modal.css',
                    'app/mdm/organization/consignee/consignee-doc-modal/consignee-doc-modal.controller.js'
                ]
            }, {
                name: 'organizationConsignor',
                files: [
                    'app/mdm/organization/consignor/organization-consignor.css',
                    'app/mdm/organization/consignor/organization-consignor.controller.js',
                    'app/mdm/organization/consignor/organization-consignor.directive.js'
                ]
            }, {
                name: 'organizationConsignorModal',
                files: [
                    'app/mdm/organization/consignor/consignor-modal/consignor-modal.css',
                    'app/mdm/organization/consignor/consignor-modal/consignor-modal.controller.js'
                ]
            }, {
                name: 'organizationConsignorDocModal',
                files: [
                    'app/mdm/organization/consignor/consignor-doc-modal/consignor-doc-modal.css',
                    'app/mdm/organization/consignor/consignor-doc-modal/consignor-doc-modal.controller.js'
                ]
            }, {
                name: 'organizationWarehouseModal',
                files: [
                    'app/mdm/organization/warehouse/org-warehouse-modal/org-warehouse-modal.controller.js',
                    'app/mdm/organization/warehouse/org-warehouse-modal/org-warehouse-modal.css',
                ]
            }, {
                name: 'organizationWarehouse',
                files: [
                    'app/mdm/organization/warehouse/orgwarehouse.controller.js',
                    'app/mdm/organization/warehouse/orgwarehouse.directive.js',
                    'app/mdm/organization/warehouse/orgwarehouse.css'
                ]
            }, {
                name: 'organizationReference',
                files: [
                    'app/mdm/organization/reference/organization-reference.css',
                    'app/mdm/organization/reference/organization-reference.controller.js',
                    'app/mdm/organization/reference/organization-reference.directive.js'
                ]
            }, {
                name: 'organizationReferenceModal',
                files: [
                    'app/mdm/organization/reference/org-reference-modal/org-reference-modal.css',
                    'app/mdm/organization/reference/org-reference-modal/org-reference-modal.controller.js'
                ]
            },
            // endregion
            // -------------Employee-------------
            // region
            {
                name: 'MDEmployee',
                files: [
                    'app/mdm/employee/employee.css',
                    'app/mdm/employee/employee.controller.js',
                    'app/mdm/employee/employee-config.factory.js'
                ]
            }, {
                name: 'MDEmployeeMenu',
                files: [
                    'app/mdm/employee/employee-menu/employee-menu.css',
                    'app/mdm/employee/employee-menu/employee-menu.controller.js',
                    'app/mdm/employee/employee-menu/employee-menu.directive.js'
                ]
            }, {
                name: 'MDEmployeeDetails',
                files: [
                    'app/mdm/employee/employee-details/employee-details.css',
                    'app/mdm/employee/employee-details/employee-details.directive.js',
                    'app/mdm/employee/employee-details/employee-details.controller.js'
                ]
            }, {
                name: 'MDEmployeeDetailsModal',
                files: [
                    'app/mdm/employee/employee-details/emp-edit-details/employee-details-modal.css',
                    'app/mdm/employee/employee-details/emp-edit-details/employee-details-modal.controller.js'
                ]
            },
            // endregion
            // -------------Branch-------------
            // region
            {
                name: 'MDBranch',
                files: [
                    'app/mdm/branch/branch.css',
                    'app/mdm/branch/branch.controller.js',
                    'app/mdm/branch/branch-config.factory.js'
                ]
            }, {
                name: 'MDBranchMenu',
                files: [
                    'app/mdm/branch/branch-menu/branch-menu.css',
                    'app/mdm/branch/branch-menu/branch-menu.controller.js',
                    'app/mdm/branch/branch-menu/branch-menu-directive.js'
                ]
            }, {
                name: 'MDBranchDetails',
                files: [
                    'app/mdm/branch/branch-details/branch-details.css',
                    'app/mdm/branch/branch-details/branch-details.directive.js',
                    'app/mdm/branch/branch-details/branch-details.controller.js'
                ]
            }, {
                name: 'MDBranchDetailsModal',
                files: [
                    'app/mdm/branch/branch-details/branch-edit-details/branch-details-modal.css',
                    'app/mdm/branch/branch-details/branch-edit-details/branch-details-modal.controller.js'
                ]
            },
            // endregion
            // -------------Department-------------
            // region
            {
                name: 'MDDepartment',
                files: [
                    'app/mdm/department/department.css',
                    'app/mdm/department/department.controller.js',
                    'app/mdm/department/department-config.factory.js'
                ]
            }, {
                name: 'MDDepartmentMenu',
                files: [
                    'app/mdm/department/department-menu/department-menu.css',
                    'app/mdm/department/department-menu/department-menu-controller.js',
                    'app/mdm/department/department-menu/department-menu-directive.js'
                ]
            }, {
                name: 'MDDepartmentDetails',
                files: [
                    'app/mdm/department/department-details/department.details.css',
                    'app/mdm/department/department-details/department-details-directive.js',
                    'app/mdm/department/department-details/department-details-controller.js'
                ]
            }, {
                name: 'MDDepartmentDetailsModal',
                files: [
                    'app/mdm/department/department-details/department-edit-basics/department-basics-modal.css',
                    'app/mdm/department/department-details/department-edit-basics/department-basics-modal.controller.js'
                ]
            },
            // endregion
            // -------------Company-------------
            // region
            {
                name: 'MDCompany',
                files: [
                    'app/mdm/company/company.css',
                    'app/mdm/company/company-controller.js',
                    'app/mdm/company/company-config.factory.js'
                ]
            }, {
                name: 'MDCompanyMenu',
                files: [
                    'app/mdm/company/company-menu/company-menu.css',
                    'app/mdm/company/company-menu/company-menu-controller.js',
                    'app/mdm/company/company-menu/company-menu-directive.js'
                ]
            }, {
                name: 'MDCompanyDetails',
                files: [
                    'app/mdm/company/company-details/company-details.css',
                    'app/mdm/company/company-details/company-details-directive.js',
                    'app/mdm/company/company-details/company-details-controller.js'
                ]
            }, {
                name: 'MDCompanyDetailsModal',
                files: [
                    'app/mdm/company/company-details/company-edit-details/company-details-modal.css',
                    'app/mdm/company/company-details/company-edit-details/company-details-modal.controller.js'
                ]
            },
            // endregion
            //-------------------Products-----------------
            // region
            {
                name: 'products',
                files: [
                    'app/mdm/products/products.css',
                    'app/mdm/products/products.controller.js',
                    'app/mdm/products/products-config.factory.js'
                ]
            }, {
                name: 'productMenu',
                files: [
                    'app/mdm/products/product-menu/product-menu.css',
                    'app/mdm/products/product-menu/product-menu.controller.js',
                    'app/mdm/products/product-menu/product-menu.directive.js'
                ]
            }, {
                name: 'productGeneral',
                files: [
                    'app/mdm/products/product-general/product-general.css',
                    'app/mdm/products/product-general/product-general.controller.js',
                    'app/mdm/products/product-general/product-general.directive.js'
                ]
            }, {
                name: 'general',
                files: [
                    'app/mdm/products/product-general/general/general.css',
                    'app/mdm/products/product-general/general/general.controller.js',
                    'app/mdm/products/product-general/general/general.directive.js'
                ]
            }, {
                name: 'additionalDetails',
                files: [
                    'app/mdm/products/product-general/additional-details/additionaldetails.css',
                    'app/mdm/products/product-general/additional-details/additionaldetails.controller.js',
                    'app/mdm/products/product-general/additional-details/additionaldetails.directive.js'
                ]
            }, {
                name: 'barcodes',
                files: [
                    'app/mdm/products/product-general/barcodes/barcodes.css',
                    'app/mdm/products/product-general/barcodes/barcodes.controller.js',
                    'app/mdm/products/product-general/barcodes/barcodes.directive.js'
                ]
            }, {
                name: 'bom',
                files: [
                    'app/mdm/products/product-general/bom/bom.css',
                    'app/mdm/products/product-general/bom/bom.controller.js',
                    'app/mdm/products/product-general/bom/bom.directive.js'
                ]
            }, {
                name: 'productWarehouse',
                files: [
                    'app/mdm/products/product-general/product-warehouse/productwarehouse.css',
                    'app/mdm/products/product-general/product-warehouse/productwarehouse.controller.js',
                    'app/mdm/products/product-general/product-warehouse/productwarehouse.directive.js'
                ]
            }, {
                name: 'relatedOrganization',
                files: [
                    'app/mdm/products/product-general/related-organization/organization.css',
                    'app/mdm/products/product-general/related-organization/organization.controller.js',
                    'app/mdm/products/product-general/related-organization/organization.directive.js'
                ]
            }, {
                name: 'unitConversions',
                files: [
                    'app/mdm/products/product-general/unit-conversions/conversions.css',
                    'app/mdm/products/product-general/unit-conversions/conversions.controller.js',
                    'app/mdm/products/product-general/unit-conversions/conversions.directive.js'
                ]
            }, {
                name: 'pickFace',
                files: [
                    'app/mdm/products/product-general/product-warehouse/pick-face/pickface.css',
                    'app/mdm/products/product-general/product-warehouse/pick-face/pickface.controller.js',
                    'app/mdm/products/product-general/product-warehouse/pick-face/pickface.directive.js'
                ]
            }, {
                name: 'productAdditional',
                files: [
                    'app/mdm/products/product-additional/product-additional.css',
                    'app/mdm/products/product-additional/product-additional.controller.js',
                    'app/mdm/products/product-additional/product-additional.directive.js'
                ]
            }, {
                name: 'productBom',
                files: [
                    'app/mdm/products/product-bom/product-bom.css',
                    'app/mdm/products/product-bom/product-bom.controller.js',
                    'app/mdm/products/product-bom/product-bom.directive.js'
                ]
            },
            // endregion
            // --------------------- warehouse --------------------------
            // region
            {
                name: 'warehouse',
                files: [
                    'app/mdm/warehouse/warehouse.css',
                    'app/mdm/warehouse/warehouse.controller.js'
                ]
            }, {
                name: 'warehouses',
                files: [
                    'app/mdm/warehouse/warehouses/warehouses.css',
                    'app/mdm/warehouse/warehouses/warehouses.controller.js',
                    'app/mdm/warehouse/warehouses/warehouses-config.factory.js'
                ]
            }, {
                name: 'warehousesMenu',
                files: [
                    'app/mdm/warehouse/warehouses/warehouse-menu/warehouse-menu.controller.js',
                    'app/mdm/warehouse/warehouses/warehouse-menu/warehouse-menu.directive.js'
                ]
            }, {
                name: 'warehousesDetails',
                files: [
                    'app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.controller.js',
                    'app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.directive.js',
                    'app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.css'
                ]
            }, {
                name: 'warehouseAddress',
                files: [
                    'app/mdm/warehouse/warehouses/warehouse-details/organizationaddress/address.controller.js',
                    'app/mdm/warehouse/warehouses/warehouse-details/organizationaddress/address.css'
                ]
            },
            // endregion
            // --------------------- area -------------------------
            // region
            {
                name: 'areas',
                files: [
                    'app/mdm/warehouse/areas/areas.css',
                    'app/mdm/warehouse/areas/areas.controller.js',
                    'app/mdm/warehouse/areas/areas-config.factory.js'
                ]
            }, {
                name: 'areasDetails',
                files: [
                    'app/mdm/warehouse/areas/areas-details/areas-details.css',
                    'app/mdm/warehouse/areas/areas-details/areas-details.controller.js',
                    'app/mdm/warehouse/areas/areas-details/areas-details.directive.js'
                ]
            }, {
                name: 'areasMenu',
                files: [
                    'app/mdm/warehouse/areas/areas-menu/areas-menu.css',
                    'app/mdm/warehouse/areas/areas-menu/areas-menu.controller.js',
                    'app/mdm/warehouse/areas/areas-menu/areas-menu.directive.js'
                ]
            },
            // endregion
            // ----------------- location ------------------
            // region
            {
                name: 'location',
                files: [
                    'app/mdm/warehouse/locations/location.css',
                    'app/mdm/warehouse/locations/location.controller.js',
                    'app/mdm/warehouse/locations/location-config.factory.js'
                ]
            }, {
                name: 'locationDashboard',
                files: [
                    'app/mdm/warehouse/locations/location-config.factory.js',
                    'app/mdm/warehouse/locations/location-dashboard/location-dashboard.css',
                    'app/mdm/warehouse/locations/location-dashboard/location-dashboard.controller.js'
                ]
            }, {
                name: 'locationDashboardV2',
                files: [
                    'app/mdm/warehouse/locations/location-dashboard-V2/location-dashboardV2.css',
                    'app/mdm/warehouse/locations/location-dashboard-V2/location-dashboardV2.controller.js'
                ]
            }, {
                name: 'LocationDashboardModal',
                files: [
                    'app/mdm/warehouse/locations/location-dashboard-modal/location-dashboard-modal.css',
                    'app/mdm/warehouse/locations/location-dashboard-modal/location-dashboard-modal.controller.js',
                    'app/mdm/warehouse/locations/location-dashboard-modal/location-dashboard-modal.directive.js'
                ]
            }, {
                name: 'locationMenu',
                files: [
                    'app/mdm/warehouse/locations/location-menu/location-menu.css',
                    'app/mdm/warehouse/locations/location-menu/location-menu.controller.js',
                    'app/mdm/warehouse/locations/location-menu/location-menu.directive.js'
                ]
            }, {
                name: 'locationDetails',
                files: [
                    'app/mdm/warehouse/locations/location-details/location-details.css',
                    'app/mdm/warehouse/locations/location-details/location-details.controller.js',
                    'app/mdm/warehouse/locations/location-details/location-details.directive.js'
                ]
            },
            // endregion
            // --------- TMS START --------------
            {
                name: 'Transports',
                files: [
                    'app/mdm/transports/transports.css',
                    'app/mdm/transports/transports.controller.js',
                ]
            },
            // --------------- MHU ------------
            // region
            {
                name: 'mhu',
                files: [
                    'app/mdm/transports/mhu/mhu.css',
                    'app/mdm/transports/mhu/mhu.controller.js',
                    'app/mdm/transports/mhu/mhu-config.factory.js'
                ]
            }, {
                name: 'mhuMenu',
                files: [
                    'app/mdm/transports/mhu/mhu-menu/mhu-menu.css',
                    'app/mdm/transports/mhu/mhu-menu/mhu-menu.controller.js',
                    'app/mdm/transports/mhu/mhu-menu/mhu-menu.directive.js'
                ]
            }, {
                name: 'mhuGeneral',
                files: [
                    'app/mdm/transports/mhu/mhu-general/mhu-general.css',
                    'app/mdm/transports/mhu/mhu-general/mhu-general.controller.js',
                    'app/mdm/transports/mhu/mhu-general/mhu-general.directive.js'
                ]
            }, {
                name: 'mhuRelatedOrg',
                files: [
                    'app/mdm/transports/mhu/mhu-general/related-organization/related-organization.css',
                    'app/mdm/transports/mhu/mhu-general/related-organization/related-organization.controller.js',
                    'app/mdm/transports/mhu/mhu-general/related-organization/related-organization.directive.js'
                ]
            },
            // endregion
            // --------------- Journey ------------
            // region
            {
                name: 'journey',
                files: [
                    'app/mdm/transports/journey/journey.css',
                    'app/mdm/transports/journey/journey.controller.js',
                    'app/mdm/transports/journey/journey-config.factory.js'
                ]
            },
            // endregion
            // --------------- Leg ------------
            // region
            {
                name: 'leg',
                files: [
                    'app/mdm/transports/leg/leg.css',
                    'app/mdm/transports/leg/leg.controller.js',
                    'app/mdm/transports/leg/leg-config.factory.js'
                ]
            },
            // endregion
            // --------------- Zone ------------
            // region
            {
                name: 'zone',
                files: [
                    'app/mdm/transports/zone/zone.css',
                    'app/mdm/transports/zone/zone.controller.js',
                    'app/mdm/transports/zone/zone-config.factory.js'
                ]
            },
            // endregion
            // --------------- Mapping ------------
            // region
            {
                name: 'mapping',
                files: [
                    'app/mdm/transports/mapping/mapping.css',
                    'app/mdm/transports/mapping/mapping.controller.js',
                    'app/mdm/transports/mapping/mapping-config.factory.js'
                ]
            }, {
                name: 'mappingMenu',
                files: [
                    'app/mdm/transports/mapping/mapping-menu/mapping-menu.css',
                    'app/mdm/transports/mapping/mapping-menu/mapping-menu.controller.js',
                    'app/mdm/transports/mapping/mapping-menu/mapping-menu.directive.js'
                ]
            }, {
                name: 'mappingSenderCarrier',
                files: [
                    'app/mdm/transports/mapping/sender-carrier/sender-carrier.css',
                    'app/mdm/transports/mapping/sender-carrier/sender-carrier.controller.js',
                    'app/mdm/transports/mapping/sender-carrier/sender-carrier.directive.js'
                ]
            }, {
                name: 'mappingSenderReceiver',
                files: [
                    'app/mdm/transports/mapping/sender-receiver/sender-receiver.css',
                    'app/mdm/transports/mapping/sender-receiver/sender-receiver.controller.js',
                    'app/mdm/transports/mapping/sender-receiver/sender-receiver.directive.js'
                ]
            }, {
                name: 'mappingCarrierVehicle',
                files: [
                    'app/mdm/transports/mapping/carrier-vehicle/carrier-vehicle.css',
                    'app/mdm/transports/mapping/carrier-vehicle/carrier-vehicle.controller.js',
                    'app/mdm/transports/mapping/carrier-vehicle/carrier-vehicle.directive.js'
                ]
            }, {
                name: 'mappingStoreDepot',
                files: [
                    'app/mdm/transports/mapping/store-depot/store-depot.css',
                    'app/mdm/transports/mapping/store-depot/store-depot.controller.js',
                    'app/mdm/transports/mapping/store-depot/store-depot.directive.js'
                ]
            }, {
                name: 'mappingDcDepotStore',
                files: [
                    'app/mdm/transports/mapping/dc-depot-store/dc-depot-store.css',
                    'app/mdm/transports/mapping/dc-depot-store/dc-depot-store.controller.js',
                    'app/mdm/transports/mapping/dc-depot-store/dc-depot-store.directive.js'
                ]
            }

            // endregion
        ]
    };

    angular
        .module("Application")
        .constant("MDM_CONSTANT", MDM_CONSTANT);
})();
