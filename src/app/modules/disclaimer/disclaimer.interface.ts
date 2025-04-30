import { Model } from "mongoose";
import { DISCLAIMER_TYPE } from "../../../enums/disclaimer";

export type IDisclaimer = {
    content: string;
    type:DISCLAIMER_TYPE
};

export type DisclaimerModel = Model<IDisclaimer>;