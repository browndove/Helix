/**
 * Onboarding checklist field schema — mirrors on-boarding/assets/data.js SECTIONS.
 * Used by the admin drawer to label every answer the facility provided.
 */
(function (global) {
  "use strict";

  const PHONE_DIAL_BY_ISO = {"AF":"+93","AL":"+355","DZ":"+213","AD":"+376","AO":"+244","AG":"+1","AR":"+54","AM":"+374","AU":"+61","AT":"+43","AZ":"+994","BS":"+1","BH":"+973","BD":"+880","BB":"+1","BY":"+375","BE":"+32","BZ":"+501","BJ":"+229","BT":"+975","BO":"+591","BA":"+387","BW":"+267","BR":"+55","BN":"+673","BG":"+359","BF":"+226","BI":"+257","KH":"+855","CM":"+237","CA":"+1","CV":"+238","CF":"+236","TD":"+235","CL":"+56","CN":"+86","CO":"+57","KM":"+269","CG":"+242","CD":"+243","CR":"+506","CI":"+225","HR":"+385","CU":"+53","CY":"+357","CZ":"+420","DK":"+45","DJ":"+253","DM":"+1","DO":"+1","EC":"+593","EG":"+20","SV":"+503","GQ":"+240","ER":"+291","EE":"+372","SZ":"+268","ET":"+251","FJ":"+679","FI":"+358","FR":"+33","GA":"+241","GM":"+220","GE":"+995","DE":"+49","GH":"+233","GR":"+30","GD":"+1","GT":"+502","GN":"+224","GW":"+245","GY":"+592","HT":"+509","HN":"+504","HK":"+852","HU":"+36","IS":"+354","IN":"+91","ID":"+62","IR":"+98","IQ":"+964","IE":"+353","IL":"+972","IT":"+39","JM":"+1","JP":"+81","JO":"+962","KZ":"+7","KE":"+254","KW":"+965","KG":"+996","LA":"+856","LV":"+371","LB":"+961","LS":"+266","LR":"+231","LY":"+218","LI":"+423","LT":"+370","LU":"+352","MO":"+853","MG":"+261","MW":"+265","MY":"+60","MV":"+960","ML":"+223","MT":"+356","MR":"+222","MU":"+230","MX":"+52","MD":"+373","MC":"+377","MN":"+976","ME":"+382","MA":"+212","MZ":"+258","MM":"+95","NA":"+264","NP":"+977","NL":"+31","NZ":"+64","NI":"+505","NE":"+227","NG":"+234","KP":"+850","MK":"+389","NO":"+47","OM":"+968","PK":"+92","PS":"+970","PA":"+507","PG":"+675","PY":"+595","PE":"+51","PH":"+63","PL":"+48","PT":"+351","PR":"+1","QA":"+974","RO":"+40","RU":"+7","RW":"+250","LC":"+1","SM":"+378","ST":"+239","SA":"+966","SN":"+221","RS":"+381","SC":"+248","SL":"+232","SG":"+65","SK":"+421","SI":"+386","SO":"+252","ZA":"+27","KR":"+82","SS":"+211","ES":"+34","LK":"+94","SD":"+249","SR":"+597","SE":"+46","CH":"+41","SY":"+963","TW":"+886","TJ":"+992","TZ":"+255","TH":"+66","TL":"+670","TG":"+228","TT":"+1","TN":"+216","TR":"+90","TM":"+993","UG":"+256","UA":"+380","AE":"+971","GB":"+44","US":"+1","UY":"+598","UZ":"+998","VE":"+58","VN":"+84","YE":"+967","ZM":"+260","ZW":"+263"};

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
        { key: "facility_phone", label: "Facility Phone", type: "phone-intl" },
      ],
    },
    {
      id: "primary_contact",
      title: "Primary Contact",
      icon: "blue",
      fields: [
        { key: "primary_name", label: "Primary Contact Name", type: "text" },
        { key: "primary_phone", label: "Primary Phone", type: "phone-intl" },
        { key: "primary_email", label: "Primary Email", type: "email" },
        { key: "emergency_contact", label: "Emergency Contact", type: "phone-intl" },
      ],
    },
    {
      id: "secondary_contact",
      title: "Secondary Contact",
      icon: "blue",
      optional: true,
      fields: [
        { key: "secondary_name", label: "Secondary Contact Name", type: "text" },
        { key: "secondary_phone", label: "Secondary Phone", type: "phone-intl" },
        { key: "secondary_email", label: "Secondary Contact Email", type: "email" },
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
  // Phone country/iso companions are stored with answers but folded into the phone display.
  ["facility_phone", "primary_phone", "emergency_contact", "secondary_phone"].forEach((key) => {
    knownKeys.add(key + "_country");
    knownKeys.add(key + "_iso");
  });

  const uploadKeys = [
    { key: "departments", label: "Departments" },
    { key: "units", label: "Units" },
    { key: "staff", label: "Staff" },
    { key: "roles", label: "Roles" },
    { key: "patients", label: "Patients" },
  ];

  const portalPhaseLabels = {
    checklist: "Facility checklist",
    departments: "Departments upload",
    units: "Units upload",
    staff: "Staff upload",
    roles: "Roles upload",
    patients: "Patients upload",
  };

  global.HelixOnboardingSchema = {
    sections,
    knownKeys,
    uploadKeys,
    portalPhaseLabels,
    phoneDialByIso: PHONE_DIAL_BY_ISO,
  };
})(window);
