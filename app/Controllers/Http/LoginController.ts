// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// import { HttpContext } from "@adonisjs/core/build/standalone";
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import GeneratedExcel from "App/Models/GeneratedExcel";
import Orderdetail from "App/Models/Orderdetail";
import User from "App/Models/User";
import UserProfile from "App/Models/UsersProfile";
import { request } from "http";
import path from 'path';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import fs1 from 'fs'
import fs from 'fs/promises';
import { DateTime } from 'luxon';


// const Hash = require('Hash');

export default class LoginController {
    public MODEL :typeof User
    public Database: typeof GeneratedExcel
    public UserProfile: typeof UserProfile
    public Order: typeof Orderdetail
    public async register ({request,response}){
        {
            const { email } = request.only(['email']);

            try {
                const  existingUser= await User.query().where('email', email).first();


                if (existingUser) {
                  return response.send({
                    message: 'This Email is already registered.',
                  });

                }


                else {
                  const { username, email, password ,role} = request.only(['username', 'email','password','role']);
                  const salt = await bcrypt.genSalt(10);
                  const secPass= await bcrypt.hash(password,salt) ;
                  console.log(secPass)
                  const uploadedFile = request.file('image');
                  const formattedCreatedAt = DateTime.local().toFormat('yyyyMMddHHmmss');
                  const destinationPath = `./public/files/pic${formattedCreatedAt}.png`;

                  await fs.rename(uploadedFile.tmpPath, destinationPath);


                  const newUser = new User();
                  newUser.username = username;
                  newUser.email = email;
                  newUser.password = secPass;
                  newUser.role= role;
                  newUser.image=`files/pic${formattedCreatedAt}.png`;

                  // const tempFilePath = `Public/files/pic${formattedCreatedAt}.jpeg`;
                  // newUser.image=tempFilePath;

                  const user = await newUser.save();
                //   const success= true;
                  response.send({

                    user

                  });
                }
              } catch (err) {
                console.log(err)
                response.status(500).send({
                  message: err.message,
                });
              }
    }
}
// HttpContextContract
public async login ({request, response} ){


  {

    const {  email, password } = request.only(['email','password']);
    try {
      const user = await User.query().where('email', email).first();


    if (user ) {


      const isPasswordValid = await bcrypt.compare(password,user.password)

      // console.log(isPasswordValid)
       if(isPasswordValid)
       {
        const token = jwt.sign({ id: user.id }, 'MUSTAFAISGOODBOY', { expiresIn: '1h' });
   // const data = {
      //   user: {id: user.id}
      //  }
      //  const token = jwt.sign(data, JWT_SECRET,  { expiresIn: '1h' })
    const success=true;
        return response.send(
        {user,token,success}


      //  {token},

      );
       }
       else{
        const success=false;
        return response.send(
          {
            success,
            status: false,
            message: 'invalid password'
          }
        );
       }
    } else {
      const success=false;
      return response.send({
        success,
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    const success=false;
    return response.send({
      success,
      message: err.message,
    });
  }
  }
}
public async getAllUsers({ response }) {
  try {
    const users = await User.all();  // This fetches all users from the User table


    if (users && users.length)
     {
      return response.send({
        success: true,
        data: users,
      });
    } else {
      return response.send({
        success: false,
        message: "No users found.",
      });
    }
  } catch (err) {
    return response.status(500).send({
      success: false,
      message: err.message,
    });
  }
}
public async deleteUser({ request, response }) {
  try {
    const { id } = request.only(['id']);

    const user = await User.find(id); // This fetches a user with the given ID

    if (!user) {
      return response.send({
        success: false,
        message: `User with ID ${id} not found.`,
      });
    }

    // Deleting associated records in the generated_excels table
    const associatedRecords = await GeneratedExcel.query().where('user_id', id);

    if (associatedRecords ) {
      await GeneratedExcel.query().where('user_id', id).delete();
    }

    // Then delete the user
    await user.delete();  // This deletes the found user from the User table

    return response.send({
      success: true,
      message: `User with ID ${id} and associated records have been deleted successfully.`,
    });
  } catch (err) {
    return response.status(500).send({
      success: false,
      message: err.message,
    });
  }
}

public async updateUser({ request, response, params }) {
  try {
    const { id } = params;

    const userData = request.only(['username', 'email', 'phone', 'city', 'address', 'password']);

    const user = await User.find(id);

    if (!user) {
      return response.send({
        success: false,
        message: `User with ID ${id} not found.`,
      });
    }

    // Validate phone number format
    if (userData.phone && !/^92[0-9]{10}$/.test(userData.phone)) {
      return response.status(400).send({
        success: false,
        message: 'Invalid phone number format. It should start with 92 and must have 10 numbers following the 92.',
      });
    }

    // Update the user's primary attributes
    user.username = userData.username;
    user.email = userData.email;

    // Uncomment the following if you need to handle password updates
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(userData.password, salt);
    }

    await user.save();

    // Update UserProfile data
    let userProfile = await UserProfile.findBy('user_id', user.id);

    // If the user doesn't have a profile, create one
   if(userData.phone && userData.city &&userData.address!=='')
      {
        userProfile = new UserProfile();
      userProfile.user_id = user.id;


    userProfile.phone = userData.phone;
    userProfile.city = userData.city;
    userProfile.address = userData.address;

    await userProfile.save();

      }
    return response.send({
      success: true,
      message: `User with ID ${id} has been updated successfully.`,
    });

  } catch (err) {
    return response.status(500).send({
      success: false,
      message: err.message,
    });
  }
}
public async viewUserDetails({ params, response }) {

    const { id } = params;
    try {
      const userDetails = await User.query()
        .select('users.id as user_id', 'users.username', 'users.email', 'user_profiles.address', 'user_profiles.city', 'user_profiles.phone')
        .from('users')
        .innerJoin('user_profiles', 'users.id', 'user_profiles.user_id')
        .where('users.id', id);

      const userextras = userDetails.map(user => user.$extras);

      return response.send({
        success: true,
        userDetails,
        userextras
      });
    } catch (err) {
      return response.status(500).send({
        success: false,
        message: 'Failed to fetch user details.',
        error: err.message
      });
    }

}

  async storeUserProfile({ params, request, response }) {
    try {
      const { id } = params;

      const {address,city,phone} = request.only([  'address', 'city','phone']);
      // Find the user by id
      const user = await User.find(id);

      if (!user) {
        return response.status(404).send({
          success: false,
          message: 'User not found.'
        });
      }
if(address&& city && phone!==''){
  const userProfile = new UserProfile();
  userProfile.fill({
    address,
    city,
    phone
  });
  userProfile.user_id = user.id;
await userProfile.save();

  return response.send({
    success: true,
    message: 'User profile created successfully.'
  });
}
else{
  return response.send({
    success: true,
    message: 'User profile not created .'
  });
}
      // Create a new user profile for the user

    } catch (err) {
      return response.status(500).send({
        success: false,
        message: 'Failed to create user profile.',
        error: err.message
      });
    }
  }



 public async getUserProfiles({ params, response }) {
    try {
      const { id } = params;

      // Fetch all user profiles associated with the user_id
      const userProfiles = await UserProfile.query()
        .where('user_id', id)
        // .fetch();

      return response.send({
        success: true,
        userProfiles
      });
    } catch (err) {
      return response.status(500).send({
        success: false,
        message: 'Failed to fetch user profiles.',
        error: err.message
      });
    }
  }

  // public async UserWithTotalRecords({ response }) {
  //   try {
  //     const users = await User.all();  // This fetches all users from the User table
  //     const order= await Order
  //     if (users && users.length) {



  //       return response.send({
  //         success: true,
  //         data: users,
  //       });
  //     } else {
  //       return response.send({
  //         success: false,
  //         message: "No users found.",
  //       });
  //     }
  //   } catch (err) {
  //     return response.status(500).send({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // }




  // Your existing viewUserDetails method here...
  public async downloadFile1({ request, response }) {
    try {
      const { filename } = request.only(['filename']);
      console.log(filename)
      const filePath = path.join('Public/files/', filename);

      // Check if the file exists
      if (fs1.existsSync(filePath)) {
        // Set appropriate headers for the file response
        response.header('Content-Disposition', `attachment; filename="${filename}"`);
        response.download(filePath);
      } else {
        return response.status(404).json({ message: 'File not found.' });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      return response.status(500).json({ error: 'An error occurred while downloading the file.' });
    }
  }

}

