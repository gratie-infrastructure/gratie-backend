// /* eslint-disable new-cap */

// import bcrypt from '@types/bcryptjs';
// import Util from "../../lib/util";
// import logger from "../../lib/logger";
// import Auth from './auth.schema';


// export default new class AuthService {
//   generateToken = (walletAddr:string) => {
//     const user = await Auth.findOne({ walletAddr });
//     if(user) {
//         if (user && (await bcrypt.compare(walletAddr, user.walletAddr))) {
//             // Create token
//             const token = jwt.sign(
//               { user_id: user._id, email },
//               process.env.TOKEN_KEY,
//               {
//                 expiresIn: "2h",
//               }
//             );
      
//             // save user token
//             user.token = token;
//     }
//   }
// };
