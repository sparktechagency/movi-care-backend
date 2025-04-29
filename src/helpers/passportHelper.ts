import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "../app/modules/user/user.model";

const initializePassport = () => {
    passport.initialize();
    passport.session();
};

const googleInitialize = () => {
    const googleStrategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:5004/auth/google/callback",
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
          });
          return done(null, newUser);
        }
      }
    );
    
    passport.use(googleStrategy);
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    })
    
    passport.deserializeUser(async (id: string, done) => {
      const user = await User.findById(id);
      done(null, user);
    })
}



export const passportHelper = { initializePassport , googleInitialize };