import QueryBuilder from "../../builder/QueryBuilder";
import { IService } from "./service.interface";
import { Service } from "./service.model";

const createServiceToDB = async (data:any):Promise<IService> => {
   

    const raw = JSON.parse(data.facilities)
    
    delete data.facilities
    const result = await Service.create({...data,facilities:raw})
    return result
}

const getAllServicesFromDB = async (query:Record<string,any>) => {
	const result = new QueryBuilder(Service.find({status:'active'}),query).paginate().sort().search(["title"]).filter()

    const paginationResult = await result.getPaginationInfo()

    const data = await result.modelQuery.lean()

    return {
        paginationResult,
        data
    }
};

const getServiceByIdFromDB = async (id:string) => {
	return await Service.findById(id);
};

const deleteServiceByIdFromDB = async (id:string) => {
	await Service.updateOne({_id:id},{status:'deleted'})
}

const updateServiceByIdFromDB = async (id:string,data:any) => {
    if(data.facilities.length){
		data.facilities=JSON.parse(data.facilities)
	}
	return await Service.findByIdAndUpdate(id,data,{new:true})
}

export const ServiceService = {
	createServiceToDB,
	getAllServicesFromDB,
	getServiceByIdFromDB,
	deleteServiceByIdFromDB,
	updateServiceByIdFromDB
}