import QueryBuilder from "../../builder/QueryBuilder";
import { IContactMessage } from "./contact_massage.interface";
import { ContactMessage } from "./contact_message.model";

const creataContactMessageToDB = async (data:IContactMessage)=>{
    const result = await ContactMessage.create(data);
    return result;
}

const getAllContactMessagesFromDB=async(query:Record<string,any>)=>{
    const result = new QueryBuilder(ContactMessage.find({status:"active"}),query).paginate().search(['name','email']).sort()
    const paginationResult = await result.getPaginationInfo();
    const data = await result.modelQuery.lean()
    return {paginationResult,data};
}

const readMessage = async (id:string)=>{
    const result = await ContactMessage.findByIdAndUpdate(id,{read:true},{new:true})
    return result;
}

const readAllMessages = async ()=>{
    const result = await ContactMessage.updateMany({read:false,status:'active'},{$set:{read:true}})
    return result;
}

const deleteMessage = async (id:string)=>{
    const result = await ContactMessage.findByIdAndUpdate({_id:id},{$set:{status:'deleted'}},{new:true});
    return result;
}

const singleMessage = async (id:string)=>{
    const result = await ContactMessage.findById(id);
    return result;
}

export const ContactMessageService={
    creataContactMessageToDB,
    getAllContactMessagesFromDB,
    readMessage,
    readAllMessages,
    deleteMessage,
    singleMessage
}