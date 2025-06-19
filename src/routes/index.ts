import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { LocationRoutes } from '../app/modules/location/location.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { ContactMessageRoutes } from '../app/modules/contact_message/contact_message.route';
import { ServiceRoutes } from '../app/modules/services/service.route';
import { ProviderRoutes } from '../app/modules/provider/provider.route';
import { BookingRoutes } from '../app/modules/booking/booking.route';
import { DisclaimerRoutes } from '../app/modules/disclaimer/disclaimer.route';
import { ClientRoutes } from '../app/modules/client/client.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { FacilityRoutes } from '../app/modules/facility/facility.route';
import { OverviewRoutes } from '../app/modules/overview/overview.route';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:'/location',
    route:LocationRoutes
  },
  {
    path:"/faq",
    route:FaqRoutes
  },
  {
    path:"/contact",
    route:ContactMessageRoutes
  },
  {
    path:"/service",
    route:ServiceRoutes
  },
  {
    path:"/provider",
    route:ProviderRoutes
  },
  {
    path:"/booking",
    route:BookingRoutes
  },
  {
    path:"/disclaimer",
    route:DisclaimerRoutes
  },
  {
    path:"/client",
    route:ClientRoutes
  },
  {
    path:"/review",
    route:ReviewRoutes
  },
  {
    path:"/facility",
    route:FacilityRoutes
  },
  {
    path:"/overview",
    route:OverviewRoutes
  },
  {
    path:"/notification",
    route:NotificationRoutes
  }
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;

