import { Request, Response } from "express";
import { stripe } from "../helpers/stripeHelper";
import config from "../config";
import { BookingService } from "../app/modules/booking/booking.service";

export const handleWebhook = async(req:Request,res:Response)=>{
    const sig = req.headers['stripe-signature'];
    const endpointSecret = config.stripe.webhook_secret;
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
    } catch (err:any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const paymentIntentId = session?.payment_intent;
        const metaData = session?.metadata?.data;
        if(!metaData){
          return
        }
        await BookingService.verifyOrder(JSON.parse(metaData!),paymentIntentId as any)
        break;
  
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    res.json({ received: true });
}