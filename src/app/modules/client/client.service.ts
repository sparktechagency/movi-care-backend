import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { IClient } from "./client.interface";
import { Client } from "./client.model";

const createClientIntoDB = async (data:IClient)=>{
    const result=await Client.create(data);
    return result;
}

const getAllClientsFromDB =async(query:Record<string,any>)=>{
    const result = new QueryBuilder(Client.find(),query).paginate().sort()
    const paginatedResult = await result.getPaginationInfo()
    const data = await result.modelQuery.lean()
    return {data,paginatedResult}
}

const updateClientIntoDB =async(id:string,data:any)=>{
    const client= await Client.findById(id);
    if(!client){
        throw new Error("Client not found");
    }
    if(client.image){
        unlinkFile(client.image);
    }
    const result= await Client.findByIdAndUpdate(id,{$set:data},{new:true});
    return result
}
const deleteClientFromDB = async(id:string)=>{
    const result= await Client.findOneAndDelete({_id:id});
    return result
}

export const ClientService={
    createClientIntoDB,
    getAllClientsFromDB,
    updateClientIntoDB,
    deleteClientFromDB
}