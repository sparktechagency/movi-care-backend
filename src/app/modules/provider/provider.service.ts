import ApiError from "../../../errors/ApiError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import QueryBuilder from "../../builder/QueryBuilder";
import { Service } from "../services/service.model";
import { IProvider } from "./provider.interface";
import { Provider } from "./provider.model";

const createProvider =async (data:IProvider)=>{

    return await Provider.create(data)
}


const getAllProvidersByService = async(service:string)=>{
    return await Provider.find({status:'active',service:service})
}

const getAllProviders=async(query:Record<string,any>)=>{
    const result = new QueryBuilder(Provider.find({status:'active'}),query).sort()
    const data = await result.modelQuery.lean()
    const filterData = data.filter((item:any)=>{
        return !query.search || (
            item.name.toLowerCase().includes(query.search.toLowerCase()) ||
            item.service?.name.toLowerCase().includes(query.search.toLowerCase())
        )
    })

    const paginateArry = paginationHelper.paginateArray(filterData,result.query)

    return {
        data:paginateArry.data,
        pagination:paginateArry.pagination
    }
}

const getSingleProvider = async(id:string)=>{
    return await Provider.findOne({_id:id,status:'active'})
}

const updateProvider = async(id:string,data:any)=>{
    return await Provider.findByIdAndUpdate(id,data,{new:true})
}

const deleteProvider = async(id:string)=>{
    return await Provider.findByIdAndDelete(id)
}

export const ProviderService={
    createProvider,
    getAllProviders,
    getSingleProvider,
    updateProvider,
    deleteProvider,
    getAllProvidersByService
}