"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const knexfile_js_1 = __importDefault(require("../db/knexfile.js"));
const knex_1 = __importDefault(require("knex"));
const router = express_1.default.Router();
const knex = (0, knex_1.default)(knexfile_js_1.default.development);
/*
  Deletes all records from registration and payment table.
*/
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield startWeek();
    res.status(response.status).json({ "message": response.message });
}));
/*
  Method to delete all data from registration and payment table.
*/
const startWeek = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield knex('registration').del();
        yield knex('payment').del();
        return { status: 200, message: "Registrations and payments from the week were deleted." };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
exports.default = router;
//# sourceMappingURL=startWeek.js.map