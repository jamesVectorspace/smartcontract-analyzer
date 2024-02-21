const express = require("express");
const { handleAudit } = require("../controllers/audit.controller");
const router = express.Router();

router.post("/audit-contract", handleAudit);

module.exports = router;
