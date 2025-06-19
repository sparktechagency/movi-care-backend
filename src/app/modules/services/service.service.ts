import { IService } from "./service.interface";
import { Service } from "./service.model";

const createServiceIntoDB = async (data:IService)=>{
    const result=await Service.create(data);
    return result;
}

const getAllServicesFromDB =async ()=>{
    const result= await Service.find({}).lean()

    return result;
}

const getSingleServiceFromDB =async(id:string)=>{
    const result= await Service.findById({_id:id}).lean()
    return result; 
}

const updateServiceIntoDB =async(id:string,data:any)=>{
    const result= await Service.findByIdAndUpdate(id,{$set:data},{new:true}).lean();
    return result
}

const deleteServiceFromDB = async(id:string)=>{
    const result= await Service.findOneAndDelete({_id:id});
    return result
}
export const ServiceService={
    createServiceIntoDB,
    getAllServicesFromDB,
    getSingleServiceFromDB,
    updateServiceIntoDB,
    deleteServiceFromDB
}