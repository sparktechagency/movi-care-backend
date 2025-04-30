import { IDisclaimer } from "./disclaimer.interface";
import { Disclaimer } from "./disclaimer.model";

const createDisclaimerToDB = async (data:IDisclaimer)=>{
    const exist = await Disclaimer.findOne({type:data.type})
    if(exist){
        const disclaimer = await Disclaimer.findByIdAndUpdate(exist._id,data,{new:true});
        return disclaimer; 
    }else{
        const disclaimer = await Disclaimer.create(data);
        return disclaimer;
    }
}

const getDisclaimerFromDB=async(type:string)=>{
    const disclaimer = await Disclaimer.findOne({type:type}).lean();
    return disclaimer;
}
export const DisclaimerService={
    createDisclaimerToDB,
    getDisclaimerFromDB,
}