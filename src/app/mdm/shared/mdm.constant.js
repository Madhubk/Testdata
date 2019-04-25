(function () {
    'use strict';

    var MDM_CONSTANT = {
        ocLazyLoadModules: [
            // region
            {
                name: 'MDM',
                files: [
                    'app/mdm/shared/mdm.css',
                    'app/mdm/shared/mdm.controller.js'
                ]
            },
            // endregion
            // region Organization
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
                    'app/mdm/organization/organization-menu/organization-menu.directive.js'
                ]
            }, {
                name: 'organizationGeneral',
                files: [
                    'app/mdm/organization/general/organization-general.directive.js',
                    'app/mdm/organization/general/organization-general-modal/general-modal.controller.js'
                ]
            }, {
                name: 'organizationAddress',
                files: [
                    'app/mdm/organization/address/organization-address.directive.js',
                    'app/mdm/organization/address/organization-address-modal/address-modal.controller.js'
                ]
            }, {
                name: 'organizationContact',
                files: [
                    'app/mdm/organization/contact/organization-contact.directive.js',
                    'app/mdm/organization/contact/organization-contact-modal/contact-modal.controller.js'
                ]
            }, {
                name: 'organizationCompany',
                files: [
                    'app/mdm/organization/company/organization-company.directive.js',
                    'app/mdm/organization/company/org-company-modal/org-company-modal.controller.js'
                ]
            }, {
                name: 'organizationEmployee',
                files: [
                    'app/mdm/organization/employee/organization-employee.directive.js',
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
                name: 'organizationWarehouse',
                files: [
                    'app/mdm/organization/warehouse/warehouse.css',
                    'app/mdm/organization/warehouse/warehouse.directive.js',
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js',
                    'app/mdm/organization/warehouse/editable-pages/editable-pages.controller.js'
                ]
            }, {
                name: 'organizationReference',
                files: [
                    'app/mdm/organization/reference/organization-reference.directive.js',
                    'app/mdm/organization/reference/org-reference-modal/org-reference-modal.controller.js'
                ]
            }, {
                name: 'organizationAccessRights',
                files: [
                    'app/mdm/organization/access-rights/organization-access-rights.directive.js',
                    'app/mdm/organization/access-rights/event-group/organization-event-group.directive.js',
                    'app/mdm/organization/access-rights/task-group/organization-task-group.directive.js',
                    'app/mdm/organization/access-rights/comment-group/organization-comment-group.directive.js',
                    'app/mdm/organization/access-rights/document-group/organization-document-group.directive.js',
                    'app/mdm/organization/access-rights/exception-group/organization-exception-group.directive.js',
                    'app/mdm/organization/access-rights/email-group/organization-email-group.directive.js'
                ]
            },
            // endregion
            // region Employee
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
            // region Branch
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
            // region Department
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
            // region Company
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
            // region Products
            {
                name: 'products',
                files: [
                    'app/mdm/products/products.css',
                    'app/mdm/products/products.controller.js',
                    'app/mdm/products/products-config.factory.js',
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js'
                ]
            }, {
                name: 'productBulkUpload',
                files: [
                    'app/mdm/products/product-bulk-upload/product-bulk-upload.controller.js',
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
            // region warehouse
            {
                name: 'MasterWarehouse',
                files: [
                    'app/mdm/warehouse/warehouse.css',
                    'app/mdm/warehouse/warehouse.controller.js',
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js'

                ]
            }, {
                name: 'MasterWarehouses',
                files: [
                    'app/mdm/warehouse/warehouses/warehouses.css',
                    'app/mdm/warehouse/warehouses/warehouses.controller.js',
                    'app/mdm/warehouse/warehouses/warehouses-config.factory.js'
                ]
            }, {
                name: 'MasterWarehousesMenu',
                files: [
                    'app/mdm/warehouse/warehouses/warehouse-menu/warehouse-menu.controller.js',
                    'app/mdm/warehouse/warehouses/warehouse-menu/warehouse-menu.directive.js'
                ]
            }, {
                name: 'MasterWarehousesDetails',
                files: [
                    'app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.controller.js',
                    'app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.directive.js',
                    'app/mdm/warehouse/warehouses/warehouse-details/warehouse-details.css'
                ]
            }, {
                name: 'MasterWarehouseAddress',
                files: [
                    'app/mdm/warehouse/warehouses/warehouse-details/organizationaddress/address.controller.js',
                    'app/mdm/warehouse/warehouses/warehouse-details/organizationaddress/address.css'
                ]
            },
            // area
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
            // location
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
            // region Vehicle Master
            {
                name: 'Vehicle',
                files: [
                    'app/mdm/vehicle/vehicle.css',
                    'app/mdm/vehicle/vehicle.controller.js',
                    'app/mdm/vehicle/vehicle-config.factory.js'
                ]
            }, {
                name: 'VehicleMenu',
                files: [
                    'app/mdm/vehicle/vehicle-menu/vehicle-menu.controller.js',
                    'app/mdm/vehicle/vehicle-menu/vehicle-menu.directive.js'
                ]
            }, {
                name: 'VehicleGeneral',
                files: [
                    'app/mdm/vehicle/vehicle-general/vehicle-general.controller.js',
                    'app/mdm/vehicle/vehicle-general/vehicle-general.directive.js'
                ]
            },
            // endregion
            // region TMS
            {
                name: 'MDMTransports',
                files: [
                    'app/mdm/transports/transports.css',
                    'app/mdm/transports/transports.controller.js',
                ]
            },
            // MHU
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
            // Journey
            {
                name: 'journey',
                files: [
                    'app/mdm/transports/journey/journey.css',
                    'app/mdm/transports/journey/journey.controller.js',
                    'app/mdm/transports/journey/journey-config.factory.js'
                ]
            }, {
                name: 'journeyGeneral',
                files: [
                    'app/mdm/transports/journey/journey-general/journey-general.css',
                    'app/mdm/transports/journey/journey-general/journey-general.controller.js',
                    'app/mdm/transports/journey/journey-general/journey-general.directive.js'
                ]
            },
            // --------------- Leg ------------
            // Leg
            {
                name: 'leg',
                files: [
                    'app/mdm/transports/leg/leg.css',
                    'app/mdm/transports/leg/leg.controller.js',
                    'app/mdm/transports/leg/leg-config.factory.js'
                ]
            }, {
                name: 'legGeneral',
                files: [
                    'app/mdm/transports/leg/leg-general/leg-general.css',
                    'app/mdm/transports/leg/leg-general/leg-general.controller.js',
                    'app/mdm/transports/leg/leg-general/leg-general.directive.js'
                ]
            },
            // Zone
            {
                name: 'zone',
                files: [
                    'app/mdm/transports/zone/zone.css',
                    'app/mdm/transports/zone/zone.controller.js',
                    'app/mdm/transports/zone/zone-config.factory.js'
                ]
            }, {
                name: 'zoneGeneral',
                files: [
                    'app/mdm/transports/zone/zone-general/zone-general.css',
                    'app/mdm/transports/zone/zone-general/zone-general.controller.js',
                    'app/mdm/transports/zone/zone-general/zone-general.directive.js'
                ]
            },
            // Non working days
            {
                name: 'nonWorkingDays',
                files: [
                    'app/mdm/transports/non-working-days/non-working-days.css',
                    'app/mdm/transports/non-working-days/non-working-days.controller.js',
                    'app/mdm/transports/non-working-days/non-working-days-config.factory.js'
                ]
            }, {
                name: 'nonWorkingDaysGeneral',
                files: [
                    'app/mdm/transports/non-working-days/general/general.css',
                    'app/mdm/transports/non-working-days/general/general.controller.js',
                    'app/mdm/transports/non-working-days/general/general.directive.js'
                ]
            },
            // Region
            {
                name: 'region',
                files: [
                    'app/mdm/transports/region/region.css',
                    'app/mdm/transports/region/region.controller.js',
                    'app/mdm/transports/region/region-config.factory.js'
                ]
            }, {
                name: 'regionGeneral',
                files: [
                    'app/mdm/transports/region/region-general/region-general.css',
                    'app/mdm/transports/region/region-general/region-general.controller.js',
                    'app/mdm/transports/region/region-general/region-general.directive.js'
                ]
            },
            // Mapping
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
            }, {
                name: 'mappingServiceType',
                files: [
                    'app/mdm/transports/mapping/service-type/service-type.css',
                    'app/mdm/transports/mapping/service-type/service-type.controller.js',
                    'app/mdm/transports/mapping/service-type/service-type.directive.js'
                ]
            }, {
                name: 'mappingContainermhu',
                files: [
                    'app/mdm/transports/mapping/container-mhu/container-mhu.css',
                    'app/mdm/transports/mapping/container-mhu/container-mhu.controller.js',
                    'app/mdm/transports/mapping/container-mhu/container-mhu.directive.js'
                ]
            }, {
                name: 'mappingReceiverCarrier',
                files: [
                    'app/mdm/transports/mapping/receiver-carrier/receiver-carrier.css',
                    'app/mdm/transports/mapping/receiver-carrier/receiver-carrier.controller.js',
                    'app/mdm/transports/mapping/receiver-carrier/receiver-carrier.directive.js'
                ]
            }, {
                name: 'mappingSenderReceiverCons',
                files: [
                    'app/mdm/transports/mapping/sender-receiver-cons/sender-receiver-cons.css',
                    'app/mdm/transports/mapping/sender-receiver-cons/sender-receiver-cons.controller.js',
                    'app/mdm/transports/mapping/sender-receiver-cons/sender-receiver-cons.directive.js'
                ]
            },
            // endregion

            //mapping
            {
                name: 'types',
                files: [
                    'app/mdm/transports/types/types.css',
                    'app/mdm/transports/types/types.controller.js',
                    'app/mdm/transports/types/types-config.factory.js'
                ]
            }, {
                name: 'typesMenu',
                files: [
                    'app/mdm/transports/types/types-menu/types-menu.css',
                    'app/mdm/transports/types/types-menu/types-menu.controller.js',
                    'app/mdm/transports/types/types-menu/types-menu.directive.js'
                ]
            }, {
                name: 'typesServiceType',
                files: [
                    'app/mdm/transports/types/service-type/service-type.css',
                    'app/mdm/transports/types/service-type/service-type.controller.js',
                    'app/mdm/transports/types/service-type/service-type.directive.js'
                ]
            }, {
                name: 'typesTags',
                files: [
                    'app/mdm/transports/types/tags/tags.css',
                    'app/mdm/transports/types/tags/tags.controller.js',
                    'app/mdm/transports/types/tags/tags.directive.js'
                ]
            }, {
                name: 'typesVehicleType',
                files: [
                    'app/mdm/transports/types/vehicle-type/vehicle-type.css',
                    'app/mdm/transports/types/vehicle-type/vehicle-type.controller.js',
                    'app/mdm/transports/types/vehicle-type/vehicle-type.directive.js'
                ]
            }, {
                name: 'typesLevelLoadType',
                files: [
                    'app/mdm/transports/types/level-load-type/level-load-type.css',
                    'app/mdm/transports/types/level-load-type/level-load-type.controller.js',
                    'app/mdm/transports/types/level-load-type/level-load-type.directive.js'
                ]
            }, {
                name: 'typesManifestType',
                files: [
                    'app/mdm/transports/types/manifest-type/manifest-type.css',
                    'app/mdm/transports/types/manifest-type/manifest-type.controller.js',
                    'app/mdm/transports/types/manifest-type/manifest-type.directive.js'
                ]
            }, {
                name: 'typesConsolEvent',
                files: [
                    'app/mdm/transports/types/consol-event/consol-event.css',
                    'app/mdm/transports/types/consol-event/consol-event.controller.js',
                    'app/mdm/transports/types/consol-event/consol-event.directive.js'
                ]
            },
            // #region Financesss
            {
                name: "Finance",
                files: [
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js',
                    'app/mdm/warehouse/custom/customfilter.js'
                ]
            },
            // #endregion
            //#region Creditor
            {
                name: 'creaditor',
                files: [
                    'app/mdm/creditor/creditor-config.factory.js',
                    'app/mdm/creditor/creditor.controller.js',
                    'app/mdm/creditor/creditor.css'
                ]
            }, {
                name: "creaditorMenu",
                files: [
                    "app/mdm/creditor/creditor-menu/creditor-menu.directive.js",
                    "app/mdm/creditor/creditor-menu/creditor-menu.controller.js",
                ]
            }, {
                name: "creaditorGeneral",
                files: [
                    "app/mdm/creditor/creditor-general/creditor-general.directive.js",
                    "app/mdm/creditor/creditor-general/creditor-general.controller.js",
                ]
            },
            //#endregion
            //#region Debtor
            {
                name: 'debtor',
                files: [
                    'app/mdm/debtor/debtor-config.factory.js',
                    'app/mdm/debtor/debtor.controller.js',
                    'app/mdm/debtor/debtor.css'
                ]
            }, {
                name: 'debtorMenu',
                files: [
                    'app/mdm/debtor/debtor-menu/debtor-menu.directive.js',
                    'app/mdm/debtor/debtor-menu/debtor-menu.controller.js'
                ]
            }, {
                name: 'debtorGeneral',
                files: [
                    'app/mdm/debtor/debtor-general/debtor-general.directive.js',
                    'app/mdm/debtor/debtor-general/debtor-general.controller.js'
                ]
            },
            //#endregion
            //#region Currency
            {
                name: 'currency',
                files: [
                    'app/mdm/currency/currency.config.factory.js',
                    'app/mdm/currency/currency.controller.js'
                ]
            }, {
                name: 'currencyMenu',
                files: [
                    'app/mdm/currency/currency-menu/currency-menu-directive.js',
                    'app/mdm/currency/currency-menu/currency-menu-controller.js'
                ]
            }, {
                name: 'currencyGeneral',
                files: [
                    'app/mdm/currency/currency-general/currency-general.directive.js',
                    'app/mdm/currency/currency-general/currency-general.controller.js'
                ]
            },
            //#endregion
            //#region Tax
            {
                name: 'tax',
                files: [
                    'app/mdm/tax/tax-config.factory.js',
                    'app/mdm/tax/tax.controller.js',
                    'app/mdm/tax/tax.css',
                    'app/mdm/warehouse/customize-table/customize-table.css',
                    'app/mdm/warehouse/customize-table/customize-table.directive.js',
                    'app/mdm/warehouse/custom/customfilter.js'
                ]
            }, {
                name: 'taxMenu',
                files: [
                    'app/mdm/tax/tax-menu/tax-menu.directive.js',
                    'app/mdm/tax/tax-menu/tax-menu.controller.js'
                ]
            }, {
                name: 'taxGeneral',
                files: [
                    'app/mdm/tax/tax-general/tax-general.directive.js',
                    'app/mdm/tax/tax-general/tax-general.controller.js'
                ]
            },
            // #endregion
            // #region - Exchange Rate
            {
                name: 'exchangeRate',
                files: [
                    'app/mdm/exchangeRate/exchangeRate.css',
                    'app/mdm/exchangeRate/exchangeRate-config.factory.js',
                    'app/mdm/exchangeRate/exchangeRate.controller.js'
                ]
            }, {
                name: 'exchangeRateMenu',
                files: [
                    'app/mdm/exchangeRate/exchangeRate-menu/exchangeRate-menu-directive.js',
                    'app/mdm/exchangeRate/exchangeRate-menu/exchangeRate-menu-controller.js'
                ]
            }, {
                name: 'exchangeRateGeneral',
                files: [
                    'app/eaxis/shared/eaxis.css',
                    'app/mdm/exchangeRate/exchangeRate-general/exchangeRate-general.css',
                    'app/mdm/exchangeRate/exchangeRate-general/exchangeRate-general-directive.js',
                    'app/mdm/exchangeRate/exchangeRate-general/exchangeRate-general-controller.js'
                ]
            },
            //#endregion
            //#region ChargeCode
            {
                name: 'chargeCode',
                files: [
                    'app/mdm/chargecode/chargecode-config.factory.js',
                    'app/mdm/chargecode/chargecode.controller.js',
                    'app/mdm/chargecode/chargecode.css'
                ]
            },
            {
                name: 'chargeCodeGeneral',
                files: [
                    'app/mdm/chargecode/chargecode-general/chargecode-general.controller.js',
                    'app/mdm/chargecode/chargecode-general/chargecode-general.directive.js'
                ]
            },
            {
                name: 'chargeCodeDetails',
                files: [
                    'app/mdm/chargecode/chargecode-details/chargecode-details.controller.js',
                    'app/mdm/chargecode/chargecode-details/chargecode-details.directive.js'
                ]
            },
            {
                name: 'chargeCodeTaxcode',
                files: [
                    'app/mdm/chargecode/chargecode-taxcode/chargecode-taxcode.controller.js',
                    'app/mdm/chargecode/chargecode-taxcode/chargecode-taxcode.directive.js'
                ]
            },
            {
                name: 'chargeCodeGLposting',
                files: [
                    'app/mdm/chargecode/chargecode-glpost/chargecode-glpost.controller.js',
                    'app/mdm/chargecode/chargecode-glpost/chargecode-glpost.directive.js'
                ]
            },
            {
                name: 'chargeCodeInvoice',
                files: [
                    'app/mdm/chargecode/chargecode-invoice/chargecode-invoice.controller.js',
                    'app/mdm/chargecode/chargecode-invoice/chargecode-invoice.directive.js'
                ]
            },
            {
                name: 'chargeCodeMenu',
                files: [
                    'app/mdm/chargecode/chargecode-menu/chargecode-menu.controller.js',
                    'app/mdm/chargecode/chargecode-menu/chargecode-menu.directive.js'
                ]
            }
            //#endregion
        ]
    };

    angular
        .module("Application")
        .constant("MDM_CONSTANT", MDM_CONSTANT);
})();
