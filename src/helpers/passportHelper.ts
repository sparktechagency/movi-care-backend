import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "../app/modules/user/user.model";
import { USER_ROLES } from "../enums/user";
import config from "../config";

const initializePassport = () => {
    passport.initialize();
    passport.session();
};

const googleInitialize = () => {
    const googleStrategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${config.url.base_urL}/api/v1/auth/google/callback`,
        scope: ["email", "profile"],
      },
      async function (accessToken, refreshToken, profile, done) {
        const  existUser = await User.findOne({ email: profile.emails![0].value });
        if (existUser) {
            
            
          return done(null, existUser);

        } else {
            
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails![0].value,
            role:USER_ROLES.USER,
            password:'12345678',
            verified: true,
          });
          return done(null, newUser);
        }
      }
    );
    
    passport.use(googleStrategy);
  
}

passport.serializeUser((user:any,done)=>{
    done(null,user._id)
})

passport.deserializeUser(async(id:string,done)=>{
   try{
       const user=await User.findById(id).select('-password')
       done(null,user)
   }catch(err:any){
       console.log('error',err.message);
   }
}
)


export const passportHelper = { initializePassport , googleInitialize };