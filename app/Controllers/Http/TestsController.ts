// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// import User from "App/Models/User";

// export default class TestsController {
//     public MODEL :typeof User
//     // constructor(){
//     //     super()
//     //     this.user=User
//     // }
//     public async test({ request, response }) {
//         {
//           try {
//             const { username, email } = request.only(['username', 'email']);
      
//             const user = new User();
//             user.username = username;
//             user.email = email;
//             await user.save();
      
//             return response.status(201).json(user);
//           } catch (error) {
//             console.log(error)
//             return response.status(500).json({ error: 'An error occurred while creating the user.' });
//           }
//         }
//       }
// }
