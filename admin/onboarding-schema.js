/**
 * Onboarding checklist field schema — mirrors on-boarding/assets/data.js SECTIONS.
 * Used by the admin drawer to label every answer the facility provided.
 */
(function (global) {
  "use strict";

  const sections = [
    {
      id: "facility",
      title: "Facility Information",
      icon: "teal",
      fields: [
        { key: "facility_name", label: "Facility Name", type: "text" },
        { key: "facility_type", label: "Facility Type", type: "select" },
        { key: "facility_region", label: "Region", type: "select" },
        { key: "facility_city", label: "City / Town", type: "text" },
        { key: "facility_address", label: "Facility Address", type: "textarea" },
        { key: "facility_email", label: "Facility Email", type: "email" },
        { key: "facility_phone_country", label: "Facility Phone Country", type: "text" },
        { key: "facility_phone", label: "Facility Phone", type: "phone-intl" },
      ],
    },
    {
      id: "primary_contact",
      title: "Primary Contact",
      icon: "blue",
      fields: [
        { key: "primary_name", label: "Primary Contact Name", type: "text" },
        { key: "primary_phone_country", label: "Primary Phone Country", type: "text" },
        { key: "primary_phone", label: "Primary Phone", type: "phone-intl" },
        { key: "primary_email", label: "Primary Email", type: "email" },
      ],
    },
    {
      id: "secondary_contact",
      title: "Secondary Contact",
      icon: "blue",
      optional: true,
      fields: [
        { key: "secondary_name", label: "Secondary Contact Name", type: "text" },
        { key: "secondary_phone_country", label: "Secondary Phone Country", type: "text" },
        { key: "secondary_phone", label: "Secondary Phone", type: "phone-intl" },
        { key: "secondary_email", label: "Secondary Email", type: "email" },
      ],
    },
    {
      id: "staffing",
      title: "Staffing",
      icon: "amber",
      fields: [
        { key: "total_employees", label: "Total Employees", type: "number" },
        { key: "total_clinical_staff", label: "Clinical Staff", type: "number" },
        { key: "total_nonclinical_staff", label: "Non-Clinical Staff", type: "number" },
        { key: "has_it_team", label: "Dedicated IT Team", type: "yesno" },
        { key: "total_it_staff", label: "IT Staff Count", type: "number" },
      ],
    },
    {
      id: "services",
      title: "Services & Infrastructure",
      icon: "violet",
      fields: [
        { key: "has_emergency", label: "Emergency Department", type: "yesno" },
        { key: "has_inpatient_wards", label: "Inpatient Wards", type: "yesno" },
        { key: "total_inpatient_beds", label: "Inpatient Beds", type: "number" },
        { key: "has_ambulance", label: "Ambulance / Transfers", type: "yesno" },
        { key: "has_medical_director", label: "Medical Director", type: "yesno" },
      ],
    },
    {
      id: "staff_systems",
      title: "Staff Systems & Directory",
      icon: "teal",
      fields: [
        { key: "staff_has_id", label: "Official Staff IDs", type: "yesno" },
        { key: "staff_has_work_email", label: "Work Email Addresses", type: "yesno" },
        { key: "staff_uses_personal_email", label: "Personal Email for Work", type: "yesno" },
        { key: "has_employee_directory", label: "Employee Directory", type: "yesno" },
        { key: "staff_list_by_department", label: "Staff List by Department", type: "yesno" },
        { key: "staff_list_by_role", label: "Staff List by Role", type: "yesno" },
      ],
    },
  ];

  const knownKeys = new Set(sections.flatMap((s) => s.fields.map((f) => f.key)));

  const uploadKeys = [
    { key: "departments", label: "Departments" },
    { key: "staff", label: "Staff" },
    { key: "roles", label: "Roles" },
    { key: "patients", label: "Patients" },
  ];

  const portalPhaseLabels = {
    checklist: "Facility checklist",
    departments: "Departments upload",
    staff: "Staff upload",
    roles: "Roles upload",
    patients: "Patients upload",
  };

  global.HelixOnboardingSchema = {
    sections,
    knownKeys,
    uploadKeys,
    portalPhaseLabels,
  };
})(window);
