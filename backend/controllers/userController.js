import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

//Authorization of user and getting the token
//route - /api/users/login - POST request
//access - Public

const authUser = asyncHandler(async(req,res) => {
    // destructuring the email and password from req.body
    const {email, password} = req.body;
    // check for the user in the database
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

//Registration of user 
//route - /api/users - POST request
//access - Public
const registerUser = asyncHandler(async(req,res) => {
    res.send('User Registration');
});

//Logout the user / clear cookie 
//route - /api/users/logout - POST request
//access - Private
const logoutUser = asyncHandler(async(req,res) => {
    res.send('User Logout');
});

//Get user profile 
//route - /api/users/profile - GET request
//access - Private
const getUserProfile = asyncHandler(async(req,res) => {
    res.send('get the user profile');
});

//Update the user profile
//route - /api/users/profile - PUT request
//access Private
const UpdateUserProfile = asyncHandler(async(req,res) => {
    res.send('Update the user profile');
});

//Get all the users profile - basically an admin funtion
//route - /api/users - GET request
//access Private/Admin
const getUsers = asyncHandler(async(req,res) => {
    res.send('get users');
});

//Get the user by id
//route - /api/users/:id - GET request 
//access Private/Admin
const getUserById = asyncHandler(async(req,res) => {
    res.send('get user by id');
});


//Delete a user profile
//route - /api/users/:id - DELETE request
//access Private/Admin
const deleteUser = asyncHandler(async(req,res) => {
    res.send('delete user');
});

//Update the user
//route - /api/users/:id - PUT request 
//access Private/Admin
const updateUser = asyncHandler(async(req,res) => {
    res.send('Update the user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    UpdateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}


