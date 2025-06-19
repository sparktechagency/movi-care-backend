import QueryBuilder from "../../builder/QueryBuilder"
import { IFacility } from "./facility.interface"
import { Facility } from "./facility.model"

const createFacility = async (payload:IFacility):Promise<IFacility | null>=>{
    const result = await Facility.create(payload)
    return result
}

const getAllFacilities = async (query:Record<string,any>)=>{
    const result = new QueryBuilder(Facility.find(),query).paginate()
    const paginationInfo = await result.getPaginationInfo()
    const data = await result.modelQuery.lean()
    return {data,paginationInfo}
}


const getSingleFacility = async (id:string):Promise<IFacility | null>=>{
    const result = await Facility.findById(id)
    return result
}
const updateFacility = async (id:string,payload:IFacility):Promise<IFacility | null>=>{
    const result = await Facility.findOneAndUpdate({_id:id},payload,{new:true})
    return result
}
const deleteFacility = async (id:string):Promise<IFacility | null>=>{
    const result = await Facility.findByIdAndDelete(id)
    return result
}
export const FacilityService = {
    createFacility,
    getAllFacilities,
    getSingleFacility,
    updateFacility,
    deleteFacility
}