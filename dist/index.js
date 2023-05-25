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
const app_1 = __importDefault(require("./app"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.default.listen(app_1.default.get('port'));
        console.log(`app --> Server started at port ${app_1.default.get('port')}`);
    }
    catch (error) {
        console.log(`app --> Server failed to start at port ${app_1.default.get('port')}`);
    }
});
main();
// try {
//     app.listen(app.get('port'));
//     console.log(`app --> Server started at port ${app.get('port')}`);
// } catch (error) {
//     console.log(`app --> Server failed to start at port ${app.get('port')}`);
// }
