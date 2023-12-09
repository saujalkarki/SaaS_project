const {
  renderOrganizationForm,
} = require("../controller/organization/organizationController");

const router = require("express").Router();

router.route("/organization").get(renderOrganizationForm);

module.exports = router;
