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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const examples = {
    "hello world": {
        r: '0ef24cd3e7ef4f8caead400d10b5bc139a153aa669fa5bc2bec8abc350c0aacf',
        s: '744ac33d7f4a542375562eaaa192536b30e80791fba07c88ea9b41047341bb35',
        v: 1,
        msg: 'hello world',
        encodedMsg: '68656c6c6f20776f726c64'
    },
    "hello world!": {
        msg: 'hello world!',
        r: "4ee5e440380b537c519933083cbe17f7dc9e62d472158f7290144f23742b983b",
        s: "71aaa4aacadbab9dec5938517a5b93ffd5088ffe2547f0ce4fd53fe6e4abf84b",
        v: 0,
        encodedMsg: '68656c6c6f20776f726c6421'
    },
    "hello world!!": {
        msg: 'hello world!!',
        r: "e09af4167c0591071c5a5ae2cb12aebd3f0ca1833be25c4024103c99c8db47fb",
        s: "2d9acd9d687e034821e1a4b18c8762c7aebc57e36a589393932c758a8a9db37a",
        v: 0,
        encodedMsg: '68656c6c6f20776f726c642121'
    }
};
const { r, s, v, encodedMsg, msg } = examples['hello world!'];
(() => __awaiter(void 0, void 0, void 0, function* () {
    const recoveredAddress = ethers_1.ethers.utils.recoverAddress(`0x${encodedMsg}`, { r: `0x${r}`, s: `0x${s}`, v: v });
    console.log({ recoveredAddress });
}))();
